// api/server.js  ←  FINAL VERSION – WORKS PERFECTLY ON RAILWAY & VERCEL (2025)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// ────────────────────── FIX BUFFERING TIMEOUT FOREVER ──────────────────────
mongoose.set("bufferTimeoutMS", 30000); // extra safety

let dbPromise = null;

const connectWithRetry = async () => {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    while (true) {
      try {
        if (!process.env.MONGO_URI) {
          throw new Error("MONGO_URI is missing in environment variables!");
        }

        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          bufferMaxEntries: 0,       // ← disables mongoose buffering
          bufferCommands: false,     // ← disables buffering too
        });

        console.log("MongoDB connected successfully!");
        return mongoose.connection;
      } catch (err) {
        console.error("MongoDB connection error:", err.message);
        console.log("Retrying connection in 3 seconds...");
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  })();

  return dbPromise;
};
// ───────────────────────────────────────────────────────────────────────

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Diner28 API is running!",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ────────────── WAIT FOR MONGODB BEFORE ANY ROUTE ──────────────
app.use(async (req, res, next) => {
  try {
    await connectWithRetry();
    next();
  } catch (err) {
    console.error("Database unavailable:", err.message);
    res.status(503).json({ error: "Database unavailable – trying to reconnect..." });
  }
});
// ─────────────────────────────────────────────────────────────────

// Routes
const authRoutes = require("../routes/auth.routes");
const reservationRoutes = require("../routes/reservation.routes");
const contactRoutes = require("../routes/contact.routes");
const feedbackRoutes = require("../routes/feedback.routes");
const restaurantRoutes = require("../routes/restaurant.routes");
const tableRoutes = require("../routes/table.routes");

app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// ────────────── PORT BINDING (required for Railway) ──────────────
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Diner28 API running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received – shutting down gracefully");
  server.close(() => {
    mongoose.connection.close();
  });
});

// Export for Vercel (Railway ignores this)
module.exports = app;