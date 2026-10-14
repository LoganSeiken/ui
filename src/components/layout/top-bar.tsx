import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type TopBarProps = Omit<ComponentProps<"header">, "children"> & {
  start?: ReactNode;
  end?: ReactNode;
};

export function TopBar({ start, end, className, ...props }: TopBarProps) {
  return (
    <header
      {...props}
      className={cn("flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4", className)}
    >
      <div className="flex min-w-0 items-center gap-3">{start}</div>
      <div className="flex items-center gap-2">{end}</div>
    </header>
  );
}
