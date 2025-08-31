import express from "express";

import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adviceRoutes from "./routes/adviceRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import simplebotRoutes from './routes/simplebotRoutes.js'; 
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/simplebot', simplebotRoutes);
// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// API Routes
app.get("/", (req, res) => res.send("FinVoice API is running!"));
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/advice", adviceRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
