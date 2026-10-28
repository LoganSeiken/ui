import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const topBarVariants = cva(
  "flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4",
  {
    variants: { size: { sm: "h-12", md: "h-14" } },
    defaultVariants: { size: "md" },
  },
);

export type TopBarProps = Omit<ComponentProps<"header">, "children"> &
  VariantProps<typeof topBarVariants> & {
    start?: ReactNode;
    end?: ReactNode;
  };

export function TopBar({ start, end, size, className, ...props }: TopBarProps) {
  return (
    <header {...props} className={cn(topBarVariants({ size }), className)}>
      <div className="flex min-w-0 items-center gap-3">{start}</div>
      <div className="flex items-center gap-2">{end}</div>
    </header>
  );
}
