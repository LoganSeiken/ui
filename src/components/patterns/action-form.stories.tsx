import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field } from "./field.js";
import { FormSection } from "./form-card.js";
import { ActionForm, type ActionFormState } from "./action-form.js";
import { Input } from "../ui/input.js";
import { CenteredPage } from "../layout/centered-page.js";

const initialState: ActionFormState = { status: "idle", values: { name: "" } };

const meta = {
  title: "patterns/ActionForm",
  component: ActionForm,
  parameters: { layout: "centered" },
  args: {
    initialState,
    action: async (_previous, formData) => ({
      status: "success" as const,
      message: `Saved ${String(formData.get("name") ?? "record")}`
    }),
    submitLabel: "Save",
    pendingText: "Saving…",
    children: ({ state }) => (
      <FormSection title="Profile">
        <Field label="Name" htmlFor="name" error={state.fieldErrors?.name?.[0]}>
          <Input id="name" name="name" defaultValue={String(state.values?.name ?? "")} aria-invalid={Boolean(state.fieldErrors?.name?.length)} />
        </Field>
      </FormSection>
    )
  }
} satisfies Meta<typeof ActionForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClientValidation: Story = {
  args: {
    validate: (formData) => String(formData.get("name") ?? "").trim() ? {} : { name: ["Name is required"] },
    action: async () => ({ status: "success" as const, message: "Validated" })
  }
};

export const WithFooterContent: Story = {
  render: () => <FooterStory />
};

export const InsideCenteredPage: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <CenteredPage>
      <ActionForm<ActionFormState>
        variant="plain"
        initialState={initialState}
        action={async () => ({ status: "success" as const, message: "Saved" })}
        submitLabel="Save"
        pendingText="Saving…"
      >
        {({ state }) => (
          <>
            <FormSection title="Profile">
              <Field label="Name" htmlFor="centered-name" error={state.fieldErrors?.name?.[0]}>
                <Input id="centered-name" name="name" defaultValue={String(state.values?.name ?? "")} />
              </Field>
            </FormSection>
          </>
        )}
      </ActionForm>
    </CenteredPage>
  )
};

function FooterStory() {
    const [saved, setSaved] = useState(false);
    return (
      <ActionForm
        initialState={initialState}
        submitLabel="Save"
        pendingText="Saving…"
        action={async (_previous, formData) => {
          const result = {
            status: "success" as const,
            message: `Saved ${String(formData.get("name") ?? "record")}`
          };
          setSaved(true);
          return result;
        }}
        children={({ state }) => (
          <FormSection title="Profile">
            <Field label="Name" htmlFor="name" error={state.fieldErrors?.name?.[0]}>
              <Input id="name" name="name" defaultValue={String(state.values?.name ?? "")} aria-invalid={Boolean(state.fieldErrors?.name?.length)} />
            </Field>
          </FormSection>
        )}
        footer={<span className="text-sm text-muted-foreground">{saved ? "Saved" : "Optional note"}</span>}
      />
    );
}
