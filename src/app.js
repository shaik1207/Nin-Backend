const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// 1. Trust Railway's reverse proxy 
app.set("trust proxy", true);

// 2. Dynamic CORS Configuration (Must be the very first app.use)
app.use(
  cors({
    origin: true, // Dynamically reflects the exact frontend origin requested
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
  })
);

// 3. Relaxed Helmet Security (Prevents backend from blocking popups)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 4. Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy." });
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API Root is running." });
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;