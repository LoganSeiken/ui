import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountMenu } from "./account-menu.js";
import { AccountMenuActionItem } from "./account-menu-action-item.js";

const meta = { title: "patterns/AccountMenuActionItem", component: AccountMenuActionItem, parameters: { layout: "centered" }, render: (args) => <div><AccountMenu email="owner@example.com" defaultOpen><AccountMenuActionItem {...args} /></AccountMenu><form id="story-action" action="#" /></div> } satisfies Meta<typeof AccountMenuActionItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { formId: "story-action", label: "Sign out" } };
export const Pending: Story = { args: { formId: "story-action", label: "Sign out", pending: true, pendingLabel: "Signing out…" } };
