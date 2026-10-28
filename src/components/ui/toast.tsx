"use client";

import { useSyncExternalStore } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "../../utils/cn.js";

export type ToastVariant = "default" | "success" | "danger" | "warning";
export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};
type ToastItem = ToastOptions & { id: number };
let nextId = 0;
let items: ToastItem[] = [];
const listeners = new Set<() => void>();
const publish = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => items;
export function toast(options: ToastOptions) {
  const id = ++nextId;
  items = [...items, { ...options, id }];
  publish();
  return id;
}
export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
const variants: Record<ToastVariant, string> = {
  default: "border-border bg-surface text-surface-foreground",
  success: "border-transparent bg-success-subtle text-success-subtle-foreground",
  danger: "border-transparent bg-destructive-subtle text-destructive-subtle-foreground",
  warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
};

export type ToasterProps = {
  duration?: number;
  closeLabel: string;
  label: string;
  /** Supports Radix's `{hotkey}` placeholder, replaced with the active shortcut. */
  viewportLabel: string;
  swipeDirection?: "up" | "down" | "left" | "right";
};
export function Toaster({
  duration = 5000,
  closeLabel,
  label,
  viewportLabel,
  swipeDirection = "right",
}: ToasterProps) {
  const toasts = useToasts();
  const dismiss = (id: number) => {
    items = items.filter((item) => item.id !== id);
    publish();
  };
  return (
    <ToastPrimitive.Provider duration={duration} swipeDirection={swipeDirection} label={label}>
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          type={item.variant === "danger" ? "foreground" : "background"}
          duration={item.duration ?? duration}
          onOpenChange={(open) => {
            if (!open) dismiss(item.id);
          }}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-md",
            variants[item.variant ?? "default"],
          )}
        >
          <div className="flex-1">
            <ToastPrimitive.Title className="text-sm font-medium">
              {item.title}
            </ToastPrimitive.Title>
            {item.description ? (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {item.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          <ToastPrimitive.Close
            aria-label={closeLabel}
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        label={viewportLabel}
        className="fixed bottom-4 right-4 z-(--ui-z-toast) flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-hidden"
      />
    </ToastPrimitive.Provider>
  );
}
