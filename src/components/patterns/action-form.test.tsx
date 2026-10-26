import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionForm, type ActionFormState } from "./action-form.js";
import { Field } from "./field.js";
import { FormSection } from "./form-card.js";
import { Input } from "../ui/input.js";

const initialState: ActionFormState = { status: "idle" };

function TestForm({ action = async () => ({ status: "success" as const, message: "Saved" }), validate }: {
  action?: (previous: ActionFormState, formData: FormData) => Promise<ActionFormState>;
  validate?: (formData: FormData) => Record<string, string[] | undefined>;
}) {
  return (
    <ActionForm initialState={initialState} action={action} validate={validate} submitLabel="Save">
      {({ state }) => (
        <FormSection>
          <Field label="Name" htmlFor="name" error={state.fieldErrors?.name?.[0]}>
            <Input id="name" name="name" aria-invalid={Boolean(state.fieldErrors?.name?.length)} defaultValue={String(state.values?.name ?? "")} />
          </Field>
        </FormSection>
      )}
    </ActionForm>
  );
}

describe("ActionForm", () => {
  it("runs client validation, focuses the first invalid field and preserves values", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ status: "success" as const }));
    render(<TestForm action={action} validate={(formData) => String(formData.get("name") ?? "") ? {} : { name: ["Required"] }} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Required")).toBeInTheDocument();
    const invalidInput = screen.getByLabelText("Name");
    expect(invalidInput).toHaveAttribute("aria-invalid", "true");
    expect(document.activeElement).toBe(invalidInput);
    expect(action).not.toHaveBeenCalled();
  });

  it("exposes pending state and renders action feedback", async () => {
    const user = userEvent.setup();
    let resolve!: (value: ActionFormState) => void;
    const action = vi.fn(() => new Promise<ActionFormState>((done) => { resolve = done; }));
    render(<TestForm action={action} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("button", { name: "Working…" })).toBeDisabled();
    resolve({ status: "success", message: "Saved" });
    expect(await screen.findByRole("status")).toHaveTextContent("Saved");
  });
});
