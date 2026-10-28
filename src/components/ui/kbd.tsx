import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      {...props}
      className={cn(
        "inline-flex h-5 items-center rounded-sm border border-border bg-surface-subtle px-1.5 font-mono text-xs text-muted-foreground",
        className,
      )}
    />
  );
}
