"use client";

import type { ComponentProps } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu.js";

export type AccountMenuActionItemProps = Omit<ComponentProps<typeof DropdownMenuItem>, "children" | "onSelect" | "disabled"> & {
  formId: string;
  pending?: boolean;
  label: string;
  pendingLabel?: string;
  disabled?: boolean;
};

/**
 * Bridges a menu item to a server form owned by the consuming application.
 * Keep the form outside the menu: Radix may unmount menu content after select.
 */
export function AccountMenuActionItem({ formId, pending = false, label, pendingLabel = "Working…", disabled = false, ...props }: AccountMenuActionItemProps) {
  return (
    <DropdownMenuItem
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      onSelect={(event) => {
        event.preventDefault();
        const form = document.getElementById(formId);
        if (form instanceof HTMLFormElement) form.requestSubmit();
      }}
    >
      {pending ? pendingLabel : label}
    </DropdownMenuItem>
  );
}
