"use client";

import type { ComponentProps } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn.js";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        {...props}
        className={cn(
          "z-(--ui-z-popover) max-w-64 rounded-sm bg-primary px-2 py-1 text-xs text-primary-foreground",
          className,
        )}
      />
    </TooltipPrimitive.Portal>
  );
}
