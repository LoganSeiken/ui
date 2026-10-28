import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Table2 } from "lucide-react";
import { Button } from "../ui/button.js";
import { AppShell } from "./app-shell.js";
import { PageContainer } from "./page-container.js";
import { PageHeader } from "./page-header.js";
import { Sidebar, SidebarItem } from "./sidebar.js";
import { SubNav, SubNavItem, SubNavSection, SubNavTitle } from "./sub-nav.js";
import { TopBar } from "./top-bar.js";

const meta = { title: "layout/AppShell", component: AppShell, parameters: { layout: "fullscreen" } } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    className: "h-[480px]",
    main: false,
    topBar: <TopBar size="sm" start={<span className="text-sm font-medium">Demo Org / Acme</span>} end={<Button variant="outline" size="sm">Connect</Button>} />,
    sidebar: (
      <Sidebar aria-label="Primary" className="w-[206px]">
        <SidebarItem href="#" icon={<Home className="size-4" aria-hidden="true" />}>Project Overview</SidebarItem>
        <SidebarItem href="#" active icon={<Table2 className="size-4" aria-hidden="true" />}>Table Editor</SidebarItem>
      </Sidebar>
    ),
    subNav: (
      <SubNav aria-label="Section">
        <SubNavTitle>Observability</SubNavTitle>
        <SubNavSection title="General"><SubNavItem href="#" active>Overview</SubNavItem><SubNavItem href="#">Query Performance</SubNavItem></SubNavSection>
      </SubNav>
    ),
    children: <PageContainer><PageHeader title="Overview" description="Page content inside the shell." /></PageContainer>
  }
};
