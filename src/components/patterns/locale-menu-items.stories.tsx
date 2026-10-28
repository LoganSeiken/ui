import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu.js";
import { LocaleMenuItems } from "./locale-menu-items.js";

const options = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];
const meta = {
  title: "patterns/LocaleMenuItems",
  component: LocaleMenuItems,
  parameters: { layout: "centered" },
  render: (args) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger className="rounded-md border px-3 py-2">Language</DropdownMenuTrigger>
      <DropdownMenuContent>
        <LocaleMenuItems {...args} />
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof LocaleMenuItems>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { options, value: "en", onSelect: () => undefined } };
export const Pending: Story = {
  args: { options, value: "es", pending: true, onSelect: () => undefined },
};
