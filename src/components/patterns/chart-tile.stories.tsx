import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "../ui/status-dot.js";
import { ChartTile, TileGrid } from "./chart-tile.js";
import { MiniBarChart } from "./mini-bar-chart.js";

const meta = { title: "patterns/ChartTile", component: ChartTile, args: { label: "Metric" } } satisfies Meta<typeof ChartTile>;
export default meta;
type Story = StoryObj<typeof meta>;

const data = Array.from({ length: 40 }, (_, i) => ({ success: i % 6 === 0 || i > 32 ? (i % 7) + 2 : 0, danger: i > 36 ? 3 : 0 }));

export const JoinedGrid: Story = {
  render: () => (
    <TileGrid className="w-[40rem]">
      <ChartTile interactive className="col-span-2" marker={<StatusDot status="success" />} label="API Gateway" summary="1.2% warnings">
        <MiniBarChart data={data} label="API gateway requests" className="h-14" />
      </ChartTile>
      <ChartTile interactive marker={<StatusDot status="danger" />} label="Database" summary="35.8% errors">
        <MiniBarChart data={data} label="Database requests" className="h-14" />
      </ChartTile>
      <ChartTile interactive marker={<StatusDot status="success" />} label="Postgrest" summary="114 requests">
        <MiniBarChart data={data} label="Postgrest requests" className="h-14" />
      </ChartTile>
    </TileGrid>
  )
};
