import { getBusinessSetting } from "@/lib/data";
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
  const setting = (await getBusinessSetting<string>("whatsapp", "")) ?? "";
  const raw = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || String(setting).trim();

  const digits = raw.replace(/[^\d]/g, "");
  const valid = digits.length >= 8 && digits.length <= 15 && !/^0+$/.test(digits);

  if (!valid) return null;

  const message = encodeURIComponent(
    "Hello Meera's - The Beauty Saga! I would like to know more about your services."
  );

  return <WhatsAppButton number={digits} message={message} />;
}
