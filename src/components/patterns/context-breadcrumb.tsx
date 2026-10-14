import type { ComponentProps, ReactNode } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "../../utils/cn.js";

export type ContextBreadcrumbItem = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  switchLabel?: string;
  onSwitch?: () => void;
};

export type ContextBreadcrumbProps = Omit<ComponentProps<"nav">, "children"> & {
  items: ContextBreadcrumbItem[];
  action?: ReactNode;
};

export function ContextBreadcrumb({ items, action, className, ...props }: ContextBreadcrumbProps) {
  return (
    <nav aria-label="Context" {...props} className={cn("flex items-center gap-2 text-sm", className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-border">/</span> : null}
            {item.icon ? <span className="text-muted-foreground">{item.icon}</span> : null}
            <span className="font-medium text-foreground">{item.label}</span>
            {item.badge}
            {item.onSwitch ? (
              <button
                type="button"
                aria-label={item.switchLabel ?? "Switch"}
                onClick={item.onSwitch}
                className="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronsUpDown className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </li>
        ))}
      </ol>
      {action}
    </nav>
  );
}
