import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, Home, Settings, Table2 } from "lucide-react";
import { SidebarNav } from "./sidebar.js";

const items = [
  { href: "/", label: "Overview", icon: <Home className="size-4" aria-hidden="true" />, match: "exact" as const },
  { href: "/inbox", label: "Inbox", icon: <Activity className="size-4" aria-hidden="true" />, match: "prefix" as const },
  { href: "/settings", label: "Settings", icon: <Settings className="size-4" aria-hidden="true" />, match: "prefix" as const },
  { href: "/tables", label: "Tables", icon: <Table2 className="size-4" aria-hidden="true" />, match: "prefix" as const }
];
const meta = { title: "layout/SidebarNav", component: SidebarNav, parameters: { layout: "fullscreen" }, args: { items, pathname: "/inbox/today", className: "h-80" } } satisfies Meta<typeof SidebarNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
export const ExactMatch: Story = { args: { pathname: "/" } };
