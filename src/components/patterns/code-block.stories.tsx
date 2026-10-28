import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block.js";

const meta = { title: "patterns/CodeBlock", component: CodeBlock } satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    code: "npm install prisma --save-dev",
    className: "w-96",
    tablistLabel: "Code variants",
    copyLabel: "Copy code",
    copiedLabel: "Copied",
  },
};
export const WithTabs: Story = {
  args: {
    tablistLabel: "Code variants",
    copyLabel: "Copy code",
    copiedLabel: "Copied",
    className: "w-96",
    tabs: [
      { label: "npm", code: "npm install @loganseiken/ui" },
      { label: "pnpm", code: "pnpm add @loganseiken/ui" },
      { label: "bun", code: "bun add @loganseiken/ui" },
    ],
  },
};
