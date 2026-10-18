import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field.js";
import { FocusOnInvalid } from "./focus-on-invalid.js";
import { Input } from "../ui/input.js";

const meta = { title: "patterns/FocusOnInvalid", component: FocusOnInvalid, args: { when: true } } satisfies Meta<typeof FocusOnInvalid>;
export default meta;
type Story = StoryObj<typeof meta>;

// Muestra el efecto: al activarse, el foco va al primer campo con aria-invalid.
export const Default: Story = {
  render: (args) => (
    <form className="grid max-w-sm gap-4 p-6" noValidate>
      <FocusOnInvalid when={args.when} />
      <Field label="Name" htmlFor="name">
        <Input id="name" defaultValue="Ada" />
      </Field>
      <Field label="Email" htmlFor="email" error="Enter a valid email address.">
        <Input id="email" defaultValue="not-an-email" aria-invalid />
      </Field>
    </form>
  )
};
