import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/demo-context";

export const metadata: Metadata = {
  title: "TrustMap - Recommendations from people you trust",
  description: "Discover trusted businesses, services, and places recommended by your friends.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrustMap",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        <DemoProvider>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
