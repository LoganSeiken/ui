import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const titleVariants = cva("font-medium text-foreground", {
  variants: { size: { sm: "text-base", md: "text-2xl", lg: "text-3xl" } },
  defaultVariants: { size: "md" },
});

export type PageHeaderProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof titleVariants> & {
    title: ReactNode;
    description?: ReactNode;
    badge?: ReactNode;
    actions?: ReactNode;
  };

export function PageHeader({
  title,
  description,
  badge,
  actions,
  size,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div {...props} className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className={titleVariants({ size })}>{title}</h1>
          {badge}
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
