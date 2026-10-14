import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar.js";
import { Button } from "../ui/button.js";
import { Indicator } from "../ui/indicator.js";
import { Kbd } from "../ui/kbd.js";
import { TopBar } from "./top-bar.js";

const meta = { title: "layout/TopBar", component: TopBar, parameters: { layout: "fullscreen" } } satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const end = (
  <>
    <Button variant="outline" size="md" className="w-44 justify-between text-muted-foreground"><span className="flex items-center gap-2"><Search className="size-4" aria-hidden="true" />Search</span><Kbd>⌘K</Kbd></Button>
    <Indicator><Button variant="outline" size="icon" aria-label="Notifications" className="rounded-pill"><Bell className="size-4" aria-hidden="true" /></Button></Indicator>
    <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  </>
);

export const Medium56: Story = { args: { start: <span className="text-xs uppercase tracking-caps text-muted-foreground">Platform Operations</span>, end } };
export const Small48: Story = { args: { size: "sm", start: <span className="text-sm font-medium">Demo Org / Acme</span>, end } };
