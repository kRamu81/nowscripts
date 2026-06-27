import express from "express";
import Roadmap from "../models/roadmap";
import RoadmapModule from "../models/RoadmapModule";
import RoadmapProgress from "../models/RoadmapProgress";
import User from "../models/user";
import { cacheService } from "../utils/cache";

const router = express.Router();

// Get all roadmaps
router.get("/", async (req, res) => {
  try {
    const roadmaps = await cacheService.fetchWithCache('all_roadmaps', () => 
      Roadmap.find().sort({ order: 1 }).lean()
    , 300);
    res.status(200).json({ success: true, data: roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching roadmaps" });
  }
});

// Get single roadmap with modules
router.get("/:slug", async (req, res) => {
  try {
    const data = await cacheService.fetchWithCache(`roadmap_${req.params.slug}`, async () => {
      const roadmap = await Roadmap.findOne({ slug: req.params.slug }).lean();
      if (!roadmap) throw new Error("Roadmap not found");

      const modules = await RoadmapModule.find({ roadmapId: roadmap._id }).sort({ order: 1 }).lean();
      return { roadmap, modules };
    }, 300);

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    if (error.message === "Roadmap not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error fetching roadmap" });
  }
});

// Mocked user progress endpoints since authentication requires valid tokens
router.post("/progress/:userId/:roadmapId", async (req, res) => {
  try {
    const { userId, roadmapId } = req.params;
    const { moduleId } = req.body;

    let progress = await RoadmapProgress.findOne({ userId, roadmapId });
    if (!progress) {
      progress = new RoadmapProgress({ userId, roadmapId, completedModules: [] });
    }

    if (!progress.completedModules.includes(moduleId as any)) {
      progress.completedModules.push(moduleId as any);
      
      const totalModules = await RoadmapModule.countDocuments({ roadmapId });
      progress.progressPercentage = Math.round((progress.completedModules.length / totalModules) * 100);
      progress.lastVisited = new Date();
      await progress.save();

      // Award XP
      const user = await User.findById(userId);
      if (user) {
        user.xp = (user.xp || 0) + 50; // 50 XP per module
        
        // Check for badge
        if (progress.progressPercentage === 100) {
          const roadmap = await Roadmap.findById(roadmapId);
          if (roadmap && roadmap.certification) {
             if (!user.badges.includes(roadmap.certification)) {
               user.badges.push(roadmap.certification);
             }
          }
        }
        await user.save();
      }
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating progress" });
  }
});

export default router;
