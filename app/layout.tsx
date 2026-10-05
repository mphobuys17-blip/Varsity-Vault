import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "ResXchange — Student Marketplace",
    template: "%s | ResXchange",
  },

  description:
    "ResXchange is a student marketplace for buying and selling products and services across South African campuses.",

  applicationName: "ResXchange",

  keywords: [
    "ResXchange",
    "student marketplace",
    "South Africa",
    "campus marketplace",
    "student products",
    "student services",
    "buy and sell",
  ],

  authors: [
    {
      name: "ResXchange",
    },
  ],

  creator: "ResXchange",
  publisher: "ResXchange",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/resxchange-logo.png",
    shortcut: "/resxchange-logo.png",
    apple: "/resxchange-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF9EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF9EF] text-[#14213D] antialiased">
        {children}
      </body>
    </html>
  );
}