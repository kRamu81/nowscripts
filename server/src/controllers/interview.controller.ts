import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import InterviewExperience from "../models/InterviewExperience";
import User from "../models/user";
import { FilterQuery } from "mongoose";

// Create a new Interview Experience
export const createInterviewExperience = asyncHandler(async (req: Request, res: Response) => {
  const authorId = req.userId;
  
  // Create experience with "Pending" status by default
  const newExperience = new InterviewExperience({
    ...req.body,
    author: authorId,
    status: "Pending" // Force pending status regardless of input
  });

  const savedExperience = await newExperience.save();
  res.status(201).json(savedExperience);
});

// Get all Interview Experiences with Pagination, Search, and Filtering
export const getInterviewExperiences = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Search parameters
  const searchQuery = req.query.search as string;
  const company = req.query.company as string;
  const experienceLevel = req.query.experienceLevel as string;
  const difficulty = req.query.difficulty as string;
  const result = req.query.result as string;
  const authorId = req.query.author as string;
  const status = req.query.status as string; // For admin/user specific fetching
  
  // Is admin?
  const currentUser = await User.findById(req.userId);
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "Super Admin";

  let filter: FilterQuery<any> = {};

  // Default to only showing Approved unless it's an admin looking for others, or a user looking for their own
  if (!authorId && !isAdmin) {
    filter.status = "Approved";
  } else if (status) {
    // If specific status requested
    filter.status = status;
  } else if (!isAdmin && authorId !== req.userId) {
    // Users can't see other users' non-approved posts
    filter.status = "Approved";
  }

  if (authorId) filter.author = authorId;
  if (company) filter.company = new RegExp(company, 'i');
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (difficulty) filter.difficulty = difficulty;
  if (result) filter.result = result;

  if (searchQuery) {
    filter.$text = { $search: searchQuery };
  }

  // Fetch data
  const experiences = await InterviewExperience.find(filter)
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await InterviewExperience.countDocuments(filter);

  res.status(200).json({
    experiences,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// Get a single Interview Experience by ID
export const getInterviewExperienceById = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findById(req.params.id)
    .populate("author", "name username avatar")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "name username avatar"
      }
    });

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  // Viewability check
  const currentUser = await User.findById(req.userId);
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "Super Admin";
  const isAuthor = (experience.author as any)._id.toString() === req.userId;

  if (experience.status !== "Approved" && !isAdmin && !isAuthor) {
    res.status(403);
    throw new Error("This experience is pending approval");
  }

  res.status(200).json(experience);
});

// Update an Interview Experience
export const updateInterviewExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  const currentUser = await User.findById(req.userId);
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "Super Admin";
  const isAuthor = experience.author.toString() === req.userId;

  if (!isAdmin && !isAuthor) {
    res.status(403);
    throw new Error("Not authorized to update this experience");
  }

  const updatedExperience = await InterviewExperience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedExperience);
});

// Delete an Interview Experience
export const deleteInterviewExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  const currentUser = await User.findById(req.userId);
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "Super Admin";
  const isAuthor = experience.author.toString() === req.userId;

  if (!isAdmin && !isAuthor) {
    res.status(403);
    throw new Error("Not authorized to delete this experience");
  }

  await InterviewExperience.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Interview experience deleted" });
});

// Admin Approve/Reject
export const approveInterviewExperience = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const currentUser = await User.findById(req.userId);
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "Super Admin";

  if (!isAdmin) {
    res.status(403);
    throw new Error("Only admins can approve or reject experiences");
  }

  const experience = await InterviewExperience.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  res.status(200).json(experience);
});

// Like / Unlike Experience
export const toggleLikeExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  const userIdObj = req.userId as any;
  const index = experience.likes.indexOf(userIdObj);

  if (index === -1) {
    experience.likes.push(userIdObj);
  } else {
    experience.likes.splice(index, 1);
  }

  await experience.save();
  res.status(200).json(experience);
});

// Bookmark / Unbookmark Experience
export const toggleBookmarkExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  const userIdObj = req.userId as any;
  const index = experience.bookmarks.indexOf(userIdObj);

  if (index === -1) {
    experience.bookmarks.push(userIdObj);
  } else {
    experience.bookmarks.splice(index, 1);
  }

  await experience.save();
  res.status(200).json(experience);
});

// Increment View Count
export const incrementViewCount = asyncHandler(async (req: Request, res: Response) => {
  const experience = await InterviewExperience.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!experience) {
    res.status(404);
    throw new Error("Interview experience not found");
  }

  res.status(200).json({ views: experience.views });
});
