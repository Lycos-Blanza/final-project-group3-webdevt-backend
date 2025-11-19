// api/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Correct path — db.js is now in ../config/db.js
const connectDB = require("../config/db");

// Routes
const authRoutes = require("../routes/auth.routes");
const reservationRoutes = require("../routes/reservation.routes");
const contactRoutes = require("../routes/contact.routes");
const feedbackRoutes = require("../routes/feedback.routes");
const restaurantRoutes = require("../routes/restaurant.routes");
const tableRoutes = require("../routes/table.routes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({ message: "Diner28 API is running!", uptime: process.uptime() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Lazy MongoDB connection
let connectionPromise = null;
const ensureDBConnected = async () => {
  if (connectionPromise) return connectionPromise;
  connectionPromise = (async () => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected");
  })();
  return connectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await ensureDBConnected();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// Export for Vercel & Railway
module.exports = app;