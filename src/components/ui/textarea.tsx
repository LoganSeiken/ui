"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export type TextareaProps = ComponentProps<"textarea"> & { showCount?: boolean };
const textareaClass =
  "w-full min-h-20 resize-y rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

export function Textarea({
  className,
  showCount = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const [count, setCount] = useState(String(value ?? defaultValue ?? "").length);
  useEffect(() => {
    if (value !== undefined) setCount(String(value ?? "").length);
  }, [value]);
  const textarea = (
    <textarea
      {...props}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        setCount(event.currentTarget.value.length);
        onChange?.(event);
      }}
      className={cn(textareaClass, className)}
    />
  );
  return showCount && maxLength !== undefined ? (
    <div>
      {textarea}
      <p aria-live="polite" className="mt-1 text-right text-xs text-muted-foreground">
        {count} / {maxLength}
      </p>
    </div>
  ) : (
    textarea
  );
}
