"use client";

import type { ComponentProps } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils/cn.js";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        {...props}
        className={cn(
          "z-(--ui-z-popover) w-72 rounded-lg border border-border bg-surface p-3 text-sm text-surface-foreground shadow-md focus-visible:outline-hidden",
          className,
        )}
      />
    </PopoverPrimitive.Portal>
  );
}
