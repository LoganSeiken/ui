import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

const meta = { title: "ui/ToggleGroup", component: ToggleGroup, args: { type: "single" } } satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const GridList: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="grid" aria-label="View">
      <ToggleGroupItem value="grid" aria-label="Grid"><LayoutGrid className="size-4" aria-hidden="true" /></ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List"><List className="size-4" aria-hidden="true" /></ToggleGroupItem>
    </ToggleGroup>
  )
};
