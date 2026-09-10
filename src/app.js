const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// ==========================================
// 1. CORS MUST BE FIRST
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://icmr-canteen.vercel.app',
  'https://nin-canteen-nu.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like server-to-server) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Blocked"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  })
);

// ✅ BULLETPROOF PREFLIGHT HANDLER
// Intercepts all OPTIONS requests instantly and returns 200 OK
// This completely bypasses the Express v5 path-to-regexp crashes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// 2. HELMET (Relaxed for Google Auth)
// ==========================================
app.use(
  helmet({
    // Completely disables the blockers killing the Google popup
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
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