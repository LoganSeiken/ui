import { useId, type ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type SectionProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  separated?: boolean;
  children?: ReactNode;
  className?: string;
};

export function Section({ title, description, actions, separated = false, children, className }: SectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={cn("space-y-4", separated && "border-t border-border pt-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-1">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children != null ? <div className="space-y-4">{children}</div> : null}
    </section>
  );
}
