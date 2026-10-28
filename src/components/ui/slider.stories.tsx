import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider.js";

const steps = [
  { value: 0, label: "Low" },
  { value: 50, label: "Medium" },
  { value: 100, label: "High" },
];
const meta = {
  title: "ui/Slider",
  component: Slider,
  args: { steps, "aria-label": "Priority", name: "priority" },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const High: Story = { args: { defaultValue: 100 } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 50 } };
