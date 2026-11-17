import type { Metadata } from "next";
import Link from "next/link";
import { Home, Info, Image as ImageIcon, MessageSquareQuote, Star, UserSquare2, CircleHelp, Phone, Search } from "lucide-react";

export const metadata: Metadata = { title: "Website Content" };

const SECTIONS = [
  { href: "/admin/website", label: "Homepage Content", icon: Home, desc: "Hero, featured sections and homepage copy" },
  { href: "/admin/website/about", label: "About Page", icon: Info, desc: "Brand story and values" },
  { href: "/admin/website/gallery", label: "Gallery", icon: ImageIcon, desc: "Gallery images and categories" },
  { href: "/admin/website/reviews", label: "Customer Reviews", icon: Star, desc: "Approve or hide client reviews before they go live" },
  { href: "/admin/website/testimonials", label: "Testimonials", icon: MessageSquareQuote, desc: "Curated public testimonials" },
  { href: "/admin/website/team", label: "Team Profiles", icon: UserSquare2, desc: "Team member profiles" },
  { href: "/admin/website/faq", label: "FAQ", icon: CircleHelp, desc: "Frequently asked questions" },
  { href: "/admin/website/contact", label: "Contact Information", icon: Phone, desc: "Contact details and social links" },
  { href: "/admin/website/seo", label: "SEO Settings", icon: Search, desc: "Metadata and search settings" },
];

export default function AdminWebsitePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Website Content</h1>
        <p className="mt-1 text-sm text-muted">Manage the content shown on your public website.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="card card-hover p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-gold/10 text-rose-gold">
              <s.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-bold">{s.label}</h2>
            <p className="mt-1 text-xs text-muted">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
