import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export type AppShellProps = Omit<ComponentProps<"div">, "children"> & {
  topBar: ReactNode;
  sidebar?: ReactNode;
  subNav?: ReactNode;
  aside?: ReactNode;
  /** Render the content area as a `main` landmark. Set to false when embedding the shell inside a page that already has one. */
  main?: boolean;
  children: ReactNode;
};

export function AppShell({ topBar, sidebar, subNav, aside, main = true, className, children, ...props }: AppShellProps) {
  const Content = main ? "main" : "div";
  return (
    <div {...props} className={cn("flex h-screen flex-col bg-background text-foreground", className)}>
      {topBar}
      <div className="flex min-h-0 flex-1">
        {sidebar}
        {subNav}
        <Content className="min-w-0 flex-1 overflow-y-auto">{children}</Content>
        {aside}
      </div>
    </div>
  );
}
