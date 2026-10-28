import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export function TileGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border [&>*]:bg-surface",
        className,
      )}
    />
  );
}

export type ChartTileProps = Omit<ComponentProps<"div">, "title"> & {
  label: ReactNode;
  marker?: ReactNode;
  help?: ReactNode;
  summary?: ReactNode;
  interactive?: boolean;
};

export function ChartTile({
  label,
  marker,
  help,
  summary,
  interactive = false,
  className,
  children,
  ...props
}: ChartTileProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-3 p-4",
        interactive && "transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-caps text-muted-foreground">
          {marker}
          {label}
          {help}
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          {summary}
          {interactive ? (
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
