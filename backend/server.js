const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = "1gsaJQA4Xf3ofr2xFxP5xFnYgNQhed_mEqtzM9MzFOiE";
const API_KEY = "AIzaSyAi3dqr2jwtGymEC8P4Mfl8kuLH-1GTeys";

/* ================= API ROUTES ================= */

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is active and operational" });
});

app.get("/api/sheet/:sheetName", async (req, res) => {
  try {
    const rawName = req.params.sheetName;
    const encodedName = encodeURIComponent(rawName);

    const range = `${encodedName}!A1:Z500`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= SERVE FRONTEND ================= */

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Unified app running on port ${PORT}`);
});