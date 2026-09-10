const express = require("express");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.set("trust proxy", 1);

// ==========================================
// 1. ABSOLUTE BRUTE-FORCE CORS
// No packages. Hardcoded headers. Must be at the very top.
// ==========================================
app.use((req, res, next) => {
  // Hardcode your production Vercel URL here
  res.header("Access-Control-Allow-Origin", "https://icmr-canteen.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Instantly return 200 OK for Preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ==========================================
// 2. PARSERS & ROUTES
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