// app/admin/layout.tsx
import { Metadata } from "next";
import "../globals.css";
import AdminSidebar from "./_components/AdminSidebar";
import AdminTopbar from "./_components/AdminTopbar";
import { Outfit } from "next/font/google";
import AdminGuard from "./_components/AdminGuard";



const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Tattoo Admin",
  description: "Portfólio de tatuagem — Next.js + Tailwind v4",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[260px_1fr] bg-[var(--background)] text-[var(--text)]">
      <aside className="hidden md:block">
        <AdminSidebar />
      </aside>
      <main className="relative">
        <AdminTopbar />
        <div className="mx-auto max-w-6xl px-4 py-6">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </main>
    </div>
  );
}