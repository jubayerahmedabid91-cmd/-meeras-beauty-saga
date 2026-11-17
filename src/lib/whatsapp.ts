import { cache } from "react";
import { getBusinessSetting } from "@/lib/data";
import { fillMessage } from "@/lib/messages";

export { fillMessage };

export type WhatsAppMessages = {
  /** Floating chat button and general enquiries. */
  default: string;
  /** Booking confirmation / reminders. */
  booking: string;
  /** Service enquiry. */
  service: string;
  /** Bridal enquiry. */
  bridal: string;
};

/**
 * Owner-editable WhatsApp message templates (Admin -> Settings -> WhatsApp).
 *
 * Plain, honest defaults are used until the owner writes their own. Templates
 * may contain {name}, {service}, {date}, {time} and {ref}; they are replaced
 * before the message is sent. No integration is activated without a real
 * WhatsApp number — the buttons simply deep-link to wa.me.
 */
export const getWhatsAppMessages = cache(async (): Promise<WhatsAppMessages> => {
  const raw = await getBusinessSetting<Partial<WhatsAppMessages> | null>(
    "whatsapp_messages",
    null,
  );
  const obj = raw && typeof raw === "object" ? (raw as Partial<WhatsAppMessages>) : {};

  return {
    default:
      typeof obj.default === "string" && obj.default.trim()
        ? obj.default.trim()
        : "Hello Meera's - The Beauty Saga! I would like to know more about your services.",
    booking:
      typeof obj.booking === "string" && obj.booking.trim()
        ? obj.booking.trim()
        : "Hello {name}, this is Meera's - The Beauty Saga. Your appointment is confirmed for {service} on {date} at {time} (ref {ref}). To change anything, just reply here.",
    service:
      typeof obj.service === "string" && obj.service.trim()
        ? obj.service.trim()
        : "Hello Meera's - The Beauty Saga! I would like to know more about {service}.",
    bridal:
      typeof obj.bridal === "string" && obj.bridal.trim()
        ? obj.bridal.trim()
        : "Hello Meera's - The Beauty Saga! I am planning my wedding and would like to know more about bridal packages.",
  };
});

