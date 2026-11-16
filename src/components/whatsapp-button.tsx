"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  const [open, setOpen] = useState(false);

  // Close the mini panel on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-lift">
          <div className="flex items-center gap-3 bg-charcoal px-4 py-3 text-cream">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-gold/20 text-rose-gold">
              <MessageCircle className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Meera&rsquo;s &ndash; The Beauty Saga</p>
              <p className="text-[0.65rem] text-cream/60">Typically replies within an hour</p>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <p className="rounded-xl rounded-tl-none bg-pastel-pink p-3 text-charcoal">
              Hello! Looking for a appointment or have a question about our services?
            </p>
            <a
              href={`https://wa.me/${number}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex w-full justify-center"
            >
              Start chat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className={cn(
          "group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lift transition-all duration-300 hover:scale-105 sm:h-14 sm:w-14",
          open ? "bg-charcoal" : "bg-[#25D366]",
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-25" />
          </>
        )}
      </button>
    </div>
  );
}
