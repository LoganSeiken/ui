import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const fieldVariants = cva("grid content-start gap-2", {
  variants: {
    orientation: {
      vertical: "",
      horizontal: "items-start gap-x-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
    }
  },
  defaultVariants: { orientation: "vertical" }
});

export type FieldProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof fieldVariants> & {
    label: ReactNode;
    htmlFor?: string;
    description?: ReactNode;
    error?: ReactNode;
    children: ReactNode;
  };

export function Field({ label, htmlFor, description, error, orientation, className, children, ...props }: FieldProps) {
  return (
    <div {...props} className={cn(fieldVariants({ orientation }), className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="grid gap-1.5">
        {children}
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {error ? <p role="alert" className="text-sm text-destructive-subtle-foreground">{error}</p> : null}
      </div>
    </div>
  );
}
