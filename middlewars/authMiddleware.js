import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log(" Middleware: Checking authorization...");
    console.log(" Headers:", req.headers);
    
    const token = req.headers.authorization?.split(" ")[1]; // 
    console.log(" Token extracted:", token ? " Found" : "Missing");
    
    if (!token) {
      console.log(" No token provided");
      return res.status(401).json({ message: "No token, not authorized" });
    }

    console.log(" Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token decoded:", decoded);
    
    console.log(" Finding user with ID:", decoded.id);
    req.user = await User.findById(decoded.id).select("-password");
    console.log(" User found:", req.user ? " Yes" : " No");

    if (!req.user) {
      console.log(" User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    console.log(" Authentication successful!");
    next();
    
  } catch (error) {
    console.error(" Auth middleware error:", error.message);
    console.error(" Full error:", error);
    res.status(401).json({ message: "Not authorized", error: error.message });
  }
};