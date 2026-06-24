import { Schema, model, InferSchemaType } from "mongoose";

const passwordResetSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL index: document will be automatically deleted at expiresAt
    },
  },
  { timestamps: true }
);

type PasswordResetInferType = InferSchemaType<typeof passwordResetSchema>;
export default model<PasswordResetInferType>("password_resets", passwordResetSchema);
