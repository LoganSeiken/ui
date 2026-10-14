"use client";

import type { ComponentProps, ReactNode } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../utils/cn.js";

export function RadioGroup({
  variant = "separate",
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root> & { variant?: "separate" | "joined" }) {
  return (
    <RadioGroupPrimitive.Root
      {...props}
      data-variant={variant}
      className={cn(
        "group/radio grid",
        variant === "joined" ? "divide-y divide-border overflow-hidden rounded-md border border-border" : "gap-2",
        className
      )}
    />
  );
}

function Indicator() {
  return (
    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-pill border border-input bg-surface group-data-[state=checked]:border-primary">
      <RadioGroupPrimitive.Indicator className="size-2 rounded-pill bg-primary" />
    </span>
  );
}

export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      {...props}
      className={cn(
        "group flex size-4 items-center justify-center rounded-pill focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
        className
      )}
    >
      <span className="flex size-4 items-center justify-center rounded-pill border border-input bg-surface group-data-[state=checked]:border-primary">
        <RadioGroupPrimitive.Indicator className="size-2 rounded-pill bg-primary" />
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export type RadioCardProps = ComponentProps<typeof RadioGroupPrimitive.Item> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export function RadioCard({ title, description, icon, className, ...props }: RadioCardProps) {
  return (
    <RadioGroupPrimitive.Item
      {...props}
      className={cn(
        "group flex w-full items-start gap-3 rounded-md border border-border bg-surface p-4 text-left group-data-[variant=joined]/radio:rounded-none group-data-[variant=joined]/radio:border-0 transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-surface-subtle",
        className
      )}
    >
      <Indicator />
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {title}
        </span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </span>
    </RadioGroupPrimitive.Item>
  );
}
