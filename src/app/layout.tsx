import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aamantran - A Boutique Homestay in Rudraprayag",
  description: "Experience tranquility at Aamantran Homestay in Rudraprayag, Uttarakhand. A perfect retreat in the Himalayas with breathtaking mountain views, comfortable rooms, and authentic hospitality.",
  keywords: "Aamantran, homestay, Rudraprayag, Uttarakhand, Himalayas, mountain retreat, boutique hotel",
  authors: [{ name: "Aamantran Homestay" }],
  openGraph: {
    title: "Aamantran - A Boutique Homestay in Rudraprayag",
    description: "Escape the noise and step into a space where mountains, silence, and fresh air come together.",
    type: "website",
    locale: "en_IN",
    siteName: "Aamantran Homestay",
  },
  icons: {
    icon: [
      { url: "/images/go.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/go.png", type: "image/png" },
    ],
    shortcut: "/images/go.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
