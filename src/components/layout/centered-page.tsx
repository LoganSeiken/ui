import type { ReactNode } from "react";
import { cn } from "../../utils/cn.js";
import { Card } from "../patterns/card.js";

export type CenteredPageProps = {
  children: ReactNode;
  corner?: ReactNode;
  className?: string;
};

/** Full-screen shell for focused, unauthenticated and error pages. */
export function CenteredPage({ children, corner, className }: CenteredPageProps) {
  return (
    <main className={cn("relative flex min-h-screen items-center justify-center bg-background px-4 py-10", className)}>
      {corner ? <div className="absolute right-4 top-4">{corner}</div> : null}
      <Card className="w-full max-w-md">{children}</Card>
    </main>
  );
}
