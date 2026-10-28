import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, HelpCircle } from "lucide-react";
import { StatTile } from "./stat-tile.js";

const meta = {
  title: "patterns/StatTile",
  component: StatTile,
  args: { label: "Slow queries", value: "16" },
} satisfies Meta<typeof StatTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { className: "w-64" } };
export const Interactive: Story = {
  args: {
    interactive: true,
    help: <HelpCircle className="size-3.5" aria-hidden="true" />,
    className: "w-64",
  },
};
export const WithIcon: Story = {
  args: {
    label: "Status",
    value: "Healthy",
    icon: <Activity className="size-5" aria-hidden="true" />,
    className: "w-64",
  },
};
