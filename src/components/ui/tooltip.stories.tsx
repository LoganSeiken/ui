import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpCircle } from "lucide-react";
import { Button } from "./button.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

const meta = { title: "ui/Tooltip", component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex h-24 items-end p-4">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="What is this"><HelpCircle className="size-4" aria-hidden="true" /></Button></TooltipTrigger>
          <TooltipContent side="top">Helpful contextual text</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
};
