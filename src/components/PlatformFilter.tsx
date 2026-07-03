import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Segmented Control for Platforms */}
      <div className="flex w-full sm:w-auto items-center rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80 shadow-inner">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex-1 sm:flex-none relative rounded-lg px-8 py-3.5 text-base font-medium transition-all duration-300 ease-out ${
              selected === p
                ? "text-slate-900 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            {selected === p && (
              <span className="absolute inset-0 rounded-lg bg-white dark:bg-slate-700" style={{ zIndex: -1 }} />
            )}
            <span className="relative z-10">{getPlatformLabel(p)}</span>
          </button>
        ))}
      </div>

      {/* Premium Search Input */}
      <div className="relative w-full sm:w-96">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators..."
          className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-6 text-base text-slate-900 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-800 placeholder-slate-400 shadow-sm"
        />
      </div>
    </div>
  );
}
