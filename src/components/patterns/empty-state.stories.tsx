import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderPlus, Plus } from "lucide-react";
import { Button } from "../ui/button.js";
import { EmptyState } from "./empty-state.js";

const meta = {
  title: "patterns/EmptyState",
  component: EmptyState,
  args: {
    title: "Create a file bucket",
    description: "Store images, videos, documents, and any other file type.",
    icon: <FolderPlus className="size-6" aria-hidden="true" />,
    action: <Button size="sm"><Plus className="size-3.5" aria-hidden="true" />New bucket</Button>
  }
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Dashed: Story = {};
export const Plain: Story = { args: { variant: "plain", title: "No custom reports yet", icon: undefined } };
