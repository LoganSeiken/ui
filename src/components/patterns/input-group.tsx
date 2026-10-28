import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";
import { Input } from "../ui/input.js";

export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-8 w-full items-center rounded-md border border-input bg-surface focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    />
  );
}

export function InputGroupAddon({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-full shrink-0 items-center gap-1 border-r border-border px-2.5 text-sm text-muted-foreground",
        className,
      )}
    />
  );
}

export function InputGroupInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn("h-full min-w-0 flex-1 border-0 focus-visible:ring-0", className)}
    />
  );
}
