import type { ComponentProps, ReactNode } from "react";
import { Badge } from "../ui/badge.js";
import { cn } from "../../utils/cn.js";

export type MessageBubbleProps = Omit<ComponentProps<"article">, "children"> & {
  direction: "inbound" | "outbound";
  body: ReactNode;
  author: ReactNode;
  timestamp?: ReactNode;
  deliveryStatus?: ReactNode;
};

export function MessageBubble({
  direction,
  body,
  author,
  timestamp,
  deliveryStatus,
  className,
  ...props
}: MessageBubbleProps) {
  const outbound = direction === "outbound";
  return (
    <article
      {...props}
      className={cn("flex", outbound ? "justify-end" : "justify-start", className)}
    >
      <div
        className={cn(
          "max-w-[min(32rem,85%)] rounded-lg border px-3 py-2",
          outbound ? "border-primary/20 bg-primary/10" : "border-border bg-surface",
        )}
      >
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{author}</span>
          {timestamp ? <span>{timestamp}</span> : null}
          {deliveryStatus ? <Badge variant="outline">{deliveryStatus}</Badge> : null}
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">{body}</p>
      </div>
    </article>
  );
}

export type SystemEventRowProps = ComponentProps<"div"> & { timestamp?: ReactNode };

export function SystemEventRow({ timestamp, children, className, ...props }: SystemEventRowProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span>{children}</span>
      {timestamp ? <span>{timestamp}</span> : null}
    </div>
  );
}

export type MessageThreadProps = ComponentProps<"div"> & { ariaLabel: string };

export function MessageThread({ ariaLabel, className, children, ...props }: MessageThreadProps) {
  return (
    <div
      {...props}
      role="log"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn("grid gap-3", className)}
    >
      {children}
    </div>
  );
}
