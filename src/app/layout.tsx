import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SCORBIO - Santé & Beauté Naturelle en Algérie",
  description:
    "Des solutions 100% naturelles pour votre santé et votre beauté. Livraison dans les 58 wilayas algériennes. Paiement à la livraison.",
  keywords: [
    "SCORBIO",
    "naturel",
    "santé",
    "beauté",
    "Algérie",
    "produits naturels",
    "compléments alimentaires",
    "soins naturels",
    "acné",
    "détox",
    "maca",
  ],
  authors: [{ name: "SCORBIO" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "SCORBIO - Santé & Beauté Naturelle",
    description: "Des solutions 100% naturelles pour votre santé et votre beauté",
    type: "website",
    locale: "fr_DZ",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
