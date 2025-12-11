const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------------
// CONFIG
// --------------------------------------------------
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

// 5 minute cache to reduce API billing and speed up rendering
const sheetCache = new NodeCache({ stdTTL: 300 });


// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

// Health check
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

// Dynamic sheet loader
app.get("/api/sheet/:sheetName", async (req, res) => {
  try {
    const rawName = req.params.sheetName;
    const encoded = encodeURIComponent(rawName);
    const range = `${encoded}!A1:Z500`;

    const cacheKey = `sheet-${rawName}`;
    const cached = sheetCache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    sheetCache.set(cacheKey, data);
    res.json(data);

  } catch (err) {
    console.error("Sheet load error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


// --------------------------------------------------
// SERVE FRONTEND BUILD (React)
// --------------------------------------------------

const FRONTEND_DIST = path.join(__dirname, "../frontend/dist");

// Serve static assets
app.use(express.static(FRONTEND_DIST));

// SPA fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});


// --------------------------------------------------
// START SERVER
// --------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Unified app running on port ${PORT}`);
});