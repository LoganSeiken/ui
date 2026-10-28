import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableHeader, TableRow } from "../ui/table.js";
import { SortableHead } from "./sortable-head.js";

const meta = { title: "patterns/SortableHead", component: SortableHead } satisfies Meta<
  typeof SortableHead
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <table className="w-[32rem] border border-border">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <SortableHead>Organization</SortableHead>
          <SortableHead sorted="asc">Plan</SortableHead>
          <SortableHead sorted="desc">Created</SortableHead>
        </TableRow>
      </TableHeader>
    </table>
  ),
};
