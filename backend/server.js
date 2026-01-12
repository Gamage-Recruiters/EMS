import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import errorHandler from './middlewares/errorMiddleware.js';
import leaveRoutes from './routes/leaveRoutes.js';
import AttendanceRoutes from "./routes/AttendanceRoutes.js";
import availabilityRoutes from './routes/availabilityRoutes.js';

// Connect Database
connectDB();

const app = express();

// Middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS - allow requests from frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers with increased size limits to accomodate image uploads
app.use(express.json({ limit: process.env.BODY_LIMIT || "10mb" }));
app.use(express.urlencoded({ extended: true, limit: process.env.BODY_LIMIT || "10mb" }));

// Routes
app.use('/api/auth', authRoutes);

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running" });
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', AttendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/availability', availabilityRoutes);
// app.use('/test', testRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
