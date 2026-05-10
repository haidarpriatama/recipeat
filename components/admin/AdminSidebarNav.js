"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UtensilsCrossed, Carrot } from "lucide-react";

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { href: "/admin/recipes", icon: UtensilsCrossed, label: "Manage Recipes" },
    { href: "/admin/ingredients", icon: Carrot, label: "Manage Ingredients" },
    { href: "/admin/users", icon: Users, label: "Users" },
  ];

  return (
    <nav className="flex flex-1 flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{ color: isActive ? "white" : undefined }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:translate-x-1 ${
              isActive
                ? "bg-[#006941] shadow-md"
                : "text-[#595c5d] hover:bg-[#e0e3e4] hover:text-[#2c2f30]"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
