import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge.js";

const meta = { title: "ui/Badge", component: Badge, args: { children: "Badge" } } satisfies Meta<
  typeof Badge
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Neutral</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">PRODUCTION</Badge>
      <Badge variant="danger">CRITICAL</Badge>
      <Badge variant="outline">FREE</Badge>
      <Badge variant="success-outline" shape="square" className="font-mono uppercase">
        New
      </Badge>
    </div>
  ),
};
export const Square: Story = { args: { shape: "square", variant: "outline", children: "NANO" } };
