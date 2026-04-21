import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSession from "@/stores/Contexts/AuthSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Flowspace",
  description: "Flowspace - Your workspace for collaboration",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable} ${geistMono.variable} h-full antialiased
        `
    }
    >
      <body className="min-h-full flex flex-col">
        <AuthSession>
          {children}
        </AuthSession>
      </body>
    </html>
  )
}