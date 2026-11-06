import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const mainFont = localFont({
  src: [
    { path: "./fonts/Montserrat-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Montserrat-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Агрегатор статей",
    default: "Агрегатор статей",
  },
  description:
    "Агрегатор статей: свежие публикации на разные темы в одном месте.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={mainFont.variable}>
      <body>{children}</body>
    </html>
  );
}
