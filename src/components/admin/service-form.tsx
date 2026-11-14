"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function ServiceForm({
  initial,
  serviceId,
}: {
  initial?: Record<string, string | number | boolean>;
  serviceId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    initial ?? {
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      durationMin: 60,
      priceCents: 0,
      isActive: true,
      isFeatured: false,
      imageUrl: "",
    },
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services", {
        method: serviceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
      router.push("/admin/services");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Name</label>
          <input className="field-input" value={String(form.name)} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Slug</label>
          <input className="field-input" value={String(form.slug)} onChange={(e) => update("slug", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="field-label">Description</label>
        <textarea rows={3} className="field-input resize-none" value={String(form.description)} onChange={(e) => update("description", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label">Duration (min)</label>
          <input type="number" min={1} className="field-input" value={Number(form.durationMin)} onChange={(e) => update("durationMin", Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Price (cents)</label>
          <input type="number" min={0} className="field-input" value={Number(form.priceCents)} onChange={(e) => update("priceCents", Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Image URL</label>
          <input className="field-input" value={String(form.imageUrl)} onChange={(e) => update("imageUrl", e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => update("isActive", e.target.checked)} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(e) => update("isFeatured", e.target.checked)} />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save service"
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
