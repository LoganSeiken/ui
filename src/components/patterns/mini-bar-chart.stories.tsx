import type { Meta, StoryObj } from "@storybook/react-vite";
import { MiniBarChart } from "./mini-bar-chart.js";

const data = Array.from({ length: 40 }, (_, i) => ({ success: i % 6 === 0 || i > 32 ? (i % 7) + 2 : 0, danger: i > 36 ? 3 : 0 }));
const meta = { title: "patterns/MiniBarChart", component: MiniBarChart, args: { data, label: "Requests, last 24 hours", className: "h-14 w-96" } } satisfies Meta<typeof MiniBarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithErrors: Story = {};
export const SuccessOnly: Story = { args: { data: data.map((d) => ({ success: d.success })) } };
