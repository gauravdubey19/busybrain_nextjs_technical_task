import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/utils/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BusyBrain Task",
  description: "A BusyBrain task web app for Assosicate React Developer",
  icons: { icon: "/favicon.ico" },
};

export default async function MainRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider
          session={session}
          //   refetchInterval={2}
          refetchOnWindowFocus={true}
          refetchWhenOffline={false}
        >
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
          >
            <Navbar />
            {children}
            <Toaster richColors closeButton />
          </NextThemesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
