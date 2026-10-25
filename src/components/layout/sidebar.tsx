import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type SidebarMode = "expanded" | "collapsed" | "hover";

export type SidebarProps = ComponentProps<"nav"> & { mode?: SidebarMode };

export function Sidebar({ mode = "expanded", className, ...props }: SidebarProps) {
  return (
    <nav
      aria-label="Primary"
      data-mode={mode}
      {...props}
      className={cn(
        "group/sidebar flex shrink-0 flex-col gap-0.5 overflow-hidden border-r border-border bg-surface p-2 transition-[width] duration-(--ui-duration-fast)",
        mode === "expanded" && "w-52",
        mode === "collapsed" && "w-14",
        mode === "hover" && "w-14 hover:w-52",
        className
      )}
    />
  );
}

export function SidebarSeparator({ className, ...props }: ComponentProps<"hr">) {
  return <hr {...props} className={cn("my-2 border-border", className)} />;
}

export type SidebarItemProps = ComponentProps<"a"> & {
  icon: ReactNode;
  active?: boolean;
  /** Router link (for example next/link) for client-side navigation; defaults to a plain anchor. */
  linkComponent?: ElementType;
};

export function SidebarItem({ icon, active = false, linkComponent: Link = "a", className, children, ...props }: SidebarItemProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      {...props}
      className={cn(
        "flex h-8 items-center gap-3 rounded-md px-2.5 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-muted font-medium text-foreground",
        className
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate group-data-[mode=collapsed]/sidebar:sr-only group-data-[mode=hover]/sidebar:opacity-0 group-data-[mode=hover]/sidebar:group-hover/sidebar:opacity-100">
        {children}
      </span>
    </Link>
  );
}

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  match?: "exact" | "prefix";
};

export type SidebarNavProps = {
  items: SidebarNavItem[];
  pathname: string;
  linkComponent?: ElementType;
  ariaLabel?: string;
  className?: string;
};

/** Responsive navigation built from the shared Sidebar primitives. */
export function SidebarNav({ items, pathname, linkComponent, ariaLabel = "Primary", className }: SidebarNavProps) {
  const renderItems = () => items.map((item) => {
    const active = item.match === "exact"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href.replace(/\/$/, "")}/`);
    return (
      <SidebarItem key={item.href} href={item.href} icon={item.icon} active={active} linkComponent={linkComponent} aria-label={item.label}>
        {item.label}
      </SidebarItem>
    );
  });

  return (
    <>
      <Sidebar aria-label={ariaLabel} className={cn("hidden md:flex", className)}>{renderItems()}</Sidebar>
      <Sidebar aria-label={ariaLabel} mode="collapsed" className={cn("flex md:hidden", className)}>{renderItems()}</Sidebar>
    </>
  );
}
