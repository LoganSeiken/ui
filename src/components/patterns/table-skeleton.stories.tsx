import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableSkeleton } from "./table-skeleton.js";
const meta = { title: "patterns/TableSkeleton", component: TableSkeleton, args: { columns: 4 } } satisfies Meta<typeof TableSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithHeaders: Story = { args: { headers: ["Name", "Email", "Role", "Status"] } };
