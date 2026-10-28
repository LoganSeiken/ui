"use client";

import { useActionState, type ReactNode } from "react";
import { ActionFeedback } from "./action-feedback.js";
import { FocusOnInvalid } from "./focus-on-invalid.js";
import { FormActions, FormCard, type FormCardProps } from "./form-card.js";
import { SubmitButton } from "./submit-button.js";

export type ActionFormFieldErrors = Record<string, string[] | undefined>;
export type ActionFormValues = Record<string, string | string[] | undefined>;

/** The intentionally small state contract shared by application actions. */
export type ActionFormState = {
  status: "idle" | "error" | "success";
  message?: ReactNode;
  fieldErrors?: ActionFormFieldErrors;
  values?: ActionFormValues;
};

export type ActionFormAction<TState extends ActionFormState> = (
  previous: TState,
  formData: FormData,
) => TState | Promise<TState>;

export type ActionFormRenderContext<TState extends ActionFormState> = {
  state: TState;
  pending: boolean;
  values: TState["values"];
};

export type ActionFormProps<TState extends ActionFormState = ActionFormState> = Omit<
  FormCardProps,
  "action" | "children"
> & {
  action: ActionFormAction<TState>;
  initialState: TState;
  children: ReactNode | ((context: ActionFormRenderContext<TState>) => ReactNode);
  validate?: (formData: FormData) => ActionFormFieldErrors | Promise<ActionFormFieldErrors>;
  submitLabel: ReactNode | null;
  submitDisabled?: boolean;
  pendingText: ReactNode;
  pendingLabel: ReactNode;
  successTitle: ReactNode;
  errorTitle: ReactNode;
  /** Content placed before the default submit button, such as a cancel link. */
  footer?: ReactNode | ((context: ActionFormRenderContext<TState>) => ReactNode);
};

function valuesFromFormData(formData: FormData): ActionFormValues {
  const values: ActionFormValues = {};
  formData.forEach((value, name) => {
    if (typeof value !== "string") return;
    const previous = values[name];
    values[name] =
      previous === undefined
        ? value
        : Array.isArray(previous)
          ? [...previous, value]
          : [previous, value];
  });
  return values;
}

/**
 * Shared action-form shell. It knows about form state and accessibility only;
 * labels and business fields remain the responsibility of the consuming app.
 */
export function ActionForm<TState extends ActionFormState>({
  action,
  initialState,
  children,
  validate,
  submitLabel,
  submitDisabled = false,
  pendingText,
  pendingLabel,
  successTitle,
  errorTitle,
  footer,
  ...formProps
}: ActionFormProps<TState>) {
  const [state, formAction, pending] = useActionState<TState, FormData>(
    async (previous: Awaited<TState>, formData: FormData) => {
      const current = previous as TState;
      const fieldErrors = await validate?.(formData);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        return {
          ...current,
          status: "error",
          fieldErrors,
          values: valuesFromFormData(formData),
        } as TState;
      }
      return action(current, formData);
    },
    initialState as Awaited<TState>,
  );

  const context: ActionFormRenderContext<TState> = { state, pending, values: state.values };
  const renderedChildren = typeof children === "function" ? children(context) : children;
  const renderedFooter = typeof footer === "function" ? footer(context) : footer;

  return (
    <FormCard {...formProps} action={formAction}>
      <FocusOnInvalid when={state.status === "error" ? state : null} />
      {renderedChildren}
      <ActionFeedback
        status={pending ? "pending" : state.status}
        message={state.message}
        pendingLabel={pendingLabel}
        successTitle={successTitle}
        errorTitle={errorTitle}
      />
      {submitLabel !== null ? (
        <FormActions>
          {renderedFooter}
          <SubmitButton disabled={submitDisabled} pendingText={pendingText}>
            {submitLabel}
          </SubmitButton>
        </FormActions>
      ) : renderedFooter ? (
        <FormActions>{renderedFooter}</FormActions>
      ) : null}
    </FormCard>
  );
}
