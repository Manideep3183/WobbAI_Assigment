import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_40%),linear-gradient(135deg,_#f8f7ff_0%,_#fdfdfd_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Influencer Search
        </Link>
        <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
          {title ?? "Discover creators"}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
