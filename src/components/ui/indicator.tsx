import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const dotVariants = cva("absolute -top-0.5 -right-0.5 size-2 rounded-pill ring-2 ring-surface", {
  variants: {
    tone: { danger: "bg-chart-danger", success: "bg-chart-success", warning: "bg-warning-border" },
  },
  defaultVariants: { tone: "danger" },
});

export type IndicatorProps = ComponentProps<"span"> &
  VariantProps<typeof dotVariants> & { show?: boolean; label?: string };

export function Indicator({
  show = true,
  tone,
  label,
  className,
  children,
  ...props
}: IndicatorProps) {
  return (
    <span {...props} className={cn("relative inline-flex", className)}>
      {children}
      {show ? (
        <span
          role={label ? "status" : undefined}
          aria-label={label}
          aria-hidden={label ? undefined : true}
          className={dotVariants({ tone })}
        />
      ) : null}
    </span>
  );
}
