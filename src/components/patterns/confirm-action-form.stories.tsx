import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { ConfirmActionForm } from "./confirm-action-form.js";

const meta = {
  title: "patterns/ConfirmActionForm",
  component: ConfirmActionForm,
  parameters: { layout: "centered" },
  args: {
    action: async () => ({ status: "success" as const, message: "Action completed" }),
    labels: {
      trigger: <Button variant="destructive">Archive record</Button>,
      title: "Archive record?",
      description: "The record will leave active lists.",
      confirm: "Archive",
      cancel: "Cancel",
      close: "Close",
      pending: "Archiving…",
      success: "Archived",
      error: "Could not archive",
    },
  },
} satisfies Meta<typeof ConfirmActionForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InlineFeedback: Story = {};
export const ToastFeedback: Story = { args: { feedback: "toast" } };
export const MultipleActions: Story = {
  args: {
    labels: { ...meta.args.labels, trigger: <Button variant="outline">Restore or archive</Button> },
  },
};
