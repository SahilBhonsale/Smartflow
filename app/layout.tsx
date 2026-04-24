import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SmartFlow",
  description:
    "SmartFlow is an AI-powered SaaS productivity tool for managing tasks (Kanban-style) and notes (rich text), with an AI assistant that helps summarize, prioritize, and generate content.",
  keywords: ["productivity", "tasks", "notes", "AI", "kanban", "smartflow"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
