import React from "react";

export default function Filters({
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quick filter"
          className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring focus:ring-indigo-500/40"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-300">Status</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:ring focus:ring-indigo-500/40"
        >
          <option value="All">All</option>
          <option value="Not Done">Not Done</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}