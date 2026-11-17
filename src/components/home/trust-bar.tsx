import { BadgeCheck, Crown, Leaf, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";

const PILLARS = [
  {
    icon: Leaf,
    title: "100% Authentic Products",
    text: "Only genuine, salon-grade products touch your hair and skin.",
  },
  {
    icon: BadgeCheck,
    title: "Certified Artists",
    text: "Trained, certified specialists for every service we offer.",
  },
  {
    icon: ShieldCheck,
    title: "Hygienic Bridal Suite",
    text: "A private, sanitised suite reserved for our brides.",
  },
  {
    icon: Crown,
    title: "500+ Happy Brides",
    text: "Trusted by hundreds of brides on their biggest day.",
  },
];

/** Four-pillar luxury trust bar. */
export function TrustBar() {
  return (
    <section className="border-y border-gold/20 bg-champagne/40">
      <div className="container-site grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
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
