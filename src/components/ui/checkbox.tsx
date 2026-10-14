"use client";

import type { ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn.js";

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-surface text-primary-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        className
      )}
    >
      <CheckboxPrimitive.Indicator className="group flex items-center justify-center">
        <Check className="size-3 group-data-[state=indeterminate]:hidden" aria-hidden="true" />
        <Minus className="hidden size-3 group-data-[state=indeterminate]:block" aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
