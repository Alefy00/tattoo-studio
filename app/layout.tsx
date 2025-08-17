import Navbar from "./(components)/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";



const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Tattoo Portfolio",
  description: "Portfólio de tatuagem — Next.js + Tailwind v4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
