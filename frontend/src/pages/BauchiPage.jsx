import React, { useMemo } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length < 3) return { headers: [], rows: [] };

  const [, headers, ...rows] = values;
  return { headers, rows };
}

export default function BauchiPage() {
  const { bauchi, loading, error } = useSheets();

  const {
    headers,
    rows,
    totalActivities,
    totalThemes,
    totalRecommendations,
    totalPersonnel
  } = useMemo(() => {
    const s = mapSheet(bauchi);
    const headers = s.headers;
    const rows = s.rows;

    const themeIndex = headers.indexOf("Thematic Area");
    const recIndex = headers.indexOf("High-Impact Recommendations");
    const ownerIndex = headers.indexOf("Responsible Persons");

    const themes = new Set();
    const personnel = new Set();
    let recommendations = 0;

    rows.forEach(r => {
      const theme = r[themeIndex];
      const rec = r[recIndex];
      const owner = r[ownerIndex];

      if (theme && theme.trim()) themes.add(theme.trim());
      if (owner && owner.trim()) personnel.add(owner.trim());
      if (rec && rec.trim()) recommendations++;
    });

    return {
      headers,
      rows,
      totalActivities: rows.length,
      totalThemes: themes.size,
      totalRecommendations: recommendations,
      totalPersonnel: personnel.size
    };
  }, [bauchi]);

  if (loading) return <div className="text-white">Loading Bauchi...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-8">

      <h2 className="text-xl font-bold text-white">
        Detailed Remediation and Implementation Plan for EQAS Team ACE2 Gaps Finding
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <div className="bg-blue-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Total Activities</div>
          <div className="text-4xl font-bold">{totalActivities}</div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Thematic Area</div>
          <div className="text-4xl font-bold">{totalThemes}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">High-Impact Recommendations</div>
          <div className="text-4xl font-bold">{totalRecommendations}</div>
        </div>

        <div className="bg-orange-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Responsible Persons</div>
          <div className="text-4xl font-bold">{totalPersonnel}</div>
        </div>

        <div className="bg-slate-700 rounded-xl p-5 text-white shadow flex flex-col items-center justify-center gap-2">
          <div className="text-sm opacity-80">Active Filter</div>
          <div className="text-lg font-semibold">Bauchi</div>
        </div>

      </div>

      <div className="bg-slate-800 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-700 text-white">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/60">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-slate-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}