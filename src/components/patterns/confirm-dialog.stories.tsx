import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { ConfirmDialog } from "./confirm-dialog.js";

const meta = {
  title: "patterns/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  args: { open: true, trigger: <Button>Open confirmation</Button>, title: "Confirm action", description: "This action will take effect immediately." }
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Destructive: Story = { args: { variant: "destructive", confirmLabel: "Delete", title: "Delete this record?", description: "This cannot be undone." } };
export const Pending: Story = { args: { pending: true } };
export const ExternalForm: Story = { args: { confirmFormId: "external-form" } };
export const Closed: Story = { args: { open: false } };
