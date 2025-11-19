// api/server.js ← FINAL VERSION – WORKS 100% WITH YOUR URI + CORS FIXED

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

// ONLY CHANGE: allow your Vercel frontend (and everything else)
app.use(cors());   // ← THIS LINE REPLACED — allows all origins (perfect for project)

app.use(morgan("dev"));
app.use(express.json());

// Simple & bulletproof connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,     // this stops buffering timeout
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    setTimeout(connectDB, 3000); // retry every 3s
  }
};

// Connect on startup
connectDB();

// Routes
app.get("/", (req, res) => res.json({ message: "Diner28 API is running!" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Wait for DB
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database connecting..." });
  }
  next();
});

// Your routes
app.use("/api/auth", require("../routes/auth.routes"));
app.use("/api/reservations", require("../routes/reservation.routes"));
app.use("/api/contacts", require("../routes/contact.routes"));
app.use("/api/feedback", require("../routes/feedback.routes"));
app.use("/api/restaurants", require("../routes/restaurant.routes"));
app.use("/api/tables", require("../routes/table.routes"));

// Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;