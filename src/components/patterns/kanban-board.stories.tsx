import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Button } from "../ui/button.js";
import { KanbanBoard, KanbanBoardSkeleton, type KanbanColumn, type KanbanLabels, type KanbanMove } from "./kanban-board.js";

type Deal = { id: string; name: string; company: string; value: string };

const initialColumns: KanbanColumn<Deal>[] = [
  {
    id: "new",
    title: "New",
    summary: "2 deals",
    actions: <Button size="sm">Add deal</Button>,
    items: [
      { id: "d1", name: "Northwind renewal", company: "Northwind Traders", value: "$18,000" },
      { id: "d2", name: "Contoso rollout", company: "Contoso", value: "$42,000" }
    ]
  },
  {
    id: "qualified",
    title: "Qualified",
    tone: "success",
    summary: "1 deal",
    items: [{ id: "d3", name: "Fabrikam expansion", company: "Fabrikam", value: "$27,500" }]
  },
  {
    id: "closed",
    title: "Closed",
    tone: "danger",
    summary: "No deals",
    emptyText: "No closed deals",
    items: []
  }
];

const labels: KanbanLabels = {
  board: "Sales pipeline",
  dragHandle: (item) => "Drag " + item,
  moveMenu: (item) => "Move " + item,
  moveMenuTitle: "Move to",
  announce: {
    pickedUp: ({ item, column, position, total }) => "Picked up " + item + " in " + column + ", position " + position + " of " + total + ".",
    movedWithin: ({ item, column, position, total }) => "Reordered " + item + " in " + column + ", position " + position + " of " + total + ".",
    movedAcross: ({ item, column, position, total }) => "Moved " + item + " to " + column + ", position " + position + " of " + total + ".",
    dropped: ({ item, column, position, total }) => "Dropped " + item + " in " + column + ", position " + position + " of " + total + ".",
    cancelled: ({ item }) => "Cancelled " + item + "."
  }
};

function BoardFrame({ children }: { children: ReactNode }) {
  return <div className="h-[32rem] w-full">{children}</div>;
}

function moveDealInColumns(current: KanbanColumn<Deal>[], move: KanbanMove) {
  const next = current.map((column) => ({
    ...column,
    items: column.items.filter((item) => item.id !== move.itemId)
  }));
  const target = next.find((column) => column.id === move.toColumnId);
  const deal = current.flatMap((column) => column.items).find((item) => item.id === move.itemId);
  if (!target || !deal) return current;
  const afterIndex = move.afterId ? target.items.findIndex((item) => item.id === move.afterId) : -1;
  const beforeIndex = move.beforeId ? target.items.findIndex((item) => item.id === move.beforeId) : -1;
  const insertIndex = afterIndex >= 0 ? afterIndex : beforeIndex >= 0 ? beforeIndex + 1 : target.items.length;
  target.items.splice(insertIndex, 0, deal);
  return next.map((column) => ({ ...column, summary: column.items.length + " deals" }));
}

function PipelineExample({ readOnly = false }: { readOnly?: boolean }) {
  const [columns, setColumns] = useState(initialColumns);
  return (
    <BoardFrame>
      <KanbanBoard
        columns={columns}
        renderItem={(deal) => (
          <div className="grid gap-1">
            <h3 className="text-sm font-medium">{deal.name}</h3>
            <p className="text-xs text-muted-foreground">{deal.company}</p>
            <p className="text-xs text-muted-foreground">{deal.value}</p>
          </div>
        )}
        getItemLabel={(deal) => deal.name}
        getColumnLabel={(column) => String(column.title)}
        onMove={(move) => setColumns((current) => moveDealInColumns(current, move))}
        labels={labels}
        readOnly={readOnly}
      />
    </BoardFrame>
  );
}

function ManyItemsExample() {
  const [visibleCount, setVisibleCount] = useState(200);
  const items = Array.from({ length: visibleCount }, (_, index) => ({
    id: "deal-" + index,
    name: "Deal " + (index + 1),
    company: index % 2 === 0 ? "Northwind Traders" : "Contoso"
  }));
  const columns: KanbanColumn<{ id: string; name: string; company: string }>[] = [{
    id: "open",
    title: "Open",
    summary: visibleCount + " deals",
    items,
    footer: <Button variant="outline" size="sm" onClick={() => setVisibleCount((count) => count + 30)}>Load 30 more</Button>
  }];
  return (
    <BoardFrame>
      <KanbanBoard
        columns={columns}
        renderItem={(deal) => <div className="grid gap-1"><span className="text-sm font-medium">{deal.name}</span><span className="text-xs text-muted-foreground">{deal.company}</span></div>}
        getItemLabel={(deal) => deal.name}
        getColumnLabel={(column) => String(column.title)}
        onMove={() => undefined}
        labels={labels}
      />
    </BoardFrame>
  );
}

const meta = { title: "patterns/KanbanBoard" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = { render: () => <PipelineExample /> };
export const WithSummaryAndActions: Story = {
  render: () => (
    <BoardFrame>
      <KanbanBoard
        columns={initialColumns.map((column, index) => ({
          ...column,
          summary: index === 0 ? "2 deals · $60,000" : column.summary,
          actions: index === 0 ? <Button variant="ghost" size="icon" aria-label="Add a deal"><Plus className="size-4" aria-hidden="true" /></Button> : column.actions
        }))}
        renderItem={(deal) => <div className="grid gap-1"><span className="text-sm font-medium">{deal.name}</span><span className="text-xs text-muted-foreground">{deal.company}</span></div>}
        getItemLabel={(deal) => deal.name}
        getColumnLabel={(column) => String(column.title)}
        onMove={() => undefined}
        labels={labels}
      />
    </BoardFrame>
  )
};
export const EmptyColumns: Story = {
  render: () => (
    <BoardFrame>
      <KanbanBoard
        columns={[
          { id: "new", title: "New", summary: "0 deals", emptyText: "No deals yet", items: [] },
          { id: "qualified", title: "Qualified", summary: "0 deals", emptyText: "Nothing qualified", items: [] },
          { id: "closed", title: "Closed", emptyText: "No closed deals", items: [] }
        ]}
        renderItem={(deal: Deal) => <span>{deal.name}</span>}
        getItemLabel={(deal) => deal.name}
        getColumnLabel={(column) => String(column.title)}
        onMove={() => undefined}
        labels={labels}
      />
    </BoardFrame>
  )
};
export const ManyItems: Story = { render: () => <ManyItemsExample /> };
export const ReadOnly: Story = { render: () => <PipelineExample readOnly /> };
export const Loading: Story = { render: () => <BoardFrame><KanbanBoardSkeleton label="Loading sales pipeline" /></BoardFrame> };
