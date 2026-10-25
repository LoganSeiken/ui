"use client";

import type { ReactNode } from "react";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../ui/dropdown-menu.js";

export type LocaleMenuOption = { value: string; label: ReactNode };

export type LocaleMenuItemsProps = {
  options: LocaleMenuOption[];
  value: string;
  onSelect: (value: string) => void;
  pending?: boolean;
};

/** Framework-neutral locale choices for a DropdownMenu radio group. */
export function LocaleMenuItems({ options, value, onSelect, pending = false }: LocaleMenuItemsProps) {
  return (
    <DropdownMenuRadioGroup value={value} onValueChange={onSelect} aria-busy={pending || undefined}>
      {options.map((option) => (
        <DropdownMenuRadioItem key={option.value} value={option.value} disabled={pending} aria-label={typeof option.label === "string" ? option.label : undefined}>
          {option.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
