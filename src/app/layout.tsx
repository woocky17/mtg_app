import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTG App v1.2.0",
  description: "Magic: The Gathering card browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
        {children}
      </body>
    </html>
  );
}
