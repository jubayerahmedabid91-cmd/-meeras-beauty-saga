import { getWhatsAppDigits } from "@/lib/data";
import { getWhatsAppMessages } from "@/lib/whatsapp";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Floating WhatsApp chat button, shown on every page.
 *
 * The number comes from the owner-configurable business setting (Admin ->
 * Settings -> Business information -> WhatsApp). An explicit
 * NEXT_PUBLIC_WHATSAPP override wins, which is handy on hosts where the
 * database is not reachable. Nothing renders until a real number is set, so we
 * never invent a phone number for the business.
 */
export async function WhatsAppFloat() {
  const [digits, messages] = await Promise.all([getWhatsAppDigits(), getWhatsAppMessages()]);
  if (!digits) return null;

  const message = encodeURIComponent(messages.default);

  return <WhatsAppButton number={digits} message={message} />;
}
