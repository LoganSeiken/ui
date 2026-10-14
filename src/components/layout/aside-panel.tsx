import type { ComponentProps, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Button } from "../ui/button.js";

export type AsidePanelProps = Omit<ComponentProps<"aside">, "title"> & {
  title: ReactNode;
  headerExtra?: ReactNode;
  onClose?: () => void;
};

export function AsidePanel({ title, headerExtra, onClose, className, children, ...props }: AsidePanelProps) {
  return (
    <aside
      {...props}
      className={cn("flex w-96 shrink-0 flex-col border-l border-border bg-surface", className)}
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {headerExtra}
          {onClose ? (
            <Button variant="ghost" size="icon" aria-label="Close panel" onClick={onClose}>
              <X className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
}
