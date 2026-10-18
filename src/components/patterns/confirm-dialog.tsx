"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "../ui/button.js";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog.js";

export type ConfirmDialogProps = { trigger: ReactNode; title: ReactNode; description?: ReactNode; confirmLabel?: string; cancelLabel?: string; variant?: "default" | "destructive"; onConfirm?: () => void | Promise<void>; confirmFormId?: string; pending?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void; closeLabel?: string };

export function ConfirmDialog({ trigger, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default", onConfirm, confirmFormId, pending = false, open, onOpenChange, closeLabel }: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const currentOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); };
  return <Dialog open={currentOpen} onOpenChange={setOpen}><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent closeLabel={closeLabel} closeDisabled={pending} onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }} onOpenAutoFocus={variant === "destructive" ? (event) => { event.preventDefault(); cancelRef.current?.focus(); } : undefined}>
    <DialogHeader><DialogTitle>{title}</DialogTitle>{description ? <DialogDescription>{description}</DialogDescription> : null}</DialogHeader>
    <DialogFooter><DialogClose asChild><Button ref={cancelRef} variant="outline" disabled={pending}>{cancelLabel}</Button></DialogClose><Button type={confirmFormId ? "submit" : "button"} form={confirmFormId} variant={variant === "destructive" ? "destructive" : "primary"} loading={pending} onClick={confirmFormId ? undefined : async () => { await onConfirm?.(); setOpen(false); }}>{confirmLabel}</Button></DialogFooter>
  </DialogContent></Dialog>;
}
