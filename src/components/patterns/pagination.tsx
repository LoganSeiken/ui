import type { ElementType } from "react";
import { Button, buttonVariants } from "../ui/button.js";
import { cn } from "../../utils/cn.js";

export type PaginationProps = { page: number; pageCount: number; hrefFor?: (page: number) => string; onPageChange?: (page: number) => void; total?: number; pageSize?: number; labels?: { previous?: string; next?: string; summary?: (info: { page: number; pageCount: number; total?: number; from?: number; to?: number }) => string; nav?: string }; linkComponent?: ElementType };

export function Pagination({ page, pageCount, hrefFor, onPageChange, total, pageSize, labels = {}, linkComponent: Link = "a" }: PaginationProps) {
  if (pageCount <= 1) return null;
  const current = Math.min(pageCount, Math.max(1, page));
  const from = total !== undefined && pageSize ? Math.min(total, (current - 1) * pageSize + 1) : undefined;
  const to = total !== undefined && pageSize && from !== undefined ? Math.min(total, current * pageSize) : undefined;
  const summary = labels.summary?.({ page: current, pageCount, total, from, to }) ?? (total !== undefined && pageSize ? `${from ?? 0}-${to ?? 0} of ${total}` : `Page ${current} of ${pageCount}`);
  const control = (target: number, text: string, disabled: boolean) => disabled
    ? <span aria-disabled="true" className={cn(buttonVariants({ variant: "outline", size: "md" }), "opacity-50 pointer-events-none")}>{text}</span>
    : hrefFor ? <Link className={buttonVariants({ variant: "outline", size: "md" })} href={hrefFor(target)}>{text}</Link>
      : <Button variant="outline" size="md" onClick={() => onPageChange?.(target)}>{text}</Button>;
  return <nav aria-label={labels.nav ?? "Pagination"} className="flex items-center justify-between gap-4">
    {control(current - 1, labels.previous ?? "Previous", current <= 1)}<span aria-live="polite" className="text-sm text-muted-foreground">{summary}</span>{control(current + 1, labels.next ?? "Next", current >= pageCount)}
  </nav>;
}
