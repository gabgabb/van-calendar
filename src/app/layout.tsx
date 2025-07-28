import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Sora, Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "Van calendar",
    description:
        "Van calendar is a simple calendar app to manage bookings for a van rental service.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${sora.variable} ${robotoMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                    <Toaster position={"top-right"} richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
