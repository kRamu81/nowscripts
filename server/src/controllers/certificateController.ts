import { Request, Response, NextFunction } from "express";
import Certificate from "../models/certificate";
import ServerError from "../utils/ServerError";
import crypto from "crypto";

const generateCertificateId = async () => {
  let isUnique = false;
  let id = "";
  
  while (!isUnique) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const chars = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const numbers = Math.floor(1000 + Math.random() * 9000); // 1000 to 9999
    id = `CID${chars}${numbers}`;
    
    const existing = await Certificate.findOne({ certificateId: id });
    if (!existing) {
      isUnique = true;
    }
  }
  return id;
};

const generateVerificationNumber = () => {
  // Generate random 8 character hex string (e.g., NSV-8F3A7B92)
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `NSV-${randomHex}`;
};

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      candidateName, email, internshipTitle, companyName, 
      issueDate, startDate, endDate, mentorName,
      templateType, department, projectUndertaken, rolesAndResponsibilities, location
    } = req.body;

    const certificateId = await generateCertificateId();
    const verificationNumber = generateVerificationNumber();
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
      templateType,
      department,
      projectUndertaken,
      rolesAndResponsibilities,
      location,
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
