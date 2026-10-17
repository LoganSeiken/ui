import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenuItem } from "../ui/dropdown-menu.js";
import { AccountMenu } from "./account-menu.js";

const meta = { title: "patterns/AccountMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithName: Story = {
  render: () => <div className="flex h-20 items-center justify-end border-b border-border bg-surface px-4"><AccountMenu name="Alex Morgan" email="alex@example.com" /></div>
};

export const WithoutName: Story = {
  render: () => <div className="flex h-20 items-center justify-end border-b border-border bg-surface px-4"><AccountMenu email="alex@example.com" /></div>
};

export const WithItems: Story = {
  render: () => (
    <div className="flex h-20 items-center justify-end border-b border-border bg-surface px-4">
      <AccountMenu name="Alex Morgan" email="alex@example.com">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </AccountMenu>
    </div>
  )
};

export const Open: Story = {
  render: () => <div className="flex h-20 items-center justify-end border-b border-border bg-surface px-4"><AccountMenu defaultOpen name="Alex Morgan" email="alex@example.com"><DropdownMenuItem>Profile</DropdownMenuItem></AccountMenu></div>,
};
