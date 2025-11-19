// backend/server.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("./routes/reservation.routes");
const contactRoutes = require("./routes/contact.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const tableRoutes = require("./routes/table.routes");

const app = express();

// === MIDDLEWARE ===
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// === ROOT & HEALTH ===
app.get("/", (req, res) => {
  res.json({ message: "Diner28 API is LIVE!", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// === LAZY MONGO CONNECTION (ONLY WHEN NEEDED) ===
let isConnected = false;
const connectWithRetry = async () => {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI missing!");
    return;
  }
  try {
    await connectDB(uri);
    isConnected = true;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

// Run connection on EVERY request (safe for serverless)
app.use(async (req, res, next) => {
  await connectWithRetry();
  next();
});

// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// === LOCAL DEV ONLY ===
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`);
  });
}

// === EXPORT FOR VERCEL ===
module.exports = app;