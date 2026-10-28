import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.js";

const meta = { title: "patterns/InputGroup", component: InputGroup } satisfies Meta<
  typeof InputGroup
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAddon: Story = {
  render: () => (
    <InputGroup className="w-96">
      <InputGroupAddon>
        <Search className="size-3.5" aria-hidden="true" />
        Email address
      </InputGroupAddon>
      <InputGroupInput aria-label="Search by email" placeholder="Search by email" />
    </InputGroup>
  ),
};
