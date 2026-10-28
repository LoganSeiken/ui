import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function ButtonGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      {...props}
      className={cn(
        "inline-flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        className,
      )}
    />
  );
}
