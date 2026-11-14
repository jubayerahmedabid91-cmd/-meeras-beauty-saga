"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function BusinessSettingsForm({
  initial,
  keys,
  nestedKey,
}: {
  initial: Record<string, string | number>;
  keys: string[];
  nestedKey?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | number>>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const payload = nestedKey ? { [nestedKey]: form } : form;
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, values: payload }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {keys.map((key) => (
        <div key={key}>
          <label className="field-label capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            className="field-input"
            value={String(form[key] ?? "")}
            onChange={(e) => update(key, e.target.value)}
          />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">Could not save.</span>
        )}
      </div>
    </form>
  );
}
