import React from "react";

export default function ActivityTable({ headers, rows }) {
  if (!headers || headers.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 px-4 py-4 border border-white/5 text-sm text-slate-300">
        No data available
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900 border border-white/5 shadow-lg overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              {headers.map((h, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-200 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ridx) => (
              <tr
                key={ridx}
                className={
                  ridx % 2 === 0
                    ? "bg-slate-900"
                    : "bg-slate-900/75"
                }
              >
                {headers.map((_, cidx) => (
                  <td
                    key={cidx}
                    className="px-3 py-2 align-top text-xs text-slate-100 whitespace-normal"
                  >
                    {row[cidx] || ""}
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