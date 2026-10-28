"use client";

import type { ComponentProps } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../utils/cn.js";

export function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={cn(
        "relative inline-flex size-8 shrink-0 overflow-hidden rounded-pill border border-border bg-muted",
        className,
      )}
    />
  );
}

export function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image {...props} className={cn("size-full object-cover", className)} />;
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={cn(
        "flex size-full items-center justify-center text-xs font-medium text-foreground",
        className,
      )}
    />
  );
}
