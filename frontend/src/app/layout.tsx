import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalaryIQ - AI-Powered Salary Analysis",
  description:
    "Discover your true market value. Get AI-powered salary insights in seconds. Compare your compensation against real market data and discover your earning potential.",
  keywords: [
    "salary analysis",
    "salary calculator",
    "compensation analysis",
    "market salary",
    "salary insights",
    "AI salary",
  ],
  authors: [{ name: "SalaryIQ" }],
  creator: "SalaryIQ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://salaryiq.vercel.app",
    title: "SalaryIQ - AI-Powered Salary Analysis",
    description:
      "Discover your true market value with AI-powered salary insights",
    siteName: "SalaryIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalaryIQ - AI-Powered Salary Analysis",
    description:
      "Discover your true market value with AI-powered salary insights",
    creator: "@salaryiq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
