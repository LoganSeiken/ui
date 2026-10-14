import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn.js";

export function Steps({ className, ...props }: ComponentProps<"ol">) {
  return <ol {...props} className={cn("flex flex-col", className)} />;
}

export type StepProps = Omit<ComponentProps<"li">, "title"> & {
  number: number;
  title: ReactNode;
  description?: ReactNode;
};

export function Step({ number, title, description, className, children, ...props }: StepProps) {
  return (
    <li {...props} className={cn("relative flex gap-4 pb-8 last:pb-0", className)}>
      <span
        aria-hidden="true"
        className="absolute top-8 bottom-0 left-3.5 w-px bg-border in-[li:last-child]:hidden"
      />
      <span className="z-10 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-xs text-muted-foreground">
        {number}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {children}
      </div>
    </li>
  );
}
