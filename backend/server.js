import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes);

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "EMS Backend Running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${PORT} is already in use. Stop the process using that port or set a different PORT environment variable.`
    );
    console.error('You can find and kill the process on Windows with:');
    console.error("  netstat -a -n -o | findstr :5000");
    console.error("  taskkill /PID <pid> /F");
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
