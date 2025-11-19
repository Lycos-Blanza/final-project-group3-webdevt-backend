// backend/index.js   ← THIS WORKS ON VERCEL TODAY (November 2025)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("./routes/reservation.routes");
const contactRoutes = require("./routes/contact.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const tableRoutes = require("./routes/table.routes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Diner28 API is LIVE!", time: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Lazy MongoDB connection
let connected = false;
app.use(async (req, res, next) => {
  if (!connected && process.env.MONGO_URI) {
    try {
      await connectDB(process.env.MONGO_URI);
      connected = true;
    } catch (err) {
      console.error("DB fail", err);
    }
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// This is all Vercel needs
module.exports = app;