import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
      {icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pastel-pink text-rose-gold">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      {action}
    </div>
  );
}
