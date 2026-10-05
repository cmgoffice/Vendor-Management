import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendorly · Vendor Management",
  description: "Register your company, manage vendor profiles and evaluate partner performance.",
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
