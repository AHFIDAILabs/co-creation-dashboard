import React, { useMemo, useState } from "react";
import { useSheets } from "../context/SheetsContext";

function mapSheet(values) {
  if (!values || values.length === 0) return { headers: [], rows: [] };
  const [headers, ...rows] = values;
  return { headers, rows };
}

export default function DashboardPage() {
  const { dashboard, loading, error } = useSheets();
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    rows,
    headers,
    totalIssues,
    notDoneCount,
    ongoingCount,
    completedCount,
    filteredRows,
  } = useMemo(() => {
    const d = mapSheet(dashboard);
    const headers = d.headers;
    const rows = d.rows;

    const statusIndex = headers.indexOf("Status");

    let notDone = 0;
    let ongoing = 0;
    let completed = 0;

    rows.forEach((r) => {
      const status = (r[statusIndex] || "").trim().toLowerCase();
      if (status === "not done") notDone++;
      if (status === "ongoing") ongoing++;
      if (status === "completed") completed++;
    });

    const filtered =
      statusFilter === "All"
        ? rows
        : rows.filter((r) => {
            const status = (r[statusIndex] || "").trim().toLowerCase();
            return status === statusFilter.toLowerCase();
          });

    return {
      rows,
      headers,
      totalIssues: rows.length,
      notDoneCount: notDone,
      ongoingCount: ongoing,
      completedCount: completed,
      filteredRows: filtered,
    };
  }, [dashboard, statusFilter]);

  if (loading) return <div className="text-white">Loading Dashboard...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-10">

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-blue-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Total Issues</div>
          <div className="text-4xl font-bold">{totalIssues}</div>
        </div>

        <div className="bg-red-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Not Done</div>
          <div className="text-4xl font-bold">{notDoneCount}</div>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Ongoing</div>
          <div className="text-4xl font-bold">{ongoingCount}</div>
        </div>

        <div className="bg-green-600 rounded-xl p-5 shadow-lg text-white">
          <div className="text-sm opacity-80">Completed</div>
          <div className="text-4xl font-bold">{completedCount}</div>
        </div>

      </div>

      {/* ================= TABLE SECTION TITLE ================= */}
      <h2 className="text-lg font-bold text-white">Dashboard Activities</h2>

      {/* ================= STATUS OVERVIEW (BAR STYLE) ================= */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-3">
        <h3 className="text-white font-semibold mb-2">Status Overview</h3>

        <div>
          <div className="text-sm text-slate-300">Not Done</div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-red-600 h-4 rounded-full"
              style={{
                width:
                  totalIssues === 0
                    ? "0%"
                    : `${(notDoneCount / totalIssues) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-300">Ongoing</div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-yellow-500 h-4 rounded-full"
              style={{
                width:
                  totalIssues === 0
                    ? "0%"
                    : `${(ongoingCount / totalIssues) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-300">Completed</div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{
                width:
                  totalIssues === 0
                    ? "0%"
                    : `${(completedCount / totalIssues) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* ================= STATUS FILTER ================= */}
      <div className="flex items-center justify-end gap-3">
        <label className="text-sm text-slate-300 font-medium">
          Filter by Status
        </label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white text-black px-3 py-2 rounded"
        >
          <option>All</option>
          <option>Not Done</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-700 text-white">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="border-b border-slate-700 hover:bg-slate-700/50"
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 text-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center text-slate-400 py-6"
                >
                  No activities found for this status
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}