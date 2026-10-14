import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code } from "./code.js";

const meta = { title: "ui/Code", component: Code, args: { children: "4347a66e" } } satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;

export const IdChip: Story = {};
