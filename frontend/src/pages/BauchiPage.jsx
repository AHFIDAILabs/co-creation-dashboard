import React, { useEffect, useState } from "react";
import { fetchSheet } from "../api";

const BauchiPage = () => {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSheet("Bauchi");

      if (!data?.values || data.values.length === 0) return;

      let allRows = data.values;

      // Remove long title sentence row
      if (allRows[0][0] && allRows[0][0].length > 40) {
        allRows = allRows.slice(1);
      }

      const hdr = allRows[0];
      const body = allRows.slice(1);

      setHeaders(hdr);
      setRows(body);
    };

    load();
  }, []);

  // Fuzzy index finder
  function findColumn(headers, keyword) {
    return headers.findIndex(h =>
      h && h.toString().trim().toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const thematicIdx = findColumn(headers, "thematic");
  const recoIdx = findColumn(headers, "recommend");
  const respIdx = findColumn(headers, "respons");

  const totalActivities = rows.length;
  const thematicCount = new Set(rows.map(r => r[thematicIdx])).size;
  const recoCount = new Set(rows.map(r => r[recoIdx])).size;
  const respCount = new Set(rows.map(r => r[respIdx])).size;

  return (
    <div className="p-10 space-y-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800">
        Detailed Remediation and Implementation Plan for EQAS Team ACE2 Gaps Finding
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-blue-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Total Activities</div>
          <div className="text-4xl font-bold">{totalActivities}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Thematic Area</div>
          <div className="text-4xl font-bold">{thematicCount}</div>
        </div>

        <div className="bg-indigo-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">High-Impact Recommendations</div>
          <div className="text-4xl font-bold">{recoCount}</div>
        </div>

        <div className="bg-orange-600 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Responsible Persons</div>
          <div className="text-4xl font-bold">{respCount}</div>
        </div>

        <div className="bg-slate-700 rounded-xl p-5 text-white shadow text-center">
          <div className="text-sm">Active Filter</div>
          <div className="text-4xl font-bold">Bauchi</div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow border rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 font-bold">
              {headers.map((h, idx) => (
                <th key={idx} className="border p-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                {r.map((cell, j) => (
                  <td key={j} className="border p-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BauchiPage;