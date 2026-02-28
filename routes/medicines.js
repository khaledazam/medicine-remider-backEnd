import express from "express";
import multer from "multer";
import path from "path";
import {
  addMedicine,
  editMedicine,
  deleteMedicine,
  getMedicines,
  markDoseTaken,
  getMissedDoses,
  getRefillAlerts,
  getDailySummary,
  getCalendarSchedule,
  uploadPrescription,
} from "../controllers/medicineController.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescriptions/"); // المجلد اللي ستخزن فيه الصور
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // قبول صور فقط
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, GIF)"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// CRUD على Medicine
router.get("/", getMedicines);                  // Get all medicines
router.post("/create", addMedicine);           // Add new medicine
router.put("/edit/:id", editMedicine);         // Edit medicine
router.delete("/delete/:id", deleteMedicine); // Delete medicine

// Dose actions
router.post("/mark-taken/:id", markDoseTaken);  // Mark dose as taken

// Reports & alerts
router.get("/missed-doses", getMissedDoses);      // Missed doses
router.get("/refill-alerts", getRefillAlerts);    // Refill alerts
router.get("/daily-summary", getDailySummary);    // Daily summary
router.get("/calendar", getCalendarSchedule);     // 30-day calendar schedule

// Upload prescription image
router.post("/upload-prescription/:id", upload.single("prescription"), uploadPrescription);

export default router;