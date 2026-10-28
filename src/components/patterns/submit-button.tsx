"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "../ui/button.js";

export type SubmitButtonProps = Omit<ButtonProps, "type"> & { pendingText?: ReactNode };
export function SubmitButton({ pendingText, children, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} type="submit" loading={pending} disabled={disabled || pending}>
      {pending && pendingText !== undefined ? pendingText : children}
    </Button>
  );
}
