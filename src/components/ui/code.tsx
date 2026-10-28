import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function Code({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      {...props}
      className={cn(
        "rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground-subtle",
        className,
      )}
    />
  );
}
