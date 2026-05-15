import "./globals.css";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import MainContainer from "@/components/layout/MainContainer";
import SpeedInsightsProvider from "@/components/layout/SpeedInsightsProvider";

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
        <SiteHeader />

        <MainContainer>{children}</MainContainer>

        <SpeedInsightsProvider />
      </body>
    </html>
  );
}
