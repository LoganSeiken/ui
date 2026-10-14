import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table {...props} className={cn("w-full border-collapse text-sm", className)} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead {...props} className={cn("border-b border-border bg-surface-subtle", className)} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody {...props} className={cn(className)} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      {...props}
      className={cn("border-b border-border-subtle transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle", className)}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className={cn(
        "h-10 px-4 text-left font-mono text-xs font-normal uppercase tracking-caps text-muted-foreground",
        className
      )}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td {...props} className={cn("px-4 py-3 align-middle text-foreground", className)} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      {...props}
      className={cn("border-t border-border bg-surface-subtle text-xs text-muted-foreground", className)}
    />
  );
}
