import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import AppProvider from "@/providers/app-provider";

import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Modal from "@/components/modal";
import RoomProvider from "@/providers/room-provider";

const poppins = Poppins({
  weight: ["100", "200", "400", "300", "500"],
  subsets: ["latin"],
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
      <body className={`${poppins.className}`}>
        <RoomProvider>
          <AppProvider>
            <Toaster />
            <Modal />
            {children}
          </AppProvider>
        </RoomProvider>
      </body>
    </html>
  );
}
