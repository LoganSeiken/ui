import type { Meta, StoryObj } from "@storybook/react-vite";
import { LifeBuoy, Shield } from "lucide-react";
import { Badge } from "../ui/badge.js";
import { StatusDot } from "../ui/status-dot.js";
import { ListItem } from "../patterns/list-item.js";
import { AsidePanel } from "./aside-panel.js";

const meta = { title: "layout/AsidePanel", component: AsidePanel, parameters: { layout: "fullscreen" } } satisfies Meta<typeof AsidePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HelpAndSupport: Story = {
  args: {
    title: "Help & Support",
    closeLabel: "Close panel",
    className: "h-[420px]",
    onClose: () => {},
    headerExtra: <Badge variant="outline"><StatusDot status="success" /> All systems operational</Badge>,
    children: (
      <div className="divide-y divide-border">
        <ListItem interactive icon={<LifeBuoy className="size-4" aria-hidden="true" />} title="Docs" description="Browse guides and references." />
        <ListItem interactive icon={<Shield className="size-4" aria-hidden="true" />} title="Troubleshooting" description="Find fixes for common issues." />
      </div>
    )
  }
};
