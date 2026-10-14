import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export type ListItemProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  interactive?: boolean;
};

export function ListItem({ title, description, icon, trailing, interactive = false, className, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        interactive && "cursor-pointer transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle",
        className
      )}
    >
      {icon ? <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">{icon}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{title}</span>
        {description ? <span className="truncate text-sm text-muted-foreground">{description}</span> : null}
      </div>
      {trailing}
      {interactive ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
    </div>
  );
}
