import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "./status-dot.js";

const meta = { title: "ui/StatusDot", component: StatusDot } satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-sm">
      <span className="flex items-center gap-2"><StatusDot status="success" label="Operational" /> Operational</span>
      <span className="flex items-center gap-2"><StatusDot status="danger" label="Errors" /> Errors</span>
      <span className="flex items-center gap-2"><StatusDot status="warning" label="Degraded" /> Degraded</span>
      <span className="flex items-center gap-2"><StatusDot status="neutral" label="No data" /> No data</span>
    </div>
  )
};
