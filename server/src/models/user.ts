import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    authProviders: [{
      type: String,
      enum: ['google', 'password'],
      default: ['password']
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: String,
    avatar: String,
    location: String,
    college: String,
    currentRole: String,
    currentLearningTrack: String,
    socialLinks: {
      github: String,
      linkedin: String,
      portfolio: String,
      website: String,
    },
    servicenow: {
      csaStatus: { type: String, enum: ['Not Started', 'In Progress', 'Certified'], default: 'Not Started' },
      cadStatus: { type: String, enum: ['Not Started', 'In Progress', 'Certified'], default: 'Not Started' },
      itsmStatus: { type: String, enum: ['Not Started', 'In Progress', 'Certified'], default: 'Not Started' },
      currentCertificationGoal: String,
      currentModule: String,
      learningProgress: { type: Number, default: 0 },
    },
    privacy: {
      isPublicProfile: { type: Boolean, default: true },
      showCertifications: { type: Boolean, default: true },
      showLearningProgress: { type: Boolean, default: true },
      showActivityFeed: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
    },
    aboutMe: String,
    followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "users" }],
    lists: [
      {
        name: { type: String },
        posts: [{ type: Schema.Types.ObjectId, ref: "posts" }],
        images: [{ type: String }],
      },
    ],
    intrests: [{ type: String, required: true }],
    ignore: [{ type: Schema.Types.ObjectId, ref: "posts" }],
    mutedAuthor: [{ type: Schema.Types.ObjectId, ref: "users" }],
    notifications: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        username: { type: String, required: true },
        avatar: String,
        message: { type: String, required: true },
        postId: { type: Schema.Types.ObjectId, ref: "posts" },
        postTitle: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    xp: { type: Number, default: 0 },
    learningStreak: { type: Number, default: 0 },
    badges: [{ type: String }],
    certifications: [{ type: String }],
    role: { 
      type: String, 
      enum: ['Super Admin', 'Admin', 'user'],
      default: "user" 
    },
    contributionScore: { type: Number, default: 0 },
    skills: [{ type: String }],
    // Future features prep
    leaderboardRank: { type: Number },
    achievements: [{ 
      title: String,
      dateEarned: { type: Date, default: Date.now }
    }],
  },
  { timestamps: true }
);

type userSchemaInferType = InferSchemaType<typeof userSchema>;
export default model<userSchemaInferType>("users", userSchema);
