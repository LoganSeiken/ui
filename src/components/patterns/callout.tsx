import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type CalloutProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger";
};

const variants = {
  neutral: "border-border bg-surface-subtle",
  success: "border-transparent bg-success-subtle text-success-subtle-foreground",
  warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
  danger: "border-transparent bg-destructive-subtle text-destructive-subtle-foreground"
};

export function Callout({ title, action, icon, variant = "neutral", className, role, ...props }: CalloutProps) {
  return (
    <div
      {...props}
      role={role ?? (variant === "danger" || variant === "warning" ? "alert" : variant === "success" ? "status" : undefined)}
      className={cn("flex items-center justify-between gap-4 rounded-md border px-4 py-3", variants[variant], className)}
    >
      <div className={cn("flex items-center gap-3 text-sm font-medium", variant === "neutral" && "text-foreground")}>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        {title}
      </div>
      {action}
    </div>
  );
}
