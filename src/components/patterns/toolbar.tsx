import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function Toolbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div role="toolbar" {...props} className={cn("flex flex-wrap items-center gap-2", className)} />
  );
}

export function ToolbarSpacer({ className, ...props }: ComponentProps<"div">) {
  return <div aria-hidden="true" {...props} className={cn("flex-1", className)} />;
}
