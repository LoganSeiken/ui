"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Input } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Spinner } from "./spinner.js";

export type ComboboxOption = { value: string; label: string; description?: string; disabled?: boolean };
export type ComboboxProps = { options: ComboboxOption[]; value?: string | null; defaultValue?: string | null; onValueChange?: (value: string | null) => void; placeholder?: string; searchPlaceholder?: string; emptyText?: string; clearLabel?: string; defaultOpen?: boolean; onQueryChange?: (query: string) => void; loading?: boolean; loadingLabel?: string; errorText?: string; "aria-describedby"?: string; disabled?: boolean; name?: string; id?: string; className?: string; "aria-invalid"?: boolean; "aria-label"?: string };
const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function Combobox({ options, value, defaultValue = null, onValueChange, placeholder = "Select an option", searchPlaceholder = "Search...", emptyText = "No results", clearLabel, onQueryChange, loading = false, loadingLabel = "Loading", errorText, defaultOpen = false, disabled = false, name, id, className, "aria-invalid": invalid, "aria-describedby": describedBy, "aria-label": ariaLabel }: ComboboxProps) {
  const generated = useId(); const triggerId = id ?? `${generated}-trigger`; const listId = `${generated}-list`;
  const [open, setOpen] = useState(defaultOpen); const [internalValue, setInternalValue] = useState<string | null>(defaultValue); const selected = value !== undefined ? value : internalValue;
  const [query, setQuery] = useState(""); const [active, setActive] = useState(0); const inputRef = useRef<HTMLInputElement>(null); const triggerRef = useRef<HTMLButtonElement>(null);
  const visible = useMemo(() => onQueryChange ? options : options.filter((option) => normalize(`${option.label} ${option.description ?? ""}`).includes(normalize(query))), [options, query, onQueryChange]);
  const offset = clearLabel ? 1 : 0;
  const enabled = [...(clearLabel ? [0] : []), ...visible.map((o, i) => !o.disabled ? i + offset : -1).filter((i) => i >= 0)];
  const selectedLabel = options.find((o) => o.value === selected)?.label;
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  const changeQuery = (next: string) => { setQuery(next); setActive(0); onQueryChange?.(next); };
  const close = () => { setOpen(false); setQuery(""); triggerRef.current?.focus(); };
  const choose = (next: string | null) => { if (value === undefined) setInternalValue(next); onValueChange?.(next); close(); };
  const move = (direction: "first" | "last" | "next" | "previous") => {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    const next = direction === "first" ? enabled[0] : direction === "last" ? enabled.at(-1)! : direction === "next" ? enabled[(pos + 1 + enabled.length) % enabled.length] : enabled[(pos - 1 + enabled.length) % enabled.length];
    setActive(next);
  };
  return <>
    {name ? <input type="hidden" name={name} value={selected ?? ""} /> : null}
    <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery(""); }}><PopoverTrigger asChild>
      <button ref={triggerRef} id={triggerId} type="button" role="combobox" aria-label={ariaLabel} aria-describedby={describedBy} aria-expanded={open} aria-haspopup="listbox" aria-controls={listId} aria-invalid={invalid || undefined} disabled={disabled} onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); else move("next"); } if (e.key === "ArrowUp" && open) { e.preventDefault(); move("previous"); } }} className={cn("flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-surface px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive", className)}>
        <span className={cn(!selectedLabel && "text-muted-foreground")}>{selectedLabel ?? placeholder}</span><ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>
    </PopoverTrigger><PopoverContent className="w-(--radix-popover-trigger-width) p-0" onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus(); }} onEscapeKeyDown={() => close()}>
      <div className="p-2"><Input ref={inputRef} size="md" className="rounded-none border-0 border-b border-border focus-visible:ring-0" value={query} placeholder={searchPlaceholder} aria-label={searchPlaceholder} onChange={(e) => changeQuery(e.currentTarget.value)} aria-controls={listId} aria-activedescendant={open ? active === 0 && clearLabel ? `${generated}-clear` : visible[active - offset] ? `${generated}-option-${active - offset}` : undefined : undefined} onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); move("next"); } else if (e.key === "ArrowUp") { e.preventDefault(); move("previous"); } else if (e.key === "Home") { e.preventDefault(); move("first"); } else if (e.key === "End") { e.preventDefault(); move("last"); } else if (e.key === "Enter") { e.preventDefault(); if (clearLabel && active === 0) choose(null); else { const option = visible[active - offset]; if (option && !option.disabled) choose(option.value); } } else if (e.key === "Escape") close(); else if (e.key === "Tab") setOpen(false); }} /></div>
      <ul id={listId} role="listbox" aria-labelledby={triggerId} className="max-h-60 overflow-auto">
        {clearLabel ? <li role="option" aria-selected={selected === null} id={`${generated}-clear`} onMouseMove={() => setActive(0)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(null)} className={cn("flex cursor-pointer flex-col gap-0.5 px-3 py-2 text-sm", active === 0 && "bg-muted")}>{clearLabel}</li> : null}
        {errorText ? <li role="presentation" className="px-3 py-2 text-sm text-destructive-subtle-foreground"><span role="alert">{errorText}</span></li> : null}
        {loading ? <li className="flex items-center gap-2 px-3 py-2"><Spinner label={loadingLabel} /></li> : visible.length ? visible.map((option, index) => <li key={option.value} id={`${generated}-option-${index}`} role="option" aria-selected={selected === option.value} aria-disabled={option.disabled || undefined} onMouseMove={() => setActive(index + offset)} onMouseDown={(e) => e.preventDefault()} onClick={() => !option.disabled && choose(option.value)} className={cn("flex cursor-pointer flex-col gap-0.5 px-3 py-2 text-sm", active === index + offset && "bg-muted", option.disabled && "opacity-50 cursor-not-allowed")}>
          <span className="flex items-center justify-between">{option.label}{selected === option.value ? <Check className="size-4" aria-hidden="true" /> : null}</span>{option.description ? <span className="text-xs text-muted-foreground">{option.description}</span> : null}
        </li>) : <li className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</li>}
      </ul>
    </PopoverContent></Popover>
  </>;
}
