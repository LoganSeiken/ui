import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./kbd.js";

const meta = { title: "ui/Kbd", component: Kbd, args: { children: "⌘K" } } satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Shortcut: Story = {};
