import "dotenv/config"; // already loads .env
import express from "express";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Helpers to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import AttendanceRoutes from "./routes/AttendanceRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import initializeSocket from "./socketServer.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dailyTaskRoutes from "./routes/dailyTaskRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// Middlewares
import errorHandler from "./middlewares/errorMiddleware.js";

// Connect Database
connectDB();

const app = express();

const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Middlewares

// CORS - allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running with Socket.IO" });
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/daily-tasks", dailyTaskRoutes);
app.use("/api/complaints", complaintRoutes);
// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running" });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
});
