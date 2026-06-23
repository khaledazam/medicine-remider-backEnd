import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicines.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import { protect } from "./middlewars/authMiddleware.js";

dotenv.config();

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/medicines", protect, medicineRoutes);
app.use("/api/reminders", protect, reminderRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send(" Medicine Reminder API is running...");
});

app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  
  res.status(500).json({ 
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server running on port ${PORT} and accessible from network (0.0.0.0)`);
});