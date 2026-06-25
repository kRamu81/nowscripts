import { Schema, model, Document } from "mongoose";

export interface IQuestion {
  question: string;
  answer?: string;
  explanation?: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface IRound {
  name: string;
  duration?: string;
  questionsAsked?: string;
  candidateExperience?: string;
  tips?: string;
}

export interface IInterviewExperience extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  role: string;
  experienceLevel: string;
  location?: string;
  interviewDate?: Date;
  salaryRange?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  overallRating: number;
  result: "Selected" | "Rejected" | "Waiting" | "Offer Received";
  rounds: IRound[];
  technicalQuestions: IQuestion[];
  scenarioQuestions: IQuestion[];
  hrQuestions: IQuestion[];
  codingQuestions: IQuestion[];
  preparationTips?: string;
  resources?: string;
  mistakes?: string;
  overallExperience?: string;
  tags: string[];
  author: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  bookmarks: Schema.Types.ObjectId[];
  views: number;
  comments: Schema.Types.ObjectId[];
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  answer: String,
  explanation: String,
  topic: String,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
}, { _id: true });

const RoundSchema = new Schema<IRound>({
  name: { type: String, required: true },
  duration: String,
  questionsAsked: String,
  candidateExperience: String,
  tips: String,
}, { _id: true });

const InterviewExperienceSchema = new Schema<IInterviewExperience>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true, index: true },
    companyLogo: { type: String },
    role: { type: String, required: true, index: true },
    experienceLevel: { type: String, required: true, index: true },
    location: { type: String },
    interviewDate: { type: Date },
    salaryRange: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true, index: true },
    overallRating: { type: Number, min: 1, max: 5, required: true },
    result: { type: String, enum: ["Selected", "Rejected", "Waiting", "Offer Received"], required: true, index: true },
    rounds: [RoundSchema],
    technicalQuestions: [QuestionSchema],
    scenarioQuestions: [QuestionSchema],
    hrQuestions: [QuestionSchema],
    codingQuestions: [QuestionSchema],
    preparationTips: { type: String },
    resources: { type: String },
    mistakes: { type: String },
    overallExperience: { type: String },
    tags: [{ type: String, index: true }],
    author: { type: Schema.Types.ObjectId, ref: "users", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "users" }],
    views: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
    status: { type: String, enum: ["Draft", "Pending", "Approved", "Rejected"], default: "Pending", index: true },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
InterviewExperienceSchema.index({
  title: "text",
  company: "text",
  role: "text",
  tags: "text",
});

const InterviewExperience = model<IInterviewExperience>("InterviewExperience", InterviewExperienceSchema);

export default InterviewExperience;
