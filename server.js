// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./db");

const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("./routes/reservation.routes");
const contactRoutes = require("./routes/contact.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const tableRoutes = require("./routes/table.routes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({ message: "Diner28 API is running!", uptime: process.uptime() });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// === LAZY MONGO CONNECT — ONLY WHEN FIRST REQUEST COMES ===
let connectionPromise = null;

const ensureDBConnected = async () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
      await connectDB(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB failed:", err.message);
      throw err;
    }
  })();

  return connectionPromise;
};

// Run before every route
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

// Local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local: http://localhost:${PORT}`));
}

// Export for Vercel
module.exports = app;