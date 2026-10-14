"use client";

import type { ComponentProps } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "../../utils/cn.js";

export function ToggleGroup({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      {...props}
      className={cn("inline-flex items-center rounded-md border border-border bg-surface p-0.5", className)}
    />
  );
}

export function ToggleGroupItem({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      {...props}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=on]:bg-muted data-[state=on]:text-foreground",
        className
      )}
    />
  );
}
