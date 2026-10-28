import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

const meta = {
  title: "ui/Popover",
  component: Popover,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarControl: Story = {
  render: () => (
    <div className="flex h-56 p-6">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">Sidebar control</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="mb-2 text-xs text-muted-foreground">Sidebar control</p>
          <RadioGroup defaultValue="hover" aria-label="Sidebar control">
            {[
              ["expanded", "Expanded"],
              ["collapsed", "Collapsed"],
              ["hover", "Expand on hover"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <RadioGroupItem value={value ?? ""} /> {label}
              </label>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
