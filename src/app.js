const express = require("express");
const helmet = require("helmet");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// ==========================================
// 1. RAW, BULLETPROOF CORS MIDDLEWARE
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://icmr-canteen.vercel.app',
  'https://nin-canteen-nu.vercel.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // INSTANT PREFLIGHT APPROVAL (Fixes the Ghost 404s)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// ==========================================
// 2. RELAXED HELMET (Fixes Google Auth Popup)
// ==========================================
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

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ==========================================
// 3. MOUNT ROUTES
// ==========================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy and running." });
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API Root is running." });
});

// Mounts the master router from src/routes/index.js
app.use("/api", apiRoutes);

// Global 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;