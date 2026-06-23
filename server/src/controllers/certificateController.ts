import { Request, Response, NextFunction } from "express";
import Certificate from "../models/certificate";
import ServerError from "../utils/ServerError";
import crypto from "crypto";

const generateCertificateId = async () => {
  const currentYear = new Date().getFullYear();
  // Find the latest certificate for the current year to get the sequential number
  const lastCert = await Certificate.findOne({
    certificateId: { $regex: `^NS-${currentYear}-` }
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastCert) {
    const parts = lastCert.certificateId.split("-");
    const lastSequence = parseInt(parts[2], 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  // Format as NS-YYYY-XXXX (e.g., NS-2026-0001)
  return `NS-${currentYear}-${sequence.toString().padStart(4, "0")}`;
};

const generateVerificationNumber = () => {
  // Generate random 8 character hex string (e.g., NSV-8F3A7B92)
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `NSV-${randomHex}`;
};

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { candidateName, email, internshipTitle, companyName, issueDate, startDate, endDate, mentorName } = req.body;

    const certificateId = await generateCertificateId();
    const verificationNumber = generateVerificationNumber();
    const verificationUrl = `${req.protocol}://${req.get("host")}/verify/${certificateId}`; // Usually we use a frontend URL but this is just a placeholder, the frontend will override this or display its own. Wait, we should probably just store the path or let the frontend reconstruct it. Let's just store the relative path.
    const relativeVerificationUrl = `/verify/${certificateId}`;

    const newCertificate = await Certificate.create({
      certificateId,
      verificationNumber,
      candidateName,
      email,
      internshipTitle,
      companyName: companyName || "NowScripts Private Limited",
      issueDate,
      startDate,
      endDate,
      mentorName,
      verificationUrl: relativeVerificationUrl,
      issuedBy: req.userId,
    });

    res.status(201).json(newCertificate);
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Can be certificateId or verificationNumber

    const certificate = await Certificate.findOne({
      $or: [{ certificateId: id }, { verificationNumber: id }]
    });

    if (!certificate) {
      throw new ServerError(404, "Certificate Not Found. This certificate does not exist in the NowScripts verification database.");
    }

    res.status(200).json(certificate);
  } catch (error) {
    next(error);
  }
};

export const listCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const query: any = {};
    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { certificateId: { $regex: search, $options: "i" } },
        { candidateName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const certificates = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("issuedBy", "name email");

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      certificates,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const certificate = await Certificate.findOneAndUpdate(
      { certificateId: id },
      { $set: updateData },
      { new: true }
    );

    if (!certificate) {
      throw new ServerError(404, "Certificate Not Found");
    }

    res.status(200).json(certificate);
  } catch (error) {
    next(error);
  }
};

export const revokeCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findOneAndUpdate(
      { certificateId: id },
      { $set: { status: "Revoked" } },
      { new: true }
    );

    if (!certificate) {
      throw new ServerError(404, "Certificate Not Found");
    }

    res.status(200).json(certificate);
  } catch (error) {
    next(error);
  }
};
