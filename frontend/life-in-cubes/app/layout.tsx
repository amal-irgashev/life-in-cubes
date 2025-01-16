import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { EventsProvider } from "../hooks/use-events-context";
import { ThemeProvider } from "../../components/theme-provider";

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
  title: "Life in Cubes - Memento Mori",
  description: "A visual representation of your life in weeks, inspired by the concept of Memento Mori",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EventsProvider>
            {children}
          </EventsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 