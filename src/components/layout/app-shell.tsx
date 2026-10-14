import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type AppShellProps = Omit<ComponentProps<"div">, "children"> & {
  topBar: ReactNode;
  sidebar?: ReactNode;
  subNav?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

export function AppShell({ topBar, sidebar, subNav, aside, className, children, ...props }: AppShellProps) {
  return (
    <div {...props} className={cn("flex h-screen flex-col bg-background text-foreground", className)}>
      {topBar}
      <div className="flex min-h-0 flex-1">
        {sidebar}
        {subNav}
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        {aside}
      </div>
    </div>
  );
}
