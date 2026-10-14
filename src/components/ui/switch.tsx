"use client";

import type { ComponentProps } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../utils/cn.js";

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      {...props}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-pill border border-transparent bg-input p-0.5 transition-colors duration-(--ui-duration-fast) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
    >
      <SwitchPrimitive.Thumb className="block size-4 rounded-pill bg-surface shadow-sm transition-transform duration-(--ui-duration-fast) data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
}
