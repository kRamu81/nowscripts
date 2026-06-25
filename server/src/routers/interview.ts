import express from "express";
import {
  createInterviewExperience,
  getInterviewExperiences,
  getInterviewExperienceById,
  updateInterviewExperience,
  deleteInterviewExperience,
  approveInterviewExperience,
  toggleLikeExperience,
  toggleBookmarkExperience,
  incrementViewCount
} from "../controllers/interview.controller";
import isAuthenticated, { optionalAuth, adminGuard } from "../middlewares/auth";

const router = express.Router();

// Publicly accessible with optional auth for customized results (like own pending posts)
router.get("/", optionalAuth, getInterviewExperiences);
router.get("/:id", optionalAuth, getInterviewExperienceById);

// Analytics
router.post("/:id/view", incrementViewCount);

// Require Auth
router.use(isAuthenticated);

router.post("/", createInterviewExperience);
router.put("/:id", updateInterviewExperience);
router.delete("/:id", deleteInterviewExperience);

// Interactions
router.post("/:id/like", toggleLikeExperience);
router.post("/:id/bookmark", toggleBookmarkExperience);

// Admin only routes
router.patch("/:id/approve", adminGuard, approveInterviewExperience);

export default router;
