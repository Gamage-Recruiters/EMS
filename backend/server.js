import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from "./routes/authRoutes.js";

import errorHandler from "./middlewares/errorMiddleware.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import AttendanceRoutes from "./routes/AttendanceRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running" });
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/availability", availabilityRoutes);
// app.use('/test', testRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
