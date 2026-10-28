import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const emptyStateVariants = cva("flex flex-col items-center gap-3 px-6 py-9 text-center", {
  variants: {
    variant: {
      dashed: "rounded-md border border-dashed border-input",
      plain: "",
    },
  },
  defaultVariants: { variant: "dashed" },
});

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    actions?: ReactNode;
    titleAs?: "p" | "h1" | "h2" | "h3";
  };

export function EmptyState({
  title,
  description,
  icon,
  action,
  actions,
  titleAs = "p",
  variant,
  className,
  ...props
}: EmptyStateProps) {
  const Title = titleAs;
  return (
    <div {...props} className={cn(emptyStateVariants({ variant }), className)}>
      {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      <Title className="text-sm font-medium text-foreground">{title}</Title>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action || actions ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
