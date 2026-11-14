"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("Thank you! Your message has been received.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">Full name</label>
          <input id="name" name="name" required className="field-input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Phone</label>
          <input id="phone" name="phone" type="tel" className="field-input" placeholder="Your phone number" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" required className="field-input" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="subject" className="field-label">Subject</label>
        <input id="subject" name="subject" className="field-input" placeholder="How can we help?" />
      </div>
      <div>
        <label htmlFor="message" className="field-label">Message</label>
        <textarea id="message" name="message" required rows={4} className="field-input resize-none" placeholder="Write your message..." />
      </div>

      {status === "success" && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
