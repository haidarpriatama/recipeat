import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, UtensilsCrossed, LogOut, Home } from "lucide-react";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="text-2xl font-black text-[#00E58F]">
            Recipeat Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-[#00E58F] transition-all font-semibold">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-[#00E58F] transition-all font-semibold">
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link href="/admin/recipes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-[#00E58F] transition-all font-semibold">
            <UtensilsCrossed size={20} />
            <span>Recipes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white text-slate-400 transition-all font-semibold">
            <Home size={20} />
            <span>Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
