import { Schema, model, InferSchemaType } from "mongoose";

const activityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET', 'OTP_REQUEST', 'ACCOUNT_DISABLED', 'ACCOUNT_ENABLED'],
    },
    ipAddress: {
      type: String,
    },
    deviceInfo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    },
    details: {
      type: String,
    }
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

type ActivityLogInferType = InferSchemaType<typeof activityLogSchema>;
export default model<ActivityLogInferType>("activity_logs", activityLogSchema);
