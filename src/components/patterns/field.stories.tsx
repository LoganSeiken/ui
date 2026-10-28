import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { Field } from "./field.js";

const meta = {
  title: "patterns/Field",
  component: Field,
  args: { label: "Search name", htmlFor: "f", children: null },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <Field {...args} className="w-80">
      <Input id="f" placeholder="Organization name…" />
    </Field>
  ),
};
export const WithError: Story = {
  render: (args) => (
    <Field {...args} label="Name" error="This field is required." className="w-80">
      <Input id="f" aria-invalid defaultValue="value" />
    </Field>
  ),
};
export const Horizontal: Story = {
  render: (args) => (
    <Field
      {...args}
      label="Client"
      orientation="horizontal"
      description="Choose the MCP client you are using."
      className="w-[34rem]"
    >
      <Select defaultValue="cc">
        <SelectTrigger id="f">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cc">Claude Code</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};
