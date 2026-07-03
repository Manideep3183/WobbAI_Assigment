import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:text-lg selection:bg-violet-200 selection:text-violet-900 dark:bg-slate-950 dark:text-slate-50 dark:selection:bg-violet-900/50 dark:selection:text-violet-200">
      {/* Premium ambient background effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[100px] dark:bg-violet-600/10 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-sky-400/10 blur-[120px] dark:bg-sky-500/10 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-12 flex flex-col min-h-screen">
        <header className="mx-auto mb-10 flex w-full max-w-[1440px] items-center justify-between rounded-2xl glass px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Vibe<span className="text-violet-600 dark:text-violet-400">Search</span>
            </span>
          </Link>
          <div className="hidden sm:flex rounded-full bg-slate-100/80 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 backdrop-blur-md">
            {title ?? "Discover creators"}
          </div>
        </header>
        
        <main className="flex-1 w-full max-w-[1440px] mx-auto">{children}</main>
        
        <footer className="mt-20 text-center text-sm md:text-base text-slate-400 py-8">
          <p>© {new Date().getFullYear()} VibeSearch. Premium Influencer Discovery.</p>
        </footer>
      </div>
    </div>
  );
}
