import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export function SubNav({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Section"
      {...props}
      className={cn("flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-surface p-4", className)}
    />
  );
}

export function SubNavTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 {...props} className={cn("px-2 text-xl font-medium text-foreground", className)} />;
}

export type SubNavSectionProps = Omit<ComponentProps<"div">, "title"> & { title?: ReactNode };

export function SubNavSection({ title, className, children, ...props }: SubNavSectionProps) {
  return (
    <div {...props} className={cn("flex flex-col gap-0.5", className)}>
      {title ? <p className="px-2 pb-1 font-mono text-xs uppercase tracking-caps text-muted-foreground">{title}</p> : null}
      {children}
    </div>
  );
}

export function SubNavItem({ active = false, linkComponent: Link = "a", className, ...props }: ComponentProps<"a"> & { active?: boolean; linkComponent?: ElementType }) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      {...props}
      className={cn(
        "flex h-8 items-center rounded-md px-2 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-muted font-medium text-foreground",
        className
      )}
    />
  );
}
