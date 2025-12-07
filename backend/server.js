import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running" });
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/test', testRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
