import React, { useMemo } from "react";
import { useSheets } from "../context/SheetsContext";

function mapKano(values) {
  if (!values || values.length < 2) return { headers: [], rows: [] };

  // Row 0 = long sentence (skip)
  // Row 1 = headers
  // Row 2..n = data
  const headers = values[1];
  const rows = values.slice(2);

  return { headers, rows };
}

export default function KanoPage() {
  const { kano, loading, error } = useSheets();

  const { headers, rows, totalActivities, thematicCount, recoCount, respCount } =
    useMemo(() => {
      const d = mapKano(kano);
      const headers = d.headers;
      const rows = d.rows;

      const thematicIdx = headers.indexOf("Thematic Area");
      const recoIdx = headers.indexOf("High-Impact Recommendations");
      const respIdx = headers.indexOf("Responsible Persons");

      const thematic = new Set();
      const recos = new Set();
      const resps = new Set();

      rows.forEach((r) => {
        if (r[thematicIdx]) thematic.add(r[thematicIdx]);
        if (r[recoIdx]) recos.add(r[recoIdx]);
        if (r[respIdx]) resps.add(r[respIdx]);
      });

      return {
        headers,
        rows,
        totalActivities: rows.length,
        thematicCount: thematic.size,
        recoCount: recos.size,
        respCount: resps.size,
      };
    }, [kano]);

  if (loading) return <div className="text-white">Loading Kano...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-10">

      {/* ================= TITLE ================= */}
      <h1 className="text-2xl font-bold text-white">
        Remediation and Implementation Plan for Kano State Team Co-Creation Findings
      </h1>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <div className="bg-blue-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Total Activities</div>
          <div className="text-4xl font-bold">{totalActivities}</div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Thematic Area</div>
          <div className="text-4xl font-bold">{thematicCount}</div>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">High-Impact Recommendations</div>
          <div className="text-4xl font-bold">{recoCount}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Responsible Persons</div>
          <div className="text-4xl font-bold">{respCount}</div>
        </div>

        <div className="bg-slate-700 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Active Filter</div>
          <div className="text-4xl font-bold">Kano</div>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-slate-900 rounded-xl shadow-xl overflow-x-auto">

        <table className="min-w-full text-sm text-left">

          <thead className="bg-slate-700 text-white font-bold">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-slate-800 hover:bg-slate-800/40">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 text-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}