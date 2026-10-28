"use client";

import type { ComponentProps } from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;
export const DropdownMenuSub = DropdownPrimitive.Sub;

export function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        {...props}
        className={cn(
          "z-(--ui-z-popover) min-w-56 rounded-lg border border-border bg-surface p-1 text-sm text-surface-foreground shadow-md",
          className,
        )}
      />
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      {...props}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden data-[disabled]:opacity-50 data-[highlighted]:bg-muted",
        className,
      )}
    />
  );
}

export function DropdownMenuItemDescription({ className, ...props }: ComponentProps<"span">) {
  return <span {...props} className={cn("block text-xs text-muted-foreground", className)} />;
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Label>) {
  return (
    <DropdownPrimitive.Label
      {...props}
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      {...props}
      className={cn("-mx-1 my-1 h-px bg-border", className)}
    />
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      {...props}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-7 outline-hidden relative data-[disabled]:opacity-50 data-[highlighted]:bg-muted",
        className,
      )}
    >
      <DropdownPrimitive.ItemIndicator className="absolute left-2 flex items-center">
        <span className="size-1.5 rounded-pill bg-primary" />
      </DropdownPrimitive.ItemIndicator>
      {children}
    </DropdownPrimitive.RadioItem>
  );
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubTrigger>) {
  return (
    <DropdownPrimitive.SubTrigger
      {...props}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden data-[disabled]:opacity-50 data-[highlighted]:bg-muted data-[state=open]:bg-muted",
        className,
      )}
    >
      <span className="flex-1">{children}</span>
      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
    </DropdownPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.SubContent
        {...props}
        className={cn(
          "z-(--ui-z-popover) min-w-48 rounded-lg border border-border bg-surface p-1 text-sm text-surface-foreground shadow-md",
          className,
        )}
      />
    </DropdownPrimitive.Portal>
  );
}
