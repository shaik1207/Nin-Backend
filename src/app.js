const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// ==========================================
// 1. GLOBAL CORS CONFIGURATION
// This automatically handles all OPTIONS preflight requests
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://icmr-canteen.vercel.app',
  'https://nin-canteen-nu.vercel.app',
  'https://nin-canteen-git-main-shaik-sameers-projects-488de3c3.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Blocked"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// ==========================================
// 2. HELMET SECURITY
// Fixes Google Auth popups and external image loading
// ==========================================
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ==========================================
// 3. ROUTES
// ==========================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy and running." });
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API Root is running." });
});

app.use("/api", apiRoutes);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;