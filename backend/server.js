const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = "1gsaJQA4Xf3ofr2xFxP5xFnYgNQhed_mEqtzM9MzFOiE";
const API_KEY = "AIzaSyAi3dqr2jwtGymEC8P4Mfl8kuLH-1GTeys";

// ================= HEALTH CHECK =================
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is active and operational" });
});

// ================= DYNAMIC SHEET LOADER =================
app.get("/api/sheet/:sheetName", async (req, res) => {
  try {
    const rawName = req.params.sheetName;
    const encodedName = encodeURIComponent(rawName);

    const range = `${encodedName}!A1:Z500`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    console.log("Fetching sheet:", rawName);
    console.log("Google Sheets API URL:", url);

    const response = await axios.get(url);
    const data = response.data;

    if (data.error) {
      console.log("Google API error:", data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    console.log("Sheet loaded successfully:", rawName);
    res.json(data);

  } catch (err) {
    console.log("Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= PORT FOR LOCAL + RENDER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});