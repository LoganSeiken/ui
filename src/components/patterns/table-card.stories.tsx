import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.js";
import { TableCard } from "./table-card.js";

const meta = { title: "patterns/TableCard", component: TableCard } satisfies Meta<typeof TableCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithTable: Story = {
  render: () => (
    <TableCard>
      <Table aria-label="Members">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alex Morgan</TableCell>
            <TableCell>alex@example.com</TableCell>
            <TableCell>Administrator</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sam Lee</TableCell>
            <TableCell>sam@example.com</TableCell>
            <TableCell>Read only</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <tr>
            <td className="px-4 py-2" colSpan={3}>
              2 members
            </td>
          </tr>
        </TableFooter>
      </Table>
    </TableCard>
  ),
};
