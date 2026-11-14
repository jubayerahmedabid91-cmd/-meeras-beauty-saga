"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AdminWebsiteForm({
  resource,
  action,
  initialData,
  schema,
  successMessage,
}: {
  resource: string;
  action: "create" | "edit";
  initialData: Record<string, string | number | boolean>;
  schema: { fields: { name: string; type: string; label: string; required?: boolean }[] };
  successMessage: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | number | boolean>>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/website/${resource}/${action}`, {
        method: action === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
      router.push(`/admin/website/${resource}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p className="text-sm text-emerald-800"><strong>{successMessage}</strong></p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {schema.fields.map((f) => (
            <div key={f.name}>
              <label className="field-label">{f.label}</label>
              {f.type === "boolean" ? (
                <select
                  className="field-input"
                  value={String(form[f.name])}
                  onChange={(e) => update(f.name, e.target.value === "true")}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : f.type === "url" ? (
                <input
                  className="field-input"
                  value={String(form[f.name] || "")}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.label}
                />
              ) : f.type === "number" ? (
                <input
                  type="number"
                  className="field-input"
                  value={String(form[f.name] ?? "")}
                  onChange={(e) => update(f.name, Number(e.target.value))}
                  placeholder={f.label}
                />
              ) : (
                <input
                  className="field-input"
                  value={String(form[f.name] ?? "")}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.label}
                />
              )}
              {f.required && <span className="text-xs text-muted">Required</span>}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={status === "saving"}>
            {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {action === "create" ? "Save" : "Update"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.push(`/admin/website/${resource}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
