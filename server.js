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

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://final-project-group3-webdevt-git-4f9c07-lycos-projects-df81940b.vercel.app",
    ], // Add your frontend URLs
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// In backend/server.js — add this right after app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Diner28 API is live! 🚀",
    status: "ok",
    version: "1.0.0",
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/diner28";
connectDB(MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// === GRACEFUL START & SHUTDOWN ===
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

// Graceful shutdown (Ctrl+C, nodemon restart, deployment, etc.)
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

function shutDown() {
  console.log("\nReceived shutdown signal. Closing server gracefully...");
  server.close(() => {
    console.log("Server closed. All connections terminated.");
    process.exit(0);
  });

  // Force close after 10 seconds if clients won't disconnect
  setTimeout(() => {
    console.error("Forcing shutdown — some connections still open!");
    process.exit(1);
  }, 10000);
}

// Optional: Auto-retry if port is in use (super robust)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${port} is busy — trying port ${port + 1}...`);
    app.listen(port + 1);
  } else {
    console.error("Server error:", err);
  }
});
