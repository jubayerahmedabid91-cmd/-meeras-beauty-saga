"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ShieldCheck } from "lucide-react";

type ClaimsForm = {
  certifiedArtists: boolean;
  authenticProducts: boolean;
  hygienicSuite: boolean;
  happyBrides: boolean;
};

const FIELDS: { key: keyof ClaimsForm; label: string; hint: string }[] = [
  {
    key: "certifiedArtists",
    label: "Certified Artists",
    hint: "Shown as a hero chip and in the trust bar.",
  },
  {
    key: "authenticProducts",
    label: "100% Authentic Products",
    hint: "Shown as a hero chip and in the trust bar.",
  },
  {
    key: "hygienicSuite",
    label: "Hygienic Bridal Suite",
    hint: "Shown in the trust bar.",
  },
  {
    key: "happyBrides",
    label: "500+ Happy Brides",
    hint: "Shown in the trust bar. Turn off unless this number is real.",
  },
];

export function ClaimsSettingsForm({ initial }: { initial: ClaimsForm }) {
  const router = useRouter();
  const [form, setForm] = useState<ClaimsForm>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nestedKey: "claims", values: { claims: form } }),
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
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">Website claims</h2>
          <p className="text-xs text-muted">Only tick what is genuinely true</p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-pastel-pink px-3 py-2 text-xs text-muted">
        Statements about certifications, product authenticity, suite hygiene and client
        numbers are <strong>hidden until you confirm them</strong>. Leave a box unticked and
        that claim disappears from the website.
      </p>

      <div className="mt-4 space-y-3">
        {FIELDS.map((f) => (
          <label
            key={f.key}
            className="flex items-start gap-3 rounded-xl border border-charcoal/10 p-3 transition hover:border-rose-gold"
          >
            <input
              type="checkbox"
              checked={form[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-rose-gold"
            />
            <span>
              <span className="block text-sm font-semibold">{f.label}</span>
              <span className="block text-xs text-muted">{f.hint}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="btn-primary"
        >
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save claims
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-emerald-600">Saved</span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">Could not save.</span>
        )}
      </div>
    </div>
  );
}
