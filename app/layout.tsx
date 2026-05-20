import type { Metadata } from "next";
import { Inter, Unkempt, Carter_One, Courgette } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const unkempt = Unkempt({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-unkempt",
});

const carter_one = Carter_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-carter-one",
});

const courgette = Courgette({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-courgette",
});

export const metadata: Metadata = {
  title: "Moemen Adam",
  description: "Moemen Adam's personal blog website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${courgette.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
