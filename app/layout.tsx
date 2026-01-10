import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const inter = Inter({ subsets: ["latin"] });

export const orbitron = Orbitron({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum's Shop",
  description:
    "Fast gaming top-ups, gift cards, crypto trading, and PayPal fund receiving. Buy PUBG & CODM UC, trade digital assets, and receive online payments via WhatsApp.",

  openGraph: {
    title: "Quantum's Shop",
    description:
      "Gaming top-ups, gift cards, crypto trades, and PayPal fund receiving at sweet rates. Fast, secure transactions handled instantly via WhatsApp.",
    type: "website",
    locale: "en",
    siteName: "Quantum's Shop",
  },
  twitter: {
    title: "Quantum's Shop",
    description:
      "Gaming top-ups, crypto trades, and PayPal fund receiving via WhatsApp.",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Header />
        <main className="mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
