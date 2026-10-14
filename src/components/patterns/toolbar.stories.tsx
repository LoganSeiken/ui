import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "../ui/button.js";
import { Toolbar, ToolbarSpacer } from "./toolbar.js";

const meta = { title: "patterns/Toolbar", component: Toolbar } satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filters: Story = {
  render: () => (
    <Toolbar aria-label="Filters" className="w-[36rem]">
      <Button variant="dashed" size="sm">All columns<ChevronDown className="size-3.5" aria-hidden="true" /></Button>
      <Button variant="dashed" size="sm">Sorted by user ID</Button>
      <ToolbarSpacer />
      <Button variant="outline" size="icon" aria-label="Refresh" className="size-7"><RefreshCw className="size-3.5" aria-hidden="true" /></Button>
    </Toolbar>
  )
};
