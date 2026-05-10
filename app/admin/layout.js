import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Bell, CircleUserRound } from "lucide-react";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col gap-2 bg-[#eff1f2] p-6">
        <Link href="/admin" className="mb-6 text-xl font-extrabold italic tracking-tight text-[#006941]">
          Recipeat Admin
        </Link>

        <AdminSidebarNav />

        <div className="mt-auto space-y-2 pt-4">
          <Link
            href="/admin/recipes/new"
            style={{ color: "white" }}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-5 py-3 text-sm font-bold shadow-[0_16px_32px_-16px_rgba(0,105,65,0.45)] transition-opacity hover:opacity-90"
          >
            Create New Recipe
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#595c5d] transition-colors hover:bg-[#e0e3e4] hover:text-[#2c2f30]"
          >
            <Home size={18} />
            Back to App
          </Link>
        </div>
      </aside>

      <main className="ml-72 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#f5f6f7]/85 px-8 py-4 backdrop-blur-xl shadow-[0_20px_40px_-24px_rgba(44,47,48,0.25)]">
          <AdminSearchBar />

          <div className="ml-6 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
              <CircleUserRound className="h-5 w-5 text-[#006941]" />
              <span className="text-sm font-semibold text-[#2c2f30]">{session.user.name || session.user.email}</span>
            </div>
          </div>
        </header>

        <div className="px-8 pb-10 pt-8">{children}</div>
      </main>
    </div>
  );
}


