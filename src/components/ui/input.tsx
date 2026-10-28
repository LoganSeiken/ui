import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

export const inputVariants = cva(
  "w-full rounded-md border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
  {
    variants: { size: { sm: "h-8 px-2.5", md: "h-10 px-3" } },
    defaultVariants: { size: "md" },
  },
);

export type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

export function Input({ size, className, type = "text", ...props }: InputProps) {
  return <input {...props} type={type} className={cn(inputVariants({ size }), className)} />;
}
