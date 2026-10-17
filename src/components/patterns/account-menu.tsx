"use client";

import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu.js";

export type AccountMenuProps = {
  email: string;
  name?: string;
  label?: string;
  defaultOpen?: boolean;
  children?: ReactNode;
};

export function AccountMenu({ email, name, label = "Account menu", defaultOpen = false, children }: AccountMenuProps) {
  const initial = (name || email).charAt(0).toUpperCase();

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="rounded-pill focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar><AvatarFallback>{initial}</AvatarFallback></Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {name ? <span className="block font-medium text-foreground">{name}</span> : null}
          <span className="block text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
