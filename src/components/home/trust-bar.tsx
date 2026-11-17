import { BadgeCheck, Crown, Leaf, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Claims } from "@/lib/claims";

const PILLARS: { key: keyof Claims; icon: typeof Leaf; title: string; text: string }[] = [
  {
    key: "authenticProducts",
    icon: Leaf,
    title: "100% Authentic Products",
    text: "Only genuine, salon-grade products touch your hair and skin.",
  },
  {
    key: "certifiedArtists",
    icon: BadgeCheck,
    title: "Certified Artists",
    text: "Trained, certified specialists for every service we offer.",
  },
  {
    key: "hygienicSuite",
    icon: ShieldCheck,
    title: "Hygienic Bridal Suite",
    text: "A private, sanitised suite reserved for our brides.",
  },
  {
    key: "happyBrides",
    icon: Crown,
    title: "500+ Happy Brides",
    text: "Trusted by hundreds of brides on their biggest day.",
  },
];

/**
 * Four-pillar luxury trust bar.
 * Only pillars the owner confirmed in Admin -> Settings are displayed, so an
 * unverified claim is never published as fact.
 */
export function TrustBar({ claims }: { claims: Claims }) {
  const visible = PILLARS.filter((p) => claims[p.key]);
  if (visible.length === 0) return null;

  return (
    <section className="border-y border-gold/20 bg-champagne/40">
      <div className="container-site grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p, i) => (
          <Reveal key={p.key} delay={i * 0.06}>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-white text-gold-dark shadow-soft">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold leading-snug">{p.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
