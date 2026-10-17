import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton.js";
const meta = { title: "ui/Skeleton", component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Line: Story = { args: { className: "h-4 w-48" } };
export const Block: Story = { args: { className: "h-24 w-48" } };
export const Avatar: Story = { args: { className: "size-10 rounded-full" } };
