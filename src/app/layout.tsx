import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BGoodyFood - Organik Yaşam Tarzı",
  description: "En taze organik ürünler, sağlıklı yaşam için doğal ve lezzetli seçenekler. BGoodyFood ile organik dünyayı keşfedin.",
  keywords: ["BGoodyFood", "organik", "sağlıklı yaşam", "doğal ürünler", "Türkiye", "organik gıda"],
  authors: [{ name: "BGoodyFood Team" }],
  openGraph: {
    title: "BGoodyFood - Organik Yaşam Tarzı",
    description: "En taze organik ürünler, sağlıklı yaşam için doğal ve lezzetli seçenekler",
    url: "https://bgoodyfood.com",
    siteName: "BGoodyFood",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BGoodyFood - Organik Yaşam Tarzı",
    description: "En taze organik ürünler, sağlıklı yaşam için doğal ve lezzetli seçenekler",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
