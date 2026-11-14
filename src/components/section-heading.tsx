import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <Reveal className={`flex flex-col gap-3 ${alignCls}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>}
      {children}
    </Reveal>
  );
}
