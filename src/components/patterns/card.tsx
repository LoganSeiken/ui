import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const cardVariants = cva("rounded-md border text-surface-foreground", {
  variants: {
    variant: {
      default: "border-border bg-surface",
      dashed: "border-dashed border-input bg-transparent"
    }
  },
  defaultVariants: { variant: "default" }
});

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardVariants>;

export function Card({ variant, className, ...props }: CardProps) {
  return <div {...props} className={cn(cardVariants({ variant }), className)} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col gap-1 border-b border-border p-4", className)} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 {...props} className={cn("text-base font-medium text-foreground", className)} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cn("text-sm text-muted-foreground", className)} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("p-4", className)} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("flex items-center gap-2 border-t border-border p-4", className)} />;
}
