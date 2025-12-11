import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchSheet } from "../api";

const SheetsContext = createContext();

export const useSheets = () => useContext(SheetsContext);

export const SheetsProvider = ({ children }) => {
  const [keyPersonnel, setKeyPersonnel] = useState(null);
  const [kano, setKano] = useState(null);
  const [bauchi, setBauchi] = useState(null);
  const [jigawa, setJigawa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSheets = async () => {
    try {
      setLoading(true);
      setError(null);

      const keyPersonnel = await fetchSheet("Key Personnel");
      const kanoSheet = await fetchSheet("Kano");
      const bauchiSheet = await fetchSheet("Bauchi");
      const jigawaSheet = await fetchSheet("Jigawa CC");

      setKeyPersonnel(keyPersonnel.values || []);
      setKano(kanoSheet.values || []);
      setBauchi(bauchiSheet.values || []);
      setJigawa(jigawaSheet.values || []);

      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load sheets");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheets();
  }, []);

  return (
    <SheetsContext.Provider
      value={{
        keyPersonnel,
        kano,
        bauchi,
        jigawa,
        loading,
        error,
        reload: loadSheets,
      }}
    >
      {children}
    </SheetsContext.Provider>
  );
};