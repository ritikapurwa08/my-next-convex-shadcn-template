import type { Metadata } from "next";
import { Geist_Mono, Inter, Manrope, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "material-symbols/outlined.css";

// 1. Inter Font Setup (For body and labels)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Manrope Font Setup (For headlines)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// 3. Geist Mono Setup (If monospace is required)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 4. Utsaah Font Setup (Local font for Hindi text)
const utsaah = localFont({
  src: "../public/font/utsaah/utsaah.ttf",
  variable: "--font-utsaah",
  display: "swap",
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["devanagari"],
  display: "swap",
  weight: "400",
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
        manrope.variable, // Added: This was missing, causing Manrope to not load!
        geistMono.variable,
        utsaah.variable,
        poppins.variable,
      )}
    >
      <body className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
