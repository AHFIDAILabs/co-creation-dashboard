import axios from "axios";

// Use Render backend in production, local in development
const BASE_URL = import.meta.env.PROD
  ? "https://cocreation-backend.onrender.com"
  : "";

export const fetchSheet = async (sheetName) => {
  const res = await axios.get(
    `${BASE_URL}/api/sheet/${encodeURIComponent(sheetName)}`
  );
  return res.data;
};

export const updateCell = async ({ sheetName, range, values }) => {
  const res = await axios.post(
    `${BASE_URL}/api/sheet/update`,
    { sheetName, range, values }
  );
  return res.data;
};