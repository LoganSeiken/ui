import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type FilterCardProps = ComponentProps<"form"> & { actions?: ReactNode; formComponent?: ElementType };

export function FilterCard({ actions, children, className, formComponent: FormComponent = "form", ...props }: FilterCardProps) {
  return (
    <FormComponent
      {...props}
      className={cn("rounded-md border border-border bg-surface text-surface-foreground", className)}
    >
      {/* Stacked below md so a field whose content settles after hydration (e.g. SelectValue) never wraps to a new row. */}
      <div className="grid gap-4 p-4 md:flex md:flex-wrap md:items-end">{children}</div>
      {actions ? <div className="flex items-center justify-end gap-2 border-t border-border p-4">{actions}</div> : null}
    </FormComponent>
  );
}
