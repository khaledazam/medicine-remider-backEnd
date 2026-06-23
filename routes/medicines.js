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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescriptions/"); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
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
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.get("/", getMedicines);                  
router.post("/create", addMedicine);           
router.put("/edit/:id", editMedicine);        
router.delete("/delete/:id", deleteMedicine); 

router.post("/mark-taken/:id", markDoseTaken); 

router.get("/missed-doses", getMissedDoses);     
router.get("/refill-alerts", getRefillAlerts);    
router.get("/daily-summary", getDailySummary);    
router.get("/calendar", getCalendarSchedule);    

router.post("/upload-prescription/:id", upload.single("prescription"), uploadPrescription);

export default router;