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
app.use(
  cors({
    origin: true, // Allow all origins in production (Vercel frontend will work)
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// === ROOT & HEALTH CHECK ===
app.get("/", (req, res) => {
  res.json({
    message: "Diner28 API is live!",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// === DATABASE CONNECTION ===
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables!");
  process.exit(1);
}
connectDB(MONGO_URI);

// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// === ONLY START SERVER IN LOCAL DEV (NOT ON VERCEL) ===
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

// === EXPORT FOR VERCEL SERVERLESS ===
module.exports = app; // This is the magic line Vercel needs