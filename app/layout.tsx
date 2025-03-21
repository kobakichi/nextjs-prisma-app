import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// 本文用フォント (Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// 見出し・アクセント用フォント (Poppins)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${poppins.variable} bg-emerald-300 text-gray-800 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
