"use client";

import { createContext, useContext, type ComponentProps } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn.js";

type TabsVariant = "underline" | "cards";

const TabsVariantContext = createContext<TabsVariant>("underline");

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  variant = "underline",
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List> & { variant?: TabsVariant }) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        {...props}
        className={cn(
          variant === "underline"
            ? "flex gap-4 border-b border-border"
            : "grid grid-flow-col auto-cols-fr divide-x divide-border overflow-hidden rounded-md border border-border",
          className,
        )}
      />
    </TabsVariantContext.Provider>
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cn(
        "text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=active]:text-foreground",
        variant === "underline"
          ? "-mb-px border-b-2 border-transparent px-1 py-2 data-[state=active]:border-primary"
          : "flex flex-col items-center gap-2 bg-surface p-4 text-center hover:bg-surface-subtle data-[state=active]:bg-surface-subtle data-[state=active]:shadow-[inset_0_-2px_0_0_var(--ui-primary)]",
        className,
      )}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      {...props}
      className={cn("mt-4 focus-visible:outline-hidden", className)}
    />
  );
}
