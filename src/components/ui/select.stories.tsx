import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

const meta = { title: "ui/Select", component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="archived">Archived</SelectItem>
  </SelectContent>
);

export const Default: Story = {
  render: () => (
    <Select defaultValue="all">
      <SelectTrigger aria-label="Status" className="w-64">
        <SelectValue />
      </SelectTrigger>
      {items}
    </Select>
  ),
};
export const Compact: Story = {
  render: () => (
    <Select defaultValue="all">
      <SelectTrigger size="sm" aria-label="Time range" className="w-40">
        <SelectValue />
      </SelectTrigger>
      {items}
    </Select>
  ),
};
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger aria-label="Feature groups" className="w-64">
        <SelectValue placeholder="All features enabled" />
      </SelectTrigger>
      {items}
    </Select>
  ),
};
