// app/layout.tsx
"use client";
import { CopyProvider } from "@/components/CopyContext"; // Adjust path
import Navigation from "@/components/Navigation"; // Import your Navigation component
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Include Navigation here */}
        <Navigation />

        <CopyProvider>{children}</CopyProvider>
      </body>
    </html>
  );
}
