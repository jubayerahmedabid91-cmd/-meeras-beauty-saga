import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CurrencyProvider } from "@/components/currency-provider";
import { safeAuth } from "@/lib/auth";
import { getSalonProfile } from "@/lib/salon";

export const dynamic = "force-dynamic";

/**
 * Storefront layout — every public, auth, customer and staff page renders
 * inside this chrome. `/admin` intentionally sits OUTSIDE this group and
 * uses its own admin shell instead.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [session, salon] = await Promise.all([safeAuth(), getSalonProfile()]);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <CurrencyProvider currency={salon.currency}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <SiteHeader
        user={role ? { role } : null}
        openingHours={salon.openingHours}
        logoUrl={salon.logoUrl}
        logoMobileUrl={salon.logoMobileUrl}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </CurrencyProvider>
  );
}
