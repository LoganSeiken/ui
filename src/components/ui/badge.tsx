import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

export const badgeVariants = cva(
  "inline-flex h-5 items-center gap-1 border px-2 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-muted text-foreground",
        success: "border-transparent bg-success-subtle text-success-subtle-foreground",
        warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
        danger: "border-transparent bg-destructive-subtle text-destructive-subtle-foreground",
        outline: "border-border bg-surface text-muted-foreground",
        "success-outline": "border-chart-success bg-surface text-success-subtle-foreground"
      },
      shape: { pill: "rounded-pill", square: "rounded-sm" }
    },
    defaultVariants: { variant: "neutral", shape: "pill" }
  }
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, shape, className, ...props }: BadgeProps) {
  return <span {...props} className={cn(badgeVariants({ variant, shape }), className)} />;
}
