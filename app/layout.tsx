import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("https://quantumsshop.com"),
  alternates: { canonical: "https://quantumsshop.com" },
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
    url: "https://quantumsshop.com.ng/",
    images: [
      {
        url: "/opengraph-image.jpeg",
        width: 1200,
        height: 606,
        alt: "Quantum's Shop preview",
      },
    ],
  },
  twitter: {
    title: "Quantum's Shop",
    description:
      "Gaming top-ups, crypto trades, and PayPal fund receiving via WhatsApp.",
    card: "summary_large_image",
    images: ["/twitter-image.jpeg"],
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
