import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}
