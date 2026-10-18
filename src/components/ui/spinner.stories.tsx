import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner.js";
const meta = { title: "ui/Spinner", component: Spinner } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Large: Story = { args: { className: "size-6" } };
export const Labeled: Story = { args: { label: "Loading" } };
