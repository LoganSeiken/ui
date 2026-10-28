import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Database, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const meta = { title: "ui/Tabs", component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="buckets" className="w-96">
      <TabsList>
        <TabsTrigger value="buckets">Buckets</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>
      <TabsContent value="buckets">Buckets panel</TabsContent>
      <TabsContent value="settings">Settings panel</TabsContent>
      <TabsContent value="policies">Policies panel</TabsContent>
    </Tabs>
  ),
};
export const Cards: Story = {
  render: () => (
    <Tabs defaultValue="fw" className="w-[32rem]">
      <TabsList variant="cards">
        <TabsTrigger value="fw">
          <Box className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">Framework</span>
          <span className="text-sm text-muted-foreground">Use a client library</span>
        </TabsTrigger>
        <TabsTrigger value="server">
          <Database className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">Server</span>
          <span className="text-sm text-muted-foreground">Build APIs</span>
        </TabsTrigger>
        <TabsTrigger value="orm">
          <Table2 className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">ORM</span>
          <span className="text-sm text-muted-foreground">Third-party library</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="fw">Framework panel</TabsContent>
      <TabsContent value="server">Server panel</TabsContent>
      <TabsContent value="orm">ORM panel</TabsContent>
    </Tabs>
  ),
};
