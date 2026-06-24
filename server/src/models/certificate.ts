import { Schema, model, InferSchemaType } from "mongoose";

const INTERNSHIP_PROGRAMS = [
  "ServiceNow Fundamentals Internship",
  "ServiceNow Administration Internship",
  "ServiceNow Developer Internship",
  "ITSM Internship",
  "ServiceNow CSA Preparation Internship",
  "Technical Content Writing Internship",
  "Community Management Internship",
  "Frontend Development Internship"
];

const certificateSchema = new Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verificationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    internshipTitle: {
      type: String,
      required: true,
      enum: INTERNSHIP_PROGRAMS,
    },
    companyName: {
      type: String,
      default: "NowScripts Private Limited",
    },
    issueDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    mentorName: {
      type: String,
      required: true,
    },
    verificationUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Revoked", "Expired"],
      default: "Active",
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    templateType: {
      type: String,
      enum: [
        "Offer Letter",
        "Internship Completion Letter",
        "Internship Certificate",
        "Experience Letter",
        "Appreciation Certificate",
        "Training Completion Certificate"
      ],
      default: "Internship Completion Letter"
    },
    department: { type: String },
    projectUndertaken: { type: String },
    rolesAndResponsibilities: { type: String },
    location: { type: String, default: "Remote" },
    // Future Digital Badge System Prep
    badgeId: { type: String },
    badgeName: { type: String },
    badgeImage: { type: String },
    badgeLevel: { type: String },
  },
  { timestamps: true }
);

export type CertificateType = InferSchemaType<typeof certificateSchema>;
export const InternshipPrograms = INTERNSHIP_PROGRAMS;
export default model<CertificateType>("Certificate", certificateSchema);
