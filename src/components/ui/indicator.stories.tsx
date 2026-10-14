import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { Button } from "./button.js";
import { Indicator } from "./indicator.js";

const meta = { title: "ui/Indicator", component: Indicator } satisfies Meta<typeof Indicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OnIconButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Indicator label="3 unread notifications">
        <Button variant="outline" size="icon" aria-label="Notifications" className="rounded-pill"><Bell className="size-4" aria-hidden="true" /></Button>
      </Indicator>
      <Indicator show={false}>
        <Button variant="outline" size="icon" aria-label="Notifications" className="rounded-pill"><Bell className="size-4" aria-hidden="true" /></Button>
      </Indicator>
    </div>
  )
};
