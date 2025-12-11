import React from "react";
import { SheetsProvider } from "./context/SheetsContext";

import HomePage from "./pages/HomePage";
import KeyPersonnelPage from "./pages/KeyPersonnelPage";
import KanoPage from "./pages/KanoPage";
import BauchiPage from "./pages/BauchiPage";
import JigawaPage from "./pages/JigawaPage";

function HeaderPanel({ active, setActive }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "keyPersonnel", label: "Key Personnel" },
    { id: "kano", label: "Kano" },
    { id: "bauchi", label: "Bauchi" },
    { id: "jigawa", label: "Jigawa CC" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                    rounded-none px-8 py-4 shadow-lg flex items-center justify-between">

      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
          <div className="w-6 h-6 rounded-md border-2 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
        </div>

        <div>
          <div className="text-white/80 font-medium text-sm">Co Creation</div>
          <div className="text-white font-bold text-xl">Key Personnel</div>
        </div>
      </div>

      {/* Center badge */}
      <div>
        <span className="px-4 py-2 rounded-full bg-white/20 text-xs text-white tracking-wide">
          Interactive, live from Google Sheets
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={
              "px-4 py-1 rounded-full text-xs font-medium transition " +
              (active === tab.id
                ? "bg-white text-indigo-700 shadow"
                : "bg-white/20 text-white hover:bg-white/30")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  );
}

function AppContent() {
  const [active, setActive] = React.useState("home");

  const renderPage = () => {
    if (active === "home") return <HomePage />;
    if (active === "keyPersonnel") return <KeyPersonnelPage />;
    if (active === "kano") return <KanoPage />;
    if (active === "bauchi") return <BauchiPage />;
    if (active === "jigawa") return <JigawaPage />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* SINGLE header panel */}
      <HeaderPanel active={active} setActive={setActive} />

      {/* Remove padding override — let pages manage their layout */}
      <div className="px-8 py-10">
        {renderPage()}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <SheetsProvider>
      <AppContent />
    </SheetsProvider>
  );
}