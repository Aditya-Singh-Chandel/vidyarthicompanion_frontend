import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/authEngine/AuthContext";
import { OverlayProvider } from "@/components/overlays/OverlayContext";
import OverlayRoot from "@/components/overlays/OverlayRoot";
import AppShell from "@/components/AppShell";
import ScrollRevealUtility from "@/components/ScrollRevealUtility";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VidyarthiCompanion | Midnight Monsoon Campus OS",
  description: "Think smarter on campus — AI-powered student life in a fluid, interconnected interface",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-screen overflow-hidden bg-[var(--mist)] text-[var(--text-primary)]">
        <AuthProvider>
          <OverlayProvider>
            <AppShell>{children}</AppShell>
            <OverlayRoot />
            <ScrollRevealUtility />
          </OverlayProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
