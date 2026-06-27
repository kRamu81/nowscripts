import { Schema, InferSchemaType, model } from "mongoose";

const userSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    markdown: {
      type: String,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    tags: [{ type: String, required: true }],
    votes: [{ type: Schema.Types.ObjectId, ref: "users" }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        comment: String,
      },
    ],
    image: String,
    summary: String,
    savedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    postType: {
      type: String,
      enum: ["Article", "Notes", "Discussion", "Project", "Interview", "Certification"],
      default: "Article",
    },
    views: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    readTime: { type: Number, default: 4 }, // in minutes
  },
  { timestamps: true }
);

type userSchemaInferType = InferSchemaType<typeof userSchema>;

// Indexes for performance
userSchema.index({ userId: 1 });
userSchema.index({ tags: 1 });
userSchema.index({ createdAt: -1 });

export default model<userSchemaInferType>("posts", userSchema);
