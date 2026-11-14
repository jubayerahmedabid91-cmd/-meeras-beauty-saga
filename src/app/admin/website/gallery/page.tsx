import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/badge";
import { ImageIcon } from "lucide-react";

export const metadata: Metadata = { title: "Gallery Management" };

export default async function AdminWebsiteGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Gallery</h1>
        <p className="mt-1 text-sm text-muted">Images shown in the public gallery.</p>
      </div>

      {images.length === 0 ? (
        <EmptyState icon={<ImageIcon className="h-6 w-6" />} title="No gallery images" description="Add images to display in the gallery." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4">Image</th>
                <th className="p-4">Category</th>
                <th className="p-4">Order</th>
                <th className="p-4">Visible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {images.map((img) => (
                <tr key={img.id} className="hover:bg-pastel-pink/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={img.src} alt={img.alt} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="text-xs text-muted">{img.alt}</span>
                    </div>
                  </td>
                  <td className="p-4">{img.category}</td>
                  <td className="p-4">{img.sortOrder}</td>
                  <td className="p-4">
                    <Badge tone={img.isVisible ? "rose" : "outline"}>{img.isVisible ? "Visible" : "Hidden"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
