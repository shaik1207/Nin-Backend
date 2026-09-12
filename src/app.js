const express = require("express");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// ✅ CRITICAL FOR RAILWAY: Trust the reverse proxy to read headers correctly
app.set("trust proxy", 1);

// ==========================================
// 1. ABSOLUTE TOP: DYNAMIC CORS & PREFLIGHT
// Must execute before any parsers or security packages
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "https://icmr-canteen.vercel.app",
  "https://nin-admin.vercel.app",
  "https://nin-counter.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Dynamically reflect the origin if it matches, otherwise fallback to Vercel
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://icmr-canteen.vercel.app");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // ✅ INSTANT PREFLIGHT APPROVAL: Returns 200 instead of 204 to bypass browser blocks
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// ==========================================
// 2. RELAXED SECURITY MIDDLEWARE
// Fixes Google Auth "Cross-Origin-Opener-Policy" popup blocks
// ==========================================
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ==========================================
// 3. PARSERS & STATIC FILES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ==========================================
// 4. ROUTES
// ==========================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server healthy." });
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API Root is running." });
});

app.use("/api", apiRoutes);

// Global 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route Not Found: ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;