import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          Influencer Search
        </Link>
        {title && <h1 className="text-2xl mt-2">{title}</h1>}
      </header>
      <main>{children}</main>
    </div>
  );
}
