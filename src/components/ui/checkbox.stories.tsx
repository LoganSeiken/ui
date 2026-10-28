import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox.js";

const meta = {
  title: "ui/Checkbox",
  component: Checkbox,
  args: { "aria-label": "Select" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" checked="indeterminate" />
      <Checkbox aria-label="Disabled" disabled />
    </div>
  ),
};
