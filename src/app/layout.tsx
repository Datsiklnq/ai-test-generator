"use client";
import { CopyProvider } from "@/components/CopyContext"; // Adjust path
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopyProvider>
          {children}
        </CopyProvider>
      </body>
    </html>
  );
}