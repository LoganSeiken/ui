import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type FormCardProps = ComponentProps<"form"> & {
  /** Use when the form is already contained by a Card, such as CenteredPage. */
  variant?: "default" | "plain";
};

export function FormCard({ className, variant = "default", ...props }: FormCardProps) {
  return (
    <form
      {...props}
      className={cn(
        variant === "plain"
          ? "text-surface-foreground"
          : "overflow-hidden rounded-md border border-border bg-surface text-surface-foreground",
        className,
      )}
    />
  );
}

export type FormSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  columns?: 1 | 2;
  children: ReactNode;
};

export function FormSection({ title, description, columns = 1, children }: FormSectionProps) {
  return (
    <section className="grid gap-4 border-b border-border p-6">
      {title || description ? (
        <div className="grid gap-1">
          {title ? <h2 className="text-base font-medium text-foreground">{title}</h2> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}
      <div className={columns === 2 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>{children}</div>
    </section>
  );
}

export type FormActionsProps = ComponentProps<"div">;

export function FormActions({ className, ...props }: FormActionsProps) {
  return <div {...props} className={cn("flex items-center justify-end gap-2 p-4", className)} />;
}
