import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { getBusinessSetting } from "@/lib/data";

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

/**
 * Root shell only — HTML, fonts and global styles.
 *
 * Storefront chrome (SiteHeader / SiteFooter / WhatsApp float) lives in the
 * `(site)` route group so that `/admin` renders its own dedicated, native-app
 * style shell with NO duplicate headers.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Owner-selected favicon from the Media Library (Admin -> Media Library).
  const favicon = await getBusinessSetting<string>("favicon_url", "").catch(() => "");

  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream font-body text-charcoal">
        {favicon ? (
          // eslint-disable-next-line @next/next/no-head-element
          <head>
            <link rel="icon" href={favicon} />
          </head>
        ) : null}
        {children}
      </body>
    </html>
  );
}
