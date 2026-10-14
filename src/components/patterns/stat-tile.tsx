import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export type StatTileProps = Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  help?: ReactNode;
  interactive?: boolean;
};

export function StatTile({ label, value, icon, help, interactive = false, className, ...props }: StatTileProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-start gap-3 rounded-md border border-border bg-surface px-4 py-3.5 shadow-sm",
        interactive && "cursor-pointer transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle",
        className
      )}
    >
      {icon ? <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground">{icon}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-caps text-muted-foreground">
          {label}
          {help}
        </div>
        <div className="text-xl font-medium text-foreground">{value}</div>
      </div>
      {interactive ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
    </div>
  );
}
