import React, { useMemo } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length === 0) return { headers: [], rows: [] };
  const [headers, ...rows] = values;
  return { headers, rows };
}

export default function BauchiPage() {
  const { bauchi, loading, error } = useSheets();
  const { headers, rows } = mapSheet(bauchi);

  const {
    totalActivities,
    thematicAreaCount,
    recommendationCount,
    responsibleCount,
  } = useMemo(() => {
    if (!rows || rows.length === 0) {
      return {
        totalActivities: 0,
        thematicAreaCount: 0,
        recommendationCount: 0,
        responsibleCount: 0,
      };
    }

    const dataRows = rows.slice(1);
    const unique = (arr) => [...new Set(arr.filter(Boolean))];

    const thematicAreas = unique(dataRows.map((r) => r[0]?.trim()));
    const recommendations = unique(dataRows.map((r) => r[2]?.trim()));
    const responsiblePersons = unique(dataRows.map((r) => r[8]?.trim()));

    return {
      totalActivities: dataRows.length,
      thematicAreaCount: thematicAreas.length,
      recommendationCount: recommendations.length,
      responsibleCount: responsiblePersons.length,
    };
  }, [rows]);

  if (loading) return <div>Loading Bauchi...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-white">
        Detailed Remediation and Implementation Plan for EQAS Team ACE2 Gaps Finding
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-600 p-4 rounded text-white">Total Activities {totalActivities}</div>
        <div className="bg-purple-600 p-4 rounded text-white">Thematic Area {thematicAreaCount}</div>
        <div className="bg-green-600 p-4 rounded text-white">High Impact Recommendations {recommendationCount}</div>
        <div className="bg-orange-600 p-4 rounded text-white">Responsible Persons {responsibleCount}</div>
        <div className="bg-slate-700 p-4 rounded text-white text-center">Active Filter</div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-700 text-white">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`border-b border-slate-700 ${
                  rIdx === 0 ? "font-bold text-white bg-slate-700" : "text-slate-300"
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}