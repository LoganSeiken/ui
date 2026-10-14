import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type CalloutProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
};

export function Callout({ title, action, icon, className, ...props }: CalloutProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between gap-4 rounded-md border border-border bg-surface-subtle px-4 py-3", className)}
    >
      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        {title}
      </div>
      {action}
    </div>
  );
}
