"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Save } from "lucide-react";

type MessagesForm = {
  default: string;
  booking: string;
  service: string;
  bridal: string;
};

const FIELDS: { key: keyof MessagesForm; label: string; hint: string }[] = [
  {
    key: "default",
    label: "General enquiry",
    hint: "Used by the floating WhatsApp button on every page.",
  },
  {
    key: "booking",
    label: "Booking message",
    hint: "May use {name}, {service}, {date}, {time} and {ref}.",
  },
  {
    key: "service",
    label: "Service enquiry",
    hint: "May use {service}.",
  },
  {
    key: "bridal",
    label: "Bridal enquiry",
    hint: "Used on the bridal page.",
  },
];

export function WhatsAppSettingsForm({ initial }: { initial: MessagesForm }) {
  const router = useRouter();
  const [form, setForm] = useState<MessagesForm>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nestedKey: "whatsapp_messages", values: { whatsapp_messages: form } }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">WhatsApp messages</h2>
          <p className="text-xs text-muted">Pre-filled text for every WhatsApp button</p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-pastel-pink px-3 py-2 text-xs text-muted">
        These only change the pre-filled text — WhatsApp itself opens on the customer&rsquo;s
        phone. Set your number in <strong>Business information</strong>; buttons stay hidden
        until a real number is saved.
      </p>

      <div className="mt-4 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="field-label">{f.label}</label>
            <textarea
              rows={2}
              value={form[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="field-input resize-none"
            />
            <p className="mt-1 text-xs text-muted">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={save} disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save messages
        </button>
        {status === "saved" && <span className="text-sm font-medium text-emerald-600">Saved</span>}
        {status === "error" && <span className="text-sm font-medium text-rose-600">Could not save.</span>}
      </div>
    </div>
  );
}
