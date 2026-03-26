import type { Metadata } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "material-symbols/outlined.css";
// 1. Inter Font Setup (आपके body और labels के लिए)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Manrope Font Setup (आपकी headlines के लिए)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// 3. Geist Mono Setup (यदि आपको मोनोस्पेस की आवश्यकता है)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Exam Orbit - Dashboard",
  description: "Academic Test Practice Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,

        "font-sans", // यह globals.css में इंटर को डिफ़ॉल्ट बनाएगा
      )}
    >
      {/* <head> टैग में अब कोई बाहरी Google Fonts या Material Icons के <link> नहीं हैं */}
      <body>
        <ConvexClientProvider>
          <main className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed antialiased min-h-screen">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
