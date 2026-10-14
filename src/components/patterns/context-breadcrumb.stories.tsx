import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { ContextBreadcrumb } from "./context-breadcrumb.js";

const meta = { title: "patterns/ContextBreadcrumb", component: ContextBreadcrumb } satisfies Meta<typeof ContextBreadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OrgProjectBranch: Story = {
  args: {
    items: [
      { key: "org", label: "Demo Org", badge: <Badge variant="outline">FREE</Badge>, onSwitch: () => {}, switchLabel: "Switch organization" },
      { key: "proj", label: "Acme", onSwitch: () => {}, switchLabel: "Switch project" },
      { key: "env", label: "main", badge: <Badge variant="warning">PRODUCTION</Badge>, onSwitch: () => {}, switchLabel: "Switch branch" }
    ],
    action: <Button variant="outline" size="sm">Connect</Button>
  }
};
