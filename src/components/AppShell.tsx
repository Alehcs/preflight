"use client";

import Link from "next/link";
import { Plane } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="livery-stripe" aria-hidden />
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
            <Plane className="w-5 h-5 text-indigo-600" strokeWidth={2} />
            <span className="font-semibold text-lg tracking-tight">Preflight</span>
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
