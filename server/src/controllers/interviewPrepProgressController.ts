import { Request, Response } from "express";
import InterviewPrepProgress from "../models/interviewPrepProgress";

export const getProgress = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let progress = await InterviewPrepProgress.findOne({ userId, categoryId });

    if (!progress) {
      progress = await InterviewPrepProgress.create({
        userId,
        categoryId,
        completedQuestions: [],
        bookmarkedQuestions: [],
        importantQuestions: [],
        lastViewedQuestion: null,
        progressPercentage: 0
      });
    }

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error getting interview prep progress:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const {
      completedQuestions,
      bookmarkedQuestions,
      importantQuestions,
      lastViewedQuestion,
      progressPercentage
    } = req.body;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const progress = await InterviewPrepProgress.findOneAndUpdate(
      { userId, categoryId },
      {
        $set: {
          ...(completedQuestions && { completedQuestions }),
          ...(bookmarkedQuestions && { bookmarkedQuestions }),
          ...(importantQuestions && { importantQuestions }),
          ...(lastViewedQuestion !== undefined && { lastViewedQuestion }),
          ...(progressPercentage !== undefined && { progressPercentage })
        }
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error updating interview prep progress:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const resetProgress = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const progress = await InterviewPrepProgress.findOneAndUpdate(
      { userId, categoryId },
      {
        $set: {
          completedQuestions: [],
          lastViewedQuestion: null,
          progressPercentage: 0
        }
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error resetting interview prep progress:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
