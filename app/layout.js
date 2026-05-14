import "./globals.css";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";

// 1. Tambahkan Impor SiteHeader (dan SiteFooter jika ada) di sini
import SiteHeader from "@/components/layout/SiteHeader";
import { Providers } from "@/components/Providers";
import MainContainer from "@/components/layout/MainContainer";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

// CHANGE THIS VALUE TO TEST A DIFFERENT DEFAULT FONT ACROSS THE APP.
const DEFAULT_APP_FONT = "geist";

const fontFamilyMap = {
  geist: "var(--font-geist)",
  plusJakarta: "var(--font-plus-jakarta)",
};

export const metadata = {
  title: "Recipeat",
  description: "Smart recipe and meal planning app",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${plusJakartaSans.variable} antialiased bg-[#f5f6f7]`}
        style={{ fontFamily: fontFamilyMap[DEFAULT_APP_FONT] }}
      >
        <Providers>
          {/* 2. Panggil SiteHeader di posisi paling atas dalam body */}
          <SiteHeader />

          <MainContainer>
            {children}
          </MainContainer>
        </Providers>

        <SpeedInsights />

        {/* 4. Letakkan Footer di sini nanti */}
        {/* <SiteFooter /> */}
      </body>
    </html>
  );
}