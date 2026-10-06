import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMG Vendor Management",
  description: "Manage vendor profiles and evaluate partner performance with CMG Vendor Management.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
