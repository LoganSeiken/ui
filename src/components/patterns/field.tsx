import { Children, cloneElement, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";
import { FieldControlProvider } from "../../utils/field-context.js";

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
  const descriptionId = htmlFor && description ? `${htmlFor}-description` : undefined;
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  // Link the description and error to the control for screen readers.
  const content = describedBy
    ? Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const element = child as ReactElement<{ id?: string; "aria-describedby"?: string }>;
        if (element.props.id !== htmlFor) return child;
        const existing = element.props["aria-describedby"];
        return cloneElement(element, { "aria-describedby": [existing, describedBy].filter(Boolean).join(" ") });
      })
    : children;

  return (
    <div {...props} className={cn(fieldVariants({ orientation }), className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="grid gap-1.5">
        <FieldControlProvider value={htmlFor && describedBy ? { htmlFor, describedBy } : null}>{content}</FieldControlProvider>
        {description ? <p id={descriptionId} className="text-sm text-muted-foreground">{description}</p> : null}
        {error ? <p id={errorId} role="alert" className="text-sm text-destructive-subtle-foreground">{error}</p> : null}
      </div>
    </div>
  );
}
