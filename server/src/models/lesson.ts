import { Schema, model, InferSchemaType } from "mongoose";

const lessonSchema = new Schema({
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: "modules",
    required: true,
  },
  contentMarkdown: {
    type: String,
    required: true,
  },
  codeExamples: [{
    title: String,
    code: String,
    language: String
  }],
  resources: [{
    title: String,
    url: String
  }]
}, { timestamps: true });

type lessonSchemaInferType = InferSchemaType<typeof lessonSchema>;

lessonSchema.index({ moduleId: 1 });

export default model<lessonSchemaInferType>("lessons", lessonSchema);
