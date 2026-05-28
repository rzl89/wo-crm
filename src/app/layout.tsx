import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirna CRM - WhatsApp AI CRM",
  description: "Platform manajemen lead & customer service berbasis WhatsApp yang ditenagai AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
