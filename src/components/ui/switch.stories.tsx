import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch.js";

const meta = {
  title: "ui/Switch",
  component: Switch,
  args: { "aria-label": "Read-only" },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
