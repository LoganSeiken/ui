import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "./text-link.js";

const meta = { title: "ui/TextLink", component: TextLink, args: { href: "#destination", children: "Read more" } } satisfies Meta<typeof TextLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = { args: { variant: "muted" } };
