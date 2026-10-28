"use client";

import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../utils/cn.js";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, closeLabel, closeDisabled = false, ...props }: ComponentProps<typeof DialogPrimitive.Content> & { closeLabel: string; closeDisabled?: boolean }) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-(--ui-z-overlay) bg-overlay backdrop-blur-xs" />
    <DialogPrimitive.Content {...props} className={cn("fixed top-1/2 left-1/2 z-(--ui-z-overlay) w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface text-surface-foreground shadow-md focus-visible:outline-hidden", className)}>
      {children}<DialogPrimitive.Close aria-label={closeLabel} disabled={closeDisabled} className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"><X className="size-4" aria-hidden="true" /></DialogPrimitive.Close>
    </DialogPrimitive.Content></DialogPrimitive.Portal>;
}
export function DialogHeader({ className, ...props }: ComponentProps<"div">) { return <div {...props} className={cn("flex flex-col gap-1 p-6 pb-4 pr-14", className)} />; }
export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title {...props} className={cn("text-lg font-medium text-foreground", className)} />; }
export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description {...props} className={cn("text-sm text-muted-foreground", className)} />; }
export function DialogFooter({ className, ...props }: ComponentProps<"div">) { return <div {...props} className={cn("flex items-center justify-end gap-2 border-t border-border p-4", className)} />; }
