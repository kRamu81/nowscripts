import { Router } from "express";
import { getProgress, updateProgress, resetProgress } from "../controllers/interviewPrepProgressController";
import isAuth from "../middlewares/auth";

const router = Router();

router.get("/:categoryId", isAuth, getProgress);
router.post("/:categoryId/update", isAuth, updateProgress);
router.post("/:categoryId/reset", isAuth, resetProgress);

export default router;
