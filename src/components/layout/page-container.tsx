import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("mx-auto w-full max-w-6xl px-6 py-8", className)} />;
}
