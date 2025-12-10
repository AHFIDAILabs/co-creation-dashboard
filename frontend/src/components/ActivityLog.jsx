import React from "react";

export default function ActivityLog({ logs }) {
  const items = logs || [];

  return (
    <div className="rounded-xl bg-slate-900 px-4 py-3 border border-white/5 shadow-lg">
      <div className="text-sm font-semibold text-white mb-2">
        Activity log
      </div>
      <div className="space-y-2 max-h-60 overflow-auto text-xs text-slate-300">
        {items.length === 0 && (
          <div className="text-slate-500">No recent activity</div>
        )}
        {items.map((log, idx) => (
          <div key={idx} className="bg-white/5 rounded-md px-2 py-1.5">
            <div className="text-[10px] text-slate-400">
              {log.timestamp}
            </div>
            <div>{log.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}