import type { Metadata } from "next";
import "./globals.css";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalSidebar from "@/components/GlobalSidebar";

export const metadata: Metadata = {
  title: "Duolearn",
  description: "Learn every day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0F1B20] text-white">

        {/* =================================================
            GLOBAL HEADER
        ================================================= */}

        <GlobalHeader />

        {/* =================================================
            GLOBAL SIDEBAR
            Fixed only — DOES NOT change page width
        ================================================= */}

        <GlobalSidebar />

        {/* =================================================
            PAGE CONTENT

            IMPORTANT:
            No padding-left.
            No margin-left.
            No screen/layout changes.
        ================================================= */}

        <div className="min-h-screen pt-[100px]">
          {children}
        </div>

      </body>
    </html>
  );
}