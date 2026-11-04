import type { ReactNode } from "react";
import { cn } from "../../utils/cn.js";
import { Card } from "../patterns/card.js";

export type AuthSplitLayoutProps = {
  brand: ReactNode;
  children: ReactNode;
  corner?: ReactNode;
  className?: string;
};

export function AuthSplitLayout({ brand, children, corner, className }: AuthSplitLayoutProps) {
  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center bg-muted font-[var(--ui-font-sans)] md:p-8",
        className,
      )}
    >
      <Card className="grid min-h-screen w-full grid-cols-1 overflow-hidden rounded-none border-0 bg-background shadow-none md:min-h-[min(42rem,calc(100vh-4rem))] md:max-w-6xl md:grid-cols-2 md:rounded-lg md:border md:shadow-md">
        <div className="flex flex-col justify-center bg-primary px-6 py-8 text-primary-foreground sm:px-10 md:px-10 lg:px-14 lg:py-12">
          {brand}
        </div>
        <div className="relative flex min-h-[30rem] items-center justify-center px-6 py-14 sm:px-10 md:min-h-0 md:px-12 lg:px-16">
          {corner ? <div className="absolute right-4 top-4 z-10">{corner}</div> : null}
          <div className="w-full max-w-md">{children}</div>
        </div>
      </Card>
    </main>
  );
}
