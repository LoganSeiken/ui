import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpCircle } from "lucide-react";
import { Button } from "./button.js";

const meta = { title: "ui/Button", component: Button, args: { children: "Button" } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="dashed">Dashed</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small 24</Button>
      <Button size="md">Medium 32</Button>
      <Button size="lg">Large 40</Button>
      <Button size="icon" variant="outline" aria-label="Help"><HelpCircle className="size-4" aria-hidden="true" /></Button>
    </div>
  )
};
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button variant="ghost" size="icon" aria-label="Toggle" aria-pressed className="rounded-pill"><HelpCircle className="size-4" aria-hidden="true" /></Button>
    </div>
  )
};
