import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button.js";
import { ButtonGroup } from "./button-group.js";

const meta = { title: "patterns/ButtonGroup", component: ButtonGroup } satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup aria-label="Add">
      <Button size="sm">Add user</Button>
      <Button size="sm" aria-label="More add options" className="px-1.5"><ChevronDown className="size-3.5" aria-hidden="true" /></Button>
    </ButtonGroup>
  )
};
