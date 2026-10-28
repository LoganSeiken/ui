import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkButton } from "./link-button.js";

const meta = {
  title: "ui/LinkButton",
  component: LinkButton,
  args: { href: "#destination", children: "Open settings" },
} satisfies Meta<typeof LinkButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Disabled: Story = { args: { disabled: true } };
