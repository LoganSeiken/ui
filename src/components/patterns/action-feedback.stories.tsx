import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionFeedback } from "./action-feedback.js";

const meta = {
  title: "patterns/ActionFeedback",
  component: ActionFeedback,
  decorators: [
    (Story) => (
      <div className="min-h-8">
        <Story />
      </div>
    ),
  ],
  args: {
    status: "success",
    message: "Your changes were saved.",
    pendingLabel: "Working…",
    successTitle: "Success",
    errorTitle: "Something went wrong",
  },
} satisfies Meta<typeof ActionFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};
export const Pending: Story = {
  args: { status: "pending", pendingLabel: "Saving…", message: "Please keep this page open." },
};
export const Error: Story = {
  args: {
    status: "error",
    message: "Try again or contact an administrator.",
    pendingLabel: "Working…",
    successTitle: "Success",
    errorTitle: "Something went wrong",
  },
};
export const Idle: Story = {
  args: {
    status: "idle",
    pendingLabel: "Working…",
    successTitle: "Success",
    errorTitle: "Something went wrong",
  },
};
