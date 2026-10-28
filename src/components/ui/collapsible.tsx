"use client";

import type { ComponentProps } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn.js";

export const Collapsible = CollapsiblePrimitive.Root;

export function CollapsibleTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      className={cn(
        "group flex w-full items-center gap-2 px-2 py-2 font-mono text-xs uppercase tracking-caps text-muted-foreground hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <ChevronDown
        className="size-3 -rotate-90 transition-transform duration-(--ui-duration-fast) group-data-[state=open]:rotate-0"
        aria-hidden="true"
      />
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}

export function CollapsibleContent({
  className,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return <CollapsiblePrimitive.Content {...props} className={cn(className)} />;
}
