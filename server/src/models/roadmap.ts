import { Schema, model, InferSchemaType } from "mongoose";

const roadmapSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], required: true },
    estimatedDuration: { type: String, required: true },
    certification: { type: String },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

type roadmapSchemaInferType = InferSchemaType<typeof roadmapSchema>;

roadmapSchema.index({ order: 1 });

export default model<roadmapSchemaInferType>("roadmaps", roadmapSchema);
