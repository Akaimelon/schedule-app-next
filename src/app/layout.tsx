import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  preload: false,
  display: "swap",
  variable: "--font-rounded",
});

export const metadata: Metadata = {
  title: "ひまわり予定表",
  description: "療育施設の日程を管理するWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${rounded.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
