import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FutureProof Score",
  description:
    "A no-AI automation risk calculator for jobs, businesses, and tasks.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
