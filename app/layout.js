import "./globals.css";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";

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
        className={`${montserrat.variable} ${plusJakartaSans.variable} antialiased`}
        style={{ fontFamily: fontFamilyMap[DEFAULT_APP_FONT] }}
      >
        {children}
      </body>
    </html>
  );
}