import type { ComponentProps } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { TableHead } from "../ui/table.js";

export type SortDirection = "asc" | "desc" | false;

export type SortableHeadProps = ComponentProps<"th"> & {
  sorted?: SortDirection;
  onSort?: () => void;
};

const ariaSort = { asc: "ascending", desc: "descending" } as const;

export function SortableHead({
  sorted = false,
  onSort,
  className,
  children,
  ...props
}: SortableHeadProps) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <TableHead
      {...props}
      aria-sort={sorted ? ariaSort[sorted] : "none"}
      className={cn("p-0", className)}
    >
      <button
        type="button"
        onClick={onSort}
        className="flex h-10 w-full items-center gap-1 px-4 text-left uppercase tracking-caps hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
        <Icon
          className={cn("size-3", sorted ? "text-foreground" : "text-muted-foreground")}
          aria-hidden="true"
        />
      </button>
    </TableHead>
  );
}
