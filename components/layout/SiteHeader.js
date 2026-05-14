import Link from "next/link";
import AuthNav from "@/components/layout/AuthNav";
import NavLinks from "./NavLinks";
import HeaderPathFilter from "./HeaderPathFilter";
import { auth } from "@/lib/auth";

export default async function SiteHeader({
  brand = "Recipeat",
  navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Meal Plans", href: "/meal-plans" },
    { label: "Favorites", href: "/favorites" },
  ],
}) {
  const session = await auth();


  return (
    <HeaderPathFilter>
      <header className="fixed top-0 z-50 w-full bg-[#f5f6f7]/80 backdrop-blur-xl shadow-sm shadow-[#006941]/5">
        <div className="flex h-20 w-full items-center justify-between px-6 md:px-10">
          
          <Link
            className="text-2xl font-bold tracking-tighter !text-[#006941]"
            style={{ color: "#006941" }}
            href="/"
          >
            {brand}
          </Link>

          <NavLinks navLinks={navLinks} />

          <AuthNav initialSession={session} />
        </div>
      </header>
    </HeaderPathFilter>
  );
}