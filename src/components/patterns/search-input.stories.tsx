import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "../ui/kbd.js";
import { SearchInput } from "./search-input.js";

const meta = { title: "patterns/SearchInput", component: SearchInput, args: { "aria-label": "Search", placeholder: "Search…", className: "w-80" } } satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithShortcut: Story = { args: { trailing: <Kbd>⌘K</Kbd> } };
