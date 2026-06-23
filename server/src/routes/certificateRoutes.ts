import { Router } from "express";
import {
  createCertificate,
  getCertificate,
  listCertificates,
  updateCertificate,
  revokeCertificate,
} from "../controllers/certificateController";
import isAuthenticated from "../middlewares/auth";
import isAdmin from "../middlewares/isAdmin";

const router = Router();

// Public verification endpoint
router.get("/verify/:id", getCertificate);

// Admin endpoints
router.post("/create", isAuthenticated, isAdmin, createCertificate);
router.get("/list", isAuthenticated, isAdmin, listCertificates);
router.put("/update/:id", isAuthenticated, isAdmin, updateCertificate);
router.patch("/revoke/:id", isAuthenticated, isAdmin, revokeCertificate);

export default router;
