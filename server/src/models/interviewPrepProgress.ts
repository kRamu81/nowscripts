import { Schema, model, InferSchemaType } from "mongoose";

const interviewPrepProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  categoryId: {
    type: String,
    required: true, // e.g., "csa", "cad"
  },
  completedQuestions: [{
    type: String
  }],
  bookmarkedQuestions: [{
    type: String
  }],
  importantQuestions: [{
    type: String
  }],
  lastViewedQuestion: {
    type: String,
    default: null
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index to ensure one progress record per user per category
interviewPrepProgressSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

type interviewPrepProgressSchemaInferType = InferSchemaType<typeof interviewPrepProgressSchema>;
export default model<interviewPrepProgressSchemaInferType>("interviewprepprogresses", interviewPrepProgressSchema);
