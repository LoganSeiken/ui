import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input.js";

const meta = { title: "ui/Input", component: Input, args: { placeholder: "Organization name…", "aria-label": "Name" } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "value" } };
export const Disabled: Story = { args: { disabled: true } };
