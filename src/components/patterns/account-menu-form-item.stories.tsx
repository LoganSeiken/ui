import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountMenu } from "./account-menu.js";
import { AccountMenuFormItem } from "./account-menu-form-item.js";

const meta = {
  title: "patterns/AccountMenuFormItem",
  component: AccountMenuFormItem,
  parameters: { layout: "centered" },
  render: (args) => <AccountMenu email="owner@example.com" defaultOpen><AccountMenuFormItem {...args} /></AccountMenu>
} satisfies Meta<typeof AccountMenuFormItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { action: async () => undefined, label: "Sign out", pendingLabel: "Signing out…" } };
