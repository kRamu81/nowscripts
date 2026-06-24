import { Schema, model, InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL index
    },
  },
  { timestamps: true }
);

type SessionInferType = InferSchemaType<typeof sessionSchema>;
export default model<SessionInferType>("sessions", sessionSchema);
