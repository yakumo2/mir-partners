import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PasswordGate from "./components/PasswordGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "传奇合伙人",
  description: "传奇合伙人计划：米拉成长体系、星级晋升、收益结算全景介绍。",
  openGraph: {
    title: "传奇合伙人",
    description: "传奇合伙人计划：米拉成长体系、星级晋升、收益结算全景介绍。",
    url: "https://legendary-partners.local",
    siteName: "传奇合伙人",
    images: [
      {
        url: "/mir-logo.png",
        width: 1280,
        height: 720,
        alt: "传奇合伙人 | Mir 暮光双龙"
      }
    ],
    locale: "zh_CN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "传奇合伙人",
    description: "传奇合伙人计划：米拉成长体系、星级晋升、收益结算全景介绍。",
    images: ["/mir-logo.png"]
  },
  icons: {
    icon: "/mir-logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
