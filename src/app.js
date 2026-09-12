const express = require("express");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.set("trust proxy", 1);

// ==========================================
// 1. ABSOLUTE TOP: RAW CORS & PREFLIGHT
// Must execute before any parsers or routes
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://icmr-canteen.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://icmr-canteen.vercel.app");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Instantly return 200 OK for preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// ==========================================
// 2. SECURITY MIDDLEWARE
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
// 3. PARSERS & ROUTES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server healthy." });
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route Not Found: ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;