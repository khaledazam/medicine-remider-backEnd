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

// Get __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Serve static files (للصور المحملة)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes بدون protection (public)
app.use("/api/auth", authRoutes);

// Routes محمية (protected)
app.use("/api/medicines", protect, medicineRoutes);
app.use("/api/reminders", protect, reminderRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Root Route
app.get("/", (req, res) => {
  res.send("💊 Medicine Reminder API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  
  res.status(500).json({ 
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} and accessible from network (0.0.0.0)`);
});