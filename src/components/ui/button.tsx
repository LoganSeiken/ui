import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";
import { Spinner } from "./spinner.js";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-(--ui-duration-fast) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "border border-border bg-surface text-foreground hover:bg-muted",
        dashed: "border border-dashed border-input bg-transparent text-foreground hover:bg-muted",
        ghost:
          "bg-transparent text-foreground hover:bg-muted aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
        icon: "size-8 p-0 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : props["aria-busy"]}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
