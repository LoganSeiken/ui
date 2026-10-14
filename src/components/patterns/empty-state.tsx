import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const emptyStateVariants = cva("flex flex-col items-center gap-3 px-6 py-10 text-center", {
  variants: {
    variant: {
      dashed: "rounded-md border border-dashed border-input",
      plain: ""
    }
  },
  defaultVariants: { variant: "dashed" }
});

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
  };

export function EmptyState({ title, description, icon, action, variant, className, ...props }: EmptyStateProps) {
  return (
    <div {...props} className={cn(emptyStateVariants({ variant }), className)}>
      {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
