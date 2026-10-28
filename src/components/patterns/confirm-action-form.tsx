"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import { ActionFeedback } from "./action-feedback.js";
import { ConfirmDialog } from "./confirm-dialog.js";
import { toast } from "../ui/toast.js";

export type ConfirmActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type ConfirmAction = (
  previous: ConfirmActionState,
  formData: FormData,
) => ConfirmActionState | Promise<ConfirmActionState>;

export type ConfirmActionFormLabels = {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirm: string;
  cancel: string;
  close: string;
  pending: ReactNode;
  success: ReactNode;
  error: ReactNode;
};

export type ConfirmActionFormProps = {
  action: ConfirmAction;
  hiddenFields?: Record<string, string | number | boolean | null | undefined>;
  labels: ConfirmActionFormLabels;
  variant?: "default" | "destructive";
  feedback?: "inline" | "toast";
  initialState?: ConfirmActionState;
  formId?: string;
};

/** A confirmation dialog with its action form kept outside the dialog portal. */
export function ConfirmActionForm({
  action,
  hiddenFields = {},
  labels,
  variant = "default",
  feedback = "inline",
  initialState = { status: "idle" },
  formId: suppliedFormId,
}: ConfirmActionFormProps) {
  const generatedId = useId().replaceAll(":", "");
  const formId = suppliedFormId ?? `confirm-action-${generatedId}`;
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previous: ConfirmActionState, formData: FormData) => {
      const result = await action(previous, formData);
      if (result.status === "success") setOpen(false);
      if (feedback === "toast" && result.status !== "idle") {
        toast({
          title:
            result.message ?? String(result.status === "success" ? labels.success : labels.error),
          variant: result.status === "success" ? "success" : "danger",
        });
        return initialState;
      }
      return result;
    },
    initialState,
  );

  return (
    <>
      <ConfirmDialog
        trigger={labels.trigger}
        title={labels.title}
        description={labels.description}
        confirmLabel={labels.confirm}
        cancelLabel={labels.cancel}
        closeLabel={labels.close}
        variant={variant}
        confirmFormId={formId}
        pending={pending}
        open={open}
        onOpenChange={setOpen}
      />
      <form id={formId} action={formAction} hidden>
        {Object.entries(hiddenFields).map(([name, value]) =>
          value == null ? null : (
            <input key={name} type="hidden" name={name} value={String(value)} />
          ),
        )}
      </form>
      {feedback === "inline" ? (
        <ActionFeedback
          status={pending ? "pending" : state.status}
          message={state.message}
          pendingLabel={labels.pending}
          successTitle={labels.success}
          errorTitle={labels.error}
        />
      ) : null}
    </>
  );
}
