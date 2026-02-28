import express from "express";
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} from "../controllers/reminderController.js";
import { protect } from "../middlewars/authMiddleware.js"; // لاحظ .js

const router = express.Router();

router.get("/", protect, getReminders);
router.post("/", protect, createReminder);
router.put("/:id", protect, updateReminder);
router.delete("/:id", protect, deleteReminder);

export default router;
