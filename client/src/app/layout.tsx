import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; 
import Navbar from "@/components/shared/Navbar";   

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Component Generator",
  description: "Generate React components with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
