"use client";

import { useActionState, useId } from "react";
import type { ComponentProps } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu.js";

export type AccountMenuFormAction = (formData: FormData) => unknown | Promise<unknown>;

export type AccountMenuFormItemProps = Omit<
  ComponentProps<typeof DropdownMenuItem>,
  "children" | "onSelect" | "disabled"
> & {
  action: AccountMenuFormAction;
  label: string;
  pendingLabel: string;
  disabled?: boolean;
};

/** Runs a server action from a menu item while keeping the Radix menu mounted during submission. */
export function AccountMenuFormItem({
  action,
  label,
  pendingLabel,
  disabled = false,
  ...props
}: AccountMenuFormItemProps) {
  const formId = useId();
  const [, formAction, pending] = useActionState(
    async (_previous: unknown, formData: FormData) => action(formData),
    null,
  );

  return (
    <>
      <form id={formId} action={formAction} hidden aria-hidden="true" />
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
    </>
  );
}
