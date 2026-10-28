import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "./avatar.js";

const meta = { title: "ui/Avatar", component: Avatar } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>CB</AvatarFallback>
    </Avatar>
  ),
};
export const Small: Story = {
  render: () => (
    <Avatar className="size-7">
      <AvatarFallback>D</AvatarFallback>
    </Avatar>
  ),
};
