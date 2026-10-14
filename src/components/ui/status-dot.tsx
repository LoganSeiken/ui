import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const statusDotVariants = cva("inline-block size-2 shrink-0 rounded-pill", {
  variants: {
    status: {
      success: "bg-chart-success",
      danger: "bg-chart-danger",
      warning: "bg-warning-border",
      neutral: "bg-input"
    }
  },
  defaultVariants: { status: "neutral" }
});

export type StatusDotProps = Omit<ComponentProps<"span">, "children"> &
  VariantProps<typeof statusDotVariants> & { label?: string };

export function StatusDot({ status, label, className, ...props }: StatusDotProps) {
  return (
    <span
      {...props}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(statusDotVariants({ status }), className)}
    />
  );
}
