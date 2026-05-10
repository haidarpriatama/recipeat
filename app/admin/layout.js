import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, UtensilsCrossed, Home, Carrot, Search, Bell, CircleUserRound } from "lucide-react";

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

        <nav className="flex flex-1 flex-col gap-2">
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/admin/recipes" icon={UtensilsCrossed} label="Manage Recipes" />
          <NavItem href="/admin/ingredients" icon={Carrot} label="Manage Ingredients" />
          <NavItem href="/admin/users" icon={Users} label="Users" />
        </nav>

        <div className="mt-auto space-y-2 pt-4">
          <Link
            href="/admin/recipes/new"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#006941] to-[#005c38] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_32px_-16px_rgba(0,105,65,0.45)] transition-opacity hover:opacity-90"
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
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757778]" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or users..."
              className="w-full rounded-xl bg-white py-3 pl-11 pr-4 text-sm text-[#2c2f30] outline-none ring-[#006941]/20 transition focus:ring-2"
            />
          </div>

          <div className="ml-6 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#595c5d] transition-colors hover:bg-[#e6e8ea] hover:text-[#006941]"
            >
              <Bell className="h-5 w-5" />
            </button>
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

function NavItem({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#595c5d] transition-all hover:translate-x-1 hover:bg-[#e0e3e4] hover:text-[#2c2f30]"
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
