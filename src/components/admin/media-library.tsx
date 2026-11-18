"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  ImagePlus,
  Loader2,
  Pencil,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt: string | null;
  caption: string | null;
  category: string;
  createdAt: string;
};

const CATEGORIES = ["general", "logo", "gallery", "bridal", "service", "team", "before-after"];

const LOGO_SLOTS: { key: string; label: string; hint: string }[] = [
  { key: "logo_url", label: "Header logo", hint: "Shown in the top navigation" },
  { key: "logo_footer_url", label: "Footer logo", hint: "Shown in the footer" },
  { key: "logo_mobile_url", label: "Mobile logo", hint: "Compact header variant" },
  { key: "favicon_url", label: "Favicon", hint: "Browser tab icon (square works best)" },
];

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({
  items,
  logos,
}: {
  items: MediaItem[];
  logos: Record<string, string>;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("general");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ alt: string; caption: string; category: string }>({
    alt: "",
    caption: "",
    category: "general",
  });
  const [logoDraft, setLogoDraft] = useState<Record<string, string>>(logos);
  const [logoSaved, setLogoSaved] = useState(false);

  const logoAssets = useMemo(() => items.filter((i) => i.category === "logo"), [items]);

  const visible = useMemo(() => {
    return items.filter((i) => {
      if (filter !== "all" && i.category !== filter) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        i.filename.toLowerCase().includes(needle) ||
        (i.alt ?? "").toLowerCase().includes(needle) ||
        (i.caption ?? "").toLowerCase().includes(needle)
      );
    });
  }, [items, filter, q]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const body = new FormData();
        body.append("file", file);
        body.append("category", category);
        if (alt.trim()) body.append("alt", alt.trim());

        const res = await fetch("/api/admin/media", { method: "POST", body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? `Could not upload ${file.name}.`);
          break;
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setAlt("");
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
      setTimeout(() => setProgress(0), 1200);
    }
  }

  async function saveEdit(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      setEditing(null);
      router.refresh();
    } catch {
      setError("Could not save the details.");
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Delete "${item.filename}"? This cannot be undone.`)) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not delete that file.");
    }
  }

  async function saveLogos() {
    setError("");
    setLogoSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: Object.keys(logoDraft), values: logoDraft }),
      });
      if (!res.ok) throw new Error();
      setLogoSaved(true);
      router.refresh();
      setTimeout(() => setLogoSaved(false), 2000);
    } catch {
      setError("Could not save the logo settings.");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Upload ─────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Upload media</h2>
            <p className="text-xs text-muted">
              PNG, JPG, WEBP, GIF or SVG · up to 3 MB · stored in your Neon database
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex min-h-[7rem] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/15 text-muted transition hover:border-rose-gold hover:text-rose-gold disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs font-semibold">Uploading… {progress}%</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-semibold">
                  Tap to choose photos or drop them here
                </span>
              </>
            )}
          </button>
          <div className="space-y-3">
            <div>
              <label className="field-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Alt text (optional)</label>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="What is in this photo?"
                className="field-input"
                maxLength={200}
              />
            </div>
          </div>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />

        {uploading && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full rounded-full bg-rose-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Brand logos ────────────────────────────────────────────────── */}
      <div className="card p-6">
        <h2 className="text-lg font-bold">Brand logos</h2>
        <p className="mt-1 text-xs text-muted">
          Pick any uploaded image for each slot. Choose &ldquo;Official brand mark&rdquo; to fall
          back to the supplied logo. Logos are live on the website as soon as you save.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LOGO_SLOTS.map((slot) => {
            const value = logoDraft[slot.key] ?? "";
            return (
              <div key={slot.key} className="rounded-xl border border-charcoal/10 p-3">
                <p className="text-sm font-semibold">{slot.label}</p>
                <p className="text-xs text-muted">{slot.hint}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-charcoal">
                    {value ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={value} alt="" className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/assets/logo.png" alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <select
                    value={value}
                    onChange={(e) =>
                      setLogoDraft((prev) => ({ ...prev, [slot.key]: e.target.value }))
                    }
                    className="field-input flex-1"
                  >
                    <option value="">Official brand mark</option>
                    {logoAssets.map((a) => (
                      <option key={a.id} value={a.url}>
                        {a.filename}
                      </option>
                    ))}
                    {value && value.startsWith("http") && (
                      <option value={value}>{value}</option>
                    )}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={saveLogos} className="btn-primary">
            Save logos
          </button>
          {logoSaved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
        </div>
      </div>

      {/* ── Library ────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Library ({items.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search files…"
                className="field-input !pl-9"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="field-input"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        {visible.length === 0 ? (
          <p className="mt-6 rounded-xl bg-pastel-pink px-4 py-6 text-center text-sm text-muted">
            {items.length === 0
              ? "No media yet — upload your first photo above."
              : "Nothing matches your search."}
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-xl border border-charcoal/10">
                <div className="relative aspect-square bg-charcoal/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt ?? item.filename}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full size"
                      className="rounded-lg bg-white/90 p-1.5 text-charcoal shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      title="Edit details"
                      onClick={() => {
                        setEditing(item.id);
                        setDraft({
                          alt: item.alt ?? "",
                          caption: item.caption ?? "",
                          category: item.category,
                        });
                      }}
                      className="rounded-lg bg-white/90 p-1.5 text-charcoal shadow-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => remove(item)}
                      className="rounded-lg bg-rose-600 p-1.5 text-white shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="mt-0.5 text-[0.65rem] text-muted">
                    {humanSize(item.sizeBytes)} · {item.category}
                  </p>
                  {item.alt && <p className="mt-0.5 truncate text-[0.65rem] text-muted">{item.alt}</p>}
                </div>

                {editing === item.id && (
                  <div className="space-y-2 border-t border-charcoal/10 p-2.5">
                    <input
                      value={draft.alt}
                      onChange={(e) => setDraft((d) => ({ ...d, alt: e.target.value }))}
                      placeholder="Alt text"
                      className="field-input !py-1.5 text-xs"
                      maxLength={200}
                    />
                    <input
                      value={draft.caption}
                      onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
                      placeholder="Caption"
                      className="field-input !py-1.5 text-xs"
                      maxLength={300}
                    />
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                      className="field-input !py-1.5 text-xs"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => saveEdit(item.id)}
                        className="btn-primary flex-1 !py-1.5 text-xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-charcoal/15 p-1.5 text-muted"
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
