import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubmitButton } from "./submit-button.js";
const meta = { title: "patterns/SubmitButton", component: SubmitButton } satisfies Meta<
  typeof SubmitButton
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "Save" } };
export const PendingText: Story = { args: { children: "Save", pendingText: "Saving..." } };
