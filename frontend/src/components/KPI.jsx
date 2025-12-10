import React from "react";

export default function KPI({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-3 shadow-lg border border-white/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 uppercase tracking-wide">
                {item.label}
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {item.value}
              </div>
              {item.subtitle && (
                <div className="mt-1 text-xs text-slate-400">
                  {item.subtitle}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
              {item.icon || <span className="text-lg">📊</span>}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-20 h-20 bg-white/5 rounded-tl-full" />
        </div>
      ))}
    </div>
  );
}