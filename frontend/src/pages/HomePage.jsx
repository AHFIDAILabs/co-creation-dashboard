import React, { useMemo, useState } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length === 0) return { headers: [], rows: [] };
  const [headers, ...rows] = values;
  return { headers, rows };
}

// Flexible header matcher
function getColumn(headers, candidates) {
  const normalized = headers.map(h => h?.trim().toLowerCase());
  for (let c of candidates) {
    const idx = normalized.indexOf(c.trim().toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
}

export default function HomePage() {
  const { keyPersonnel, kano, bauchi, jigawa, loading, error } = useSheets();
  const [activeFilter, setActiveFilter] = useState("All");

  const { mergedItems, totalIssues, totalRecommendations, totalPersonnel } =
    useMemo(() => {
      const items = [];

      /* ================= KEY PERSONNEL ================= */
      const d = mapSheet(keyPersonnel);
      const hd = d.headers;

      const colCat = getColumn(hd, ["category"]);
      const colAct = getColumn(hd, ["activities", "activity"]);
      const colFreq = getColumn(hd, ["frequency"]);
      const colStat = getColumn(hd, ["status"]);

      d.rows.forEach((r, i) => {
        items.push({
          id: `kp-${i}`,
          tab: "Key Personnel",
          category: r[colCat] || "",
          activity: r[colAct] || "",
          frequency: r[colFreq] || "",
          status: r[colStat] || ""
        });
      });

      /* ================= KANO ================= */
      const k = mapSheet(kano);
      const hk = k.headers;

      const colTA = getColumn(hk, ["thematic area", "theme"]);
      const colIssue = getColumn(hk, ["key gaps/issue identified", "issue"]);
      const colRec = getColumn(hk, [
        "high-impact recommendations",
        "recommendation"
      ]);
      const colOwn = getColumn(hk, ["responsible persons", "owner"]);

      k.rows.forEach((r, i) => {
        items.push({
          id: `kano-${i}`,
          tab: "Kano",
          thematic: r[colTA] || "",
          issue: r[colIssue] || "",
          recommendation: r[colRec] || "",
          owner: r[colOwn] || ""
        });
      });

      /* ================= BAUCHI ================= */
      const b = mapSheet(bauchi);
      const hb = b.headers;

      const colTA2 = getColumn(hb, ["thematic area", "theme"]);
      const colIssue2 = getColumn(hb, ["key gaps/issue identified", "issue"]);
      const colRec2 = getColumn(hb, [
        "high-impact recommendations",
        "recommendation"
      ]);
      const colOwn2 = getColumn(hb, ["responsible persons", "owner"]);

      b.rows.forEach((r, i) => {
        items.push({
          id: `bauchi-${i}`,
          tab: "Bauchi",
          thematic: r[colTA2] || "",
          issue: r[colIssue2] || "",
          recommendation: r[colRec2] || "",
          owner: r[colOwn2] || ""
        });
      });

      /* ================= JIGAWA CC ================= */
      const j = mapSheet(jigawa);
      const hj = j.headers;

      const colJIssue = getColumn(hj, ["issues identified", "issue"]);
      const colJAP = getColumn(hj, ["action point"]);
      const colJAct = getColumn(hj, ["activities", "activity"]);
      const colJOwn = getColumn(hj, ["person responsible", "owner"]);

      j.rows.forEach((r, i) => {
        items.push({
          id: `jig-${i}`,
          tab: "Jigawa CC",
          issue: r[colJIssue] || "",
          actionPoint: r[colJAP] || "",
          activities: r[colJAct] || "",
          owner: r[colJOwn] || ""
        });
      });

      /* ================= TOTALS ================= */
      const people = new Set();
      items.forEach(i => i.owner && people.add(i.owner));

      return {
        mergedItems: items,
        totalIssues: items.length,
        totalRecommendations: items.filter(i => i.recommendation).length,
        totalPersonnel: people.size
      };
    }, [keyPersonnel, kano, bauchi, jigawa]);

  const filteredItems =
    activeFilter === "All"
      ? mergedItems
      : mergedItems.filter(x => x.tab === activeFilter);

  if (loading) return <div className="text-white">Loading Home...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-10">

      {/* KPI BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm opacity-80">Total Items</div>
          <div className="text-4xl font-bold">{totalIssues}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm opacity-80">Recommendations</div>
          <div className="text-4xl font-bold">{totalRecommendations}</div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm opacity-80">Personnel</div>
          <div className="text-4xl font-bold">{totalPersonnel}</div>
        </div>

        <div className="bg-orange-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm opacity-80">Filter</div>
          <select
            className="mt-2 w-full bg-white text-black rounded px-2 py-1"
            value={activeFilter}
            onChange={e => setActiveFilter(e.target.value)}
          >
            <option>All</option>
            <option>Key Personnel</option>
            <option>Kano</option>
            <option>Bauchi</option>
            <option>Jigawa CC</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white">Action Items</h2>

      <div className="space-y-6">
        {filteredItems.map(i => (
          <div key={i.id} className="bg-slate-800 p-6 rounded-xl shadow border border-slate-700 space-y-3">

            <div className="flex justify-between text-slate-300 text-sm">
              <span>{i.tab}</span>
              <span>{i.category || i.thematic || ""}</span>
            </div>

            {i.activity && (
              <div className="text-white">
                <strong>Activity:</strong> {i.activity}
              </div>
            )}

            {i.issue && (
              <div className="text-white">
                <strong>Issue:</strong> {i.issue}
              </div>
            )}

            {i.actionPoint && (
              <div className="text-white">
                <strong>Action Point:</strong> {i.actionPoint}
              </div>
            )}

            {i.recommendation && (
              <div className="text-emerald-400">
                <strong>Recommendation:</strong> {i.recommendation}
              </div>
            )}

            {i.activities && (
              <div className="text-slate-300">
                <strong>Activities:</strong> {i.activities}
              </div>
            )}

            {(i.frequency || i.status) && (
              <div className="flex gap-10 text-slate-400 text-sm">
                {i.frequency && (
                  <span>
                    <strong>Frequency:</strong> {i.frequency}
                  </span>
                )}
                {i.status && (
                  <span>
                    <strong>Status:</strong> {i.status}
                  </span>
                )}
              </div>
            )}

            {i.owner && (
              <div className="text-slate-500 text-xs">
                <strong>Owner:</strong> {i.owner}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}