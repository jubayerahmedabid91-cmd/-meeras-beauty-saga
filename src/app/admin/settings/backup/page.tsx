import type { Metadata } from "next";
import { Database, Download, Upload } from "lucide-react";

export const metadata: Metadata = { title: "Backup & Restore" };

export default function AdminBackupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Backup &amp; Restore</h1>
        <p className="mt-1 text-sm text-muted">Database backups and restore points.</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
            <Database className="h-5 w-5" />
          </span>
          <h2 className="font-bold">Database backup</h2>
        </div>
        <p className="mt-3 text-sm text-muted">
          Regular backups protect your business data. For SQLite (local development), copy the
          dev.db file. For PostgreSQL (production), use your provider&rsquo;s backup tools or{' '}
          <code className="rounded bg-pastel-pink px-1">pg_dump</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-outline" disabled>
            <Download className="h-4 w-4" />
            Download backup
          </button>
          <button className="btn-outline" disabled>
            <Upload className="h-4 w-4" />
            Restore backup
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Backup download and restore will be enabled once a storage provider is configured.
        </p>
      </div>
    </div>
  );
}
