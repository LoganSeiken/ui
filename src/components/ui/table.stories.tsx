import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const meta = { title: "ui/Table", component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  ["Ana Ruiz", "ana@example.com", "Mon 15 Jun 2026"],
  ["Luis Mora", "luis@example.com", "Sun 14 Jun 2026"],
];

export const Caps: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([a, b, c]) => (
            <TableRow key={b}>
              <TableCell>{a}</TableCell>
              <TableCell>{b}</TableCell>
              <TableCell>{c}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
export const DenseGrid: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <Table variant="grid">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead variant="plain">Display name</TableHead>
            <TableHead variant="plain">Email</TableHead>
            <TableHead variant="plain">Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([a, b, c]) => (
            <TableRow key={b} className="h-11 [&>td]:py-0">
              <TableCell>{a}</TableCell>
              <TableCell>{b}</TableCell>
              <TableCell className="text-muted-foreground">{c}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} className="py-2 text-muted-foreground">
              Total: 2 users
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
