import "./globals.css";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";

// 1. Tambahkan Impor SiteHeader (dan SiteFooter jika ada) di sini
import SiteHeader from "@/components/layout/SiteHeader";
// import SiteFooter from "@/components/layout/SiteFooter"; // Buka komentar jika sudah punya file SiteFooter

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

// CHANGE THIS VALUE TO TEST A DIFFERENT DEFAULT FONT ACROSS THE APP.
const DEFAULT_APP_FONT = "montserrat";

const fontFamilyMap = {
  montserrat: "var(--font-montserrat)",
  plusJakarta: "var(--font-plus-jakarta)",
};

export const metadata = {
  title: "Recipeat",
  description: "Smart recipe and meal planning app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${plusJakartaSans.variable} antialiased bg-[#f5f6f7]`}
        style={{ fontFamily: fontFamilyMap[DEFAULT_APP_FONT] }}
      >
        {/* 2. Panggil SiteHeader di posisi paling atas dalam body */}
        <SiteHeader />

        {/* 3. Bungkus children dengan <main> dan beri padding-top (pt-20) 
            agar konten tidak tertutup oleh navbar yang posisinya fixed (melayang) */}
        <main className="min-h-screen pt-20">
          {children}
        </main>

        {/* 4. Letakkan Footer di sini nanti */}
        {/* <SiteFooter /> */}
      </body>
    </html>
  );
}