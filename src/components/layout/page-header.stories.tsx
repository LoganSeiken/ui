import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { PageHeader } from "./page-header.js";

const meta = { title: "layout/PageHeader", component: PageHeader, args: { title: "Overview", description: "Metrics for the last 24 hours" } } satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithBadgeAndActions: Story = { args: { badge: <Badge variant="warning">BETA</Badge>, actions: <Button variant="outline" size="sm">Refresh</Button> } };
export const Small: Story = { args: { size: "sm", description: undefined } };
export const Large: Story = { args: { size: "lg", title: "Acme", description: undefined } };
