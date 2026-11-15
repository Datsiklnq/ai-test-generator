import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Test Generator",
  description: "Generate QA test cases and automation scripts with AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
