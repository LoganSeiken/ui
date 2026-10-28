"use client";

import { useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Button } from "../ui/button.js";

export type CodeBlockTab = { label: string; code: string };

export type CodeBlockProps = Omit<ComponentProps<"div">, "children"> & {
  tablistLabel: string;
  copyLabel: string;
  copiedLabel: string;
} & ({ code: string; tabs?: undefined } | { tabs: CodeBlockTab[]; code?: undefined });

export function CodeBlock({
  code,
  tabs,
  tablistLabel,
  copyLabel,
  copiedLabel,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);
  const current = tabs ? (tabs[active] ?? tabs[0]) : undefined;
  const text = current ? current.code : (code ?? "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      {...props}
      className={cn("relative rounded-md border border-border bg-surface", className)}
    >
      {tabs ? (
        <div
          role="tablist"
          aria-label={tablistLabel}
          className="flex gap-4 border-b border-border px-4"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "-mb-px border-b-2 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                i === active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 pr-14 font-mono text-sm text-foreground">
        <code>{text}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        aria-label={copied ? copiedLabel : copyLabel}
        onClick={copy}
        className={cn("absolute right-2", tabs ? "top-1" : "top-2")}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
