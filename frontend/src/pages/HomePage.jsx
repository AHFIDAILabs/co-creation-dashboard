import React, { useMemo, useState } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length === 0) return { headers: [], rows: [] };
  const [headers, ...rows] = values;
  return { headers, rows };
}

// Robust header lookup
function findColumn(headers, name) {
  return headers.findIndex(
    h => h && h.trim().toLowerCase() === name.trim().toLowerCase()
  );
}

export default function HomePage() {
  const { keyPersonnel, kano, bauchi, jigawa, loading, error } = useSheets();
  const [activeFilter, setActiveFilter] = useState("All");

  const {
    mergedItems,
    totalIssues,
    totalRecommendations,
    totalPersonnel,
  } = useMemo(() => {
    const items = [];

    /* ================= KEY PERSONNEL ================= */
    const d = mapSheet(keyPersonnel);
    const hd = d.headers;

    d.rows.forEach((r, i) => {
      items.push({
        id: `keyPersonnel-${i}`,
        tab: "Key Personnel",
        category: r[findColumn(hd, "Category")] || "",
        issue: r[findColumn(hd, "Activities")] || "",
        frequency: r[findColumn(hd, "Frequency")] || "",
        status: r[findColumn(hd, "Status")] || "",
        recommendation: "",
        owner: ""
      });
    });

    /* ================= KANO ================= */
    const k = mapSheet(kano);
    const hk = k.headers;

    k.rows.forEach((r, i) => {
      items.push({
        id: `kano-${i}`,
        tab: "Kano",
        category: r[findColumn(hk, "Thematic Area")] || "",
        issue: r[findColumn(hk, "Key Gaps/Issue Identified")] || "",
        recommendation: r[findColumn(hk, "High-Impact Recommendations")] || "",
        owner: r[findColumn(hk, "Responsible Persons")] || "",
        frequency: "",
        status: ""
      });
    });

    /* ================= BAUCHI ================= */
    const b = mapSheet(bauchi);
    const hb = b.headers;

    b.rows.forEach((r, i) => {
      items.push({
        id: `bauchi-${i}`,
        tab: "Bauchi",
        category: r[findColumn(hb, "Thematic Area")] || "",
        issue: r[findColumn(hb, "Key Gaps/Issue Identified")] || "",
        recommendation: r[findColumn(hb, "High-Impact Recommendations")] || "",
        owner: r[findColumn(hb, "Responsible Persons")] || "",
        frequency: "",
        status: ""
      });
    });

    /* ================= JIGAWA CC ================= */
    const j = mapSheet(jigawa);
    const hj = j.headers;

    j.rows.forEach((r, i) => {
      items.push({
        id: `jigawa-${i}`,
        tab: "Jigawa CC",
        category: r[findColumn(hj, "Issues Identified")] || "",
        issue: r[findColumn(hj, "Action Point")] || "",
        recommendation: r[findColumn(hj, "ACTIVITIES")] || "",
        owner: r[findColumn(hj, "PERSON RESPONSIBLE")] || "",
        frequency: "",
        status: ""
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

      {/* ================= KPI BOXES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Total Issues</div>
          <div className="text-4xl font-bold">{totalIssues}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Recommendations</div>
          <div className="text-4xl font-bold">{totalRecommendations}</div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Personnel</div>
          <div className="text-4xl font-bold">{totalPersonnel}</div>
        </div>

        <div className="bg-orange-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Active Filter</div>
          <select
            value={activeFilter}
            onChange={e => setActiveFilter(e.target.value)}
            className="mt-2 w-full bg-white text-black rounded px-2 py-1"
          >
            <option>All</option>
            <option>Key Personnel</option>
            <option>Kano</option>
            <option>Bauchi</option>
            <option>Jigawa CC</option>
          </select>
        </div>

      </div>

      {/* TITLE */}
      <h2 className="text-xl font-bold text-white">Action items</h2>

      {/* ================= ACTION ITEM CARDS ================= */}
      <div className="space-y-6">

        {filteredItems.map(i => (
          <div
            key={i.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl space-y-4"
          >

            {/* Top row */}
            <div className="flex justify-between text-sm text-slate-300">
              <span>{i.tab}</span>
              <span>{i.category}</span>
            </div>

            {/* Issue + Frequency + Status */}
            <div className="flex flex-wrap justify-between text-white text-sm">
              <span><strong>Issue:</strong> {i.issue}</span>

              <div className="flex gap-6 text-slate-300">
                {i.frequency && (
                  <span><strong>Frequency:</strong> {i.frequency}</span>
                )}
                {i.status && (
                  <span><strong>Status:</strong> {i.status}</span>
                )}
              </div>
            </div>

            {/* Recommendation */}
            {i.recommendation && (
              <div className="text-emerald-400 text-sm">
                <strong>Recommendation:</strong> {i.recommendation}
              </div>
            )}

            {/* Owner */}
            {i.owner && (
              <div className="text-slate-400 text-xs">
                <strong>Owner:</strong> {i.owner}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}