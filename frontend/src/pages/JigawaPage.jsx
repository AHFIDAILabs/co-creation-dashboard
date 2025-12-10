import React, { useMemo } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length === 0) return { headers: [], rows: [] };
  const [headers, ...rows] = values;
  return { headers, rows };
}

export default function JigawaPage() {
  const { jigawa, loading, error } = useSheets();

  const { headers, rows, totalIssues, totalPersonnel } = useMemo(() => {
    const s = mapSheet(jigawa);
    const headers = s.headers;
    const rows = s.rows;

    const ownerIndex = headers.indexOf("PERSON RESPONSIBLE");
    const people = new Set(
      rows.map(r => r[ownerIndex]).filter(v => v && v.trim())
    );

    return {
      headers,
      rows,
      totalIssues: rows.length,
      totalPersonnel: people.size
    };
  }, [jigawa]);

  if (loading) return <div className="text-white">Loading Jigawa CC...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-8">

      <h2 className="text-xl font-bold text-white">Jigawa CC Action Plan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-blue-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Total Issues</div>
          <div className="text-4xl font-bold">{totalIssues}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Action Points</div>
          <div className="text-4xl font-bold">{totalIssues}</div>
        </div>

        <div className="bg-purple-600 rounded-xl p-5 text-white shadow">
          <div className="text-sm">Responsible Persons</div>
          <div className="text-4xl font-bold">{totalPersonnel}</div>
        </div>

        <div className="bg-slate-700 rounded-xl p-5 text-white shadow flex flex-col items-center justify-center gap-2">
          <div className="text-sm opacity-80">Active Filter</div>
          <div className="text-lg font-semibold">Jigawa</div>
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