import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const tableVariants = cva("w-full border-collapse text-sm", {
  variants: {
    variant: {
      default: "",
      grid: "[&_td]:border-r [&_th]:border-r [&_td]:border-border-subtle [&_th]:border-border-subtle [&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Table({
  variant,
  className,
  ...props
}: ComponentProps<"table"> & VariantProps<typeof tableVariants>) {
  return (
    <div className="w-full overflow-x-auto">
      <table {...props} className={cn(tableVariants({ variant }), className)} />
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
      className={cn(
        "border-b border-border-subtle transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle",
        className,
      )}
    />
  );
}

const tableHeadVariants = cva("px-4 text-left font-normal text-muted-foreground", {
  variants: {
    variant: {
      caps: "h-10 text-xs uppercase tracking-caps",
      plain: "h-9 text-sm",
    },
  },
  defaultVariants: { variant: "caps" },
});

export function TableHead({
  variant,
  className,
  ...props
}: ComponentProps<"th"> & VariantProps<typeof tableHeadVariants>) {
  return <th {...props} className={cn(tableHeadVariants({ variant }), className)} />;
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td {...props} className={cn("px-4 py-3 align-middle text-foreground", className)} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      {...props}
      className={cn(
        "border-t border-border bg-surface-subtle text-xs text-muted-foreground",
        className,
      )}
    />
  );
}
