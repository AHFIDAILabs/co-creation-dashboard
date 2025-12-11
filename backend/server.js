const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());
app.use(express.json());

const sheetCache = new NodeCache({ stdTTL: 300 });

const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

/* API ROUTES */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is active and operational" });
});

app.get("/api/sheet/:sheetName", async (req, res) => {
  try {
    const rawName = req.params.sheetName;
    const range = `${encodeURIComponent(rawName)}!A1:Z500`;
    const cacheKey = `sheet-${rawName}`;

    const cached = sheetCache.get(cacheKey);
    if (cached) return res.json(cached);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await axios.get(url);
    sheetCache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* FRONTEND */
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* PORT */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));