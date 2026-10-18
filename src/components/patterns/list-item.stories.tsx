import type { Meta, StoryObj } from "@storybook/react-vite";
import { LifeBuoy, Shield } from "lucide-react";
import { Badge } from "../ui/badge.js";
import { ListItem } from "./list-item.js";

const meta = { title: "patterns/ListItem", component: ListItem, args: { title: "Docs" } } satisfies Meta<typeof ListItem> ;
export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => (
    <div className="w-96 divide-y divide-border rounded-md border border-border bg-surface">
      <ListItem interactive icon={<LifeBuoy className="size-4" aria-hidden="true" />} title="Docs" description="Browse guides, references, and product documentation." />
      <ListItem interactive icon={<Shield className="size-4" aria-hidden="true" />} title="RLS Disabled in Public" description="public.example_table" trailing={<Badge variant="danger">CRITICAL</Badge>} />
      <ListItem title="Static row" description="No chevron" />
    </div>
  )
};

export const Linked: Story = {
  render: () => (
    <div className="w-96 rounded-md border border-border bg-surface">
      <ListItem href="/docs" icon={<LifeBuoy className="size-4" aria-hidden="true" />} title="Documentation" description="Browse guides and references." />
    </div>
  )
};
