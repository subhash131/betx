import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import AppProvider from "@/providers/app-provider";

import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BetX",
  description: "Project by subhash",
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
        <AppProvider>
          <Toaster />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
