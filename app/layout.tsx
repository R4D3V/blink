import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";

export const metadata: Metadata = {
  title: "$NASDOG — The dog that did the research",
  description:
    "$NASDOG on Solana. Born from MrNasdog's crypto research desk — public supply, public liquidity, public track record.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Ticker />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
