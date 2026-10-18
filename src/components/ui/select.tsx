"use client";

import type { ComponentProps } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";
import { useFieldDescribedBy } from "../../utils/field-context.js";

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-surface text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground",
  {
    variants: { size: { sm: "h-8 px-2.5", md: "h-10 px-3" } },
    defaultVariants: { size: "md" }
  }
);

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants>) {
  const describedBy = useFieldDescribedBy(props.id, props["aria-describedby"]);
  return (
    <SelectPrimitive.Trigger {...props} aria-describedby={describedBy} className={cn(selectTriggerVariants({ size }), className)}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        {...props}
        className={cn(
          "z-(--ui-z-popover) min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-border bg-surface text-surface-foreground shadow-md",
          className
        )}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(
        "relative flex h-8 cursor-default select-none items-center rounded-sm pr-8 pl-2 text-sm outline-hidden data-[disabled]:opacity-50 data-[highlighted]:bg-muted",
        className
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2">
        <Check className="size-4" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
