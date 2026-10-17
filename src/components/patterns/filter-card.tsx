import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type FilterCardProps = ComponentProps<"form"> & { actions?: ReactNode };

export function FilterCard({ actions, children, className, ...props }: FilterCardProps) {
  return (
    <form
      {...props}
      className={cn("rounded-md border border-border bg-surface text-surface-foreground", className)}
    >
      <div className="flex flex-wrap items-end gap-4 p-4">{children}</div>
      {actions ? <div className="flex items-center justify-end gap-2 border-t border-border p-4">{actions}</div> : null}
    </form>
  );
}
