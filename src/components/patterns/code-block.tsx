"use client";

import { useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Button } from "../ui/button.js";

export type CodeBlockProps = Omit<ComponentProps<"div">, "children"> & {
  code: string;
};

export function CodeBlock({ code, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div {...props} className={cn("relative rounded-md border border-border bg-surface", className)}>
      <pre className="overflow-x-auto p-4 pr-14 font-mono text-sm text-foreground">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
        className="absolute top-2 right-2"
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </Button>
    </div>
  );
}
