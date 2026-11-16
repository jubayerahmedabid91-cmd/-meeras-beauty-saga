import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { unstable_noStore as noStore } from "next/cache";
import "./globals.css";
import { safeAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { BRAND } from "@/lib/brand";

const heading = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  // Uses NEXT_PUBLIC_APP_URL from .env (set at build time)
  // Production: https://meeras-the-beauty-saga.netlify.app
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: `${BRAND.name} ${BRAND.tagline} | Premium Beauty Salon`,
    template: `%s | ${BRAND.name} ${BRAND.tagline}`,
  },
  description: BRAND.description,
  keywords: ["beauty salon", "bridal makeup", "hair styling", "facial", "Meera's", "The Beauty Saga"],
  openGraph: {
    title: `${BRAND.name} ${BRAND.tagline}`,
    description: BRAND.description,
    type: "website",
    locale: "en_US",
    siteName: `${BRAND.name} ${BRAND.tagline}`,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#B76E79",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  noStore();
  const session = await safeAuth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream font-body text-charcoal">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <SiteHeader user={role ? { role } : null} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
