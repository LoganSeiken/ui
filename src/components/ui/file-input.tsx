"use client";

import { forwardRef, useState, type ComponentProps, type ReactNode } from "react";
import { buttonVariants } from "./button.js";
import { cn } from "../../utils/cn.js";

export type FileInputProps = Omit<ComponentProps<"input">, "type" | "value"> & {
  chooseLabel: string;
  noFileLabel: string;
  help?: ReactNode;
  inputClassName?: string;
};

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { chooseLabel, noFileLabel, help, inputClassName, className, id, onChange, ...props },
  ref
) {
  const [files, setFiles] = useState<FileList | null>(null);
  const fileNames = files ? Array.from(files, (file) => file.name).join(", ") : noFileLabel;
  const helpId = id && help ? `${id}-help` : undefined;
  const describedBy = [props["aria-describedby"], helpId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="flex min-w-0 items-center gap-3 rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground">
        <span className={buttonVariants({ variant: "outline", size: "sm" })}>{chooseLabel}</span>
        <span className="min-w-0 truncate text-muted-foreground" aria-live="polite">{fileNames}</span>
      </label>
      <input
        {...props}
        ref={ref}
        id={id}
        type="file"
        aria-describedby={describedBy}
        className={cn("sr-only", inputClassName)}
        onChange={(event) => {
          setFiles(event.currentTarget.files);
          onChange?.(event);
        }}
      />
      {help ? <p id={helpId} className="text-sm text-muted-foreground">{help}</p> : null}
    </div>
  );
});
