import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";
import { Card } from "./card.js";

export type TableCardProps = ComponentProps<"div">;

export function TableCard({ className, children, ...props }: TableCardProps) {
  return (
    <Card {...props} className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}
