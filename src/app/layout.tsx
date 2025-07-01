import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPACalc - Advanced GPA Calculator & Academic Planning Tool",
  description: "Calculate, track, and analyze your GPA with precision. Supporting multiple grading systems, what-if scenarios, and academic planning for students worldwide.",
  keywords: ["GPA calculator", "academic planning", "grade calculator", "student tools", "university", "college"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider
          defaultTheme="system"
          storageKey="gpa-calc-theme"
        >
          <AuthProvider>
            <ClientBody>{children}</ClientBody>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
