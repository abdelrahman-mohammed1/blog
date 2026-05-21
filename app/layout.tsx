import type { Metadata } from "next";
import { Inter, Unkempt } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const unkempt = Unkempt({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-unkempt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moemen Blog",
  description: "Moemen Blog content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${unkempt.variable}`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
