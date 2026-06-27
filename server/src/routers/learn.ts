import { Router } from "express";
import Course from "../models/course";
import Module from "../models/module";
import Lesson from "../models/lesson";
import Quiz from "../models/quiz";
import UserProgress from "../models/userProgress";
import Bookmark from "../models/bookmark";
import { cacheService } from "../utils/cache";

const router = Router();

// Get all courses with modules
router.get("/courses", async (req, res) => {
  try {
    const courses = await cacheService.fetchWithCache('all_courses', () => 
      Course.find().populate("modules").sort({ order: 1 }).lean()
    , 300);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single module with lesson and quiz
router.get("/modules/:id", async (req, res) => {
  try {
    const data = await cacheService.fetchWithCache(`module_${req.params.id}`, async () => {
      const module = await Module.findById(req.params.id).populate("courseId").lean();
      if (!module) throw new Error("Module not found");

      const [lesson, quiz] = await Promise.all([
        Lesson.findOne({ moduleId: module._id }).lean(),
        Quiz.findOne({ moduleId: module._id }).lean()
      ]);

      return { module, lesson, quiz };
    }, 300);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    if (error.message === "Module not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user progress
router.get("/progress/:userId", async (req, res) => {
  try {
    const [progressResult, totalModules] = await Promise.all([
      UserProgress.findOne({ userId: req.params.userId }).populate("completedModules").lean(),
      cacheService.fetchWithCache('total_modules_count', () => Module.countDocuments(), 300)
    ]);
    
    let progress = progressResult;
    if (!progress) {
      const newProgress = await UserProgress.create({ userId: req.params.userId });
      // Can't lean() on create directly, so just convert to object or refetch
      progress = newProgress.toObject();
    }
    
    res.status(200).json({
      success: true,
      data: progress,
      totalModules
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark module complete
router.post("/progress/complete", async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
    }

    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      // Basic streak logic (in a real app, calculate based on dates)
      progress.learningStreak += 1;
      progress.lastActive = new Date();
      await progress.save();
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get bookmarks
router.get("/bookmarks/:userId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId }).populate("moduleId");
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle bookmark
router.post("/bookmarks", async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    const existing = await Bookmark.findOne({ userId, moduleId });
    
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      res.status(200).json({ success: true, message: "Bookmark removed", bookmarked: false });
    } else {
      await Bookmark.create({ userId, moduleId });
      res.status(200).json({ success: true, message: "Bookmark added", bookmarked: true });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Future AI Routes Stub ---
router.post("/ai/quiz", (req, res) => res.json({ message: "AI Quiz generation coming soon" }));
router.post("/ai/notes", (req, res) => res.json({ message: "AI Notes generation coming soon" }));
router.post("/ai/interview", (req, res) => res.json({ message: "AI Interview coming soon" }));

export default router;
