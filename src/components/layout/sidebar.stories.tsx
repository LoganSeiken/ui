import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, Home, Settings, Table2 } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSeparator } from "./sidebar.js";

const meta = {
  title: "layout/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  args: { "aria-label": "Primary" },
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <SidebarItem href="#" icon={<Home className="size-4" aria-hidden="true" />}>
      Project Overview
    </SidebarItem>
    <SidebarItem href="#" icon={<Table2 className="size-4" aria-hidden="true" />}>
      Table Editor
    </SidebarItem>
    <SidebarSeparator />
    <SidebarItem href="#" active icon={<Activity className="size-4" aria-hidden="true" />}>
      Observability
    </SidebarItem>
    <SidebarItem href="#" icon={<Settings className="size-4" aria-hidden="true" />}>
      Project Settings
    </SidebarItem>
  </>
);

export const Expanded: Story = { args: { mode: "expanded", className: "h-80", children: items } };
export const Collapsed: Story = { args: { mode: "collapsed", className: "h-80", children: items } };
export const ExpandOnHover: Story = { args: { mode: "hover", className: "h-80", children: items } };
