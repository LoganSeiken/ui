import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import {
  KanbanBoard,
  KanbanBoardSkeleton,
  KanbanCard,
  type KanbanColumn,
  type KanbanLabels,
  type KanbanMove,
} from "../../index.js";

type Lead = { id: string; name: string; company: string };

const columns: KanbanColumn<Lead>[] = [
  {
    id: "open",
    title: "Open",
    summary: "2 leads",
    actions: <button type="button">Add lead</button>,
    footer: <button type="button">Load more</button>,
    items: [
      { id: "alpha", name: "Alpha", company: "Northwind" },
      { id: "beta", name: "Beta", company: "Contoso" },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    tone: "success",
    emptyText: "No qualified leads",
    items: [
      { id: "q1", name: "Gamma", company: "Fabrikam" },
      { id: "q2", name: "Delta", company: "Adventure Works" },
    ],
  },
  { id: "closed", title: "Closed", acceptsDrops: false, emptyText: "No closed leads", items: [] },
];

const labels: KanbanLabels = {
  board: "Sales pipeline",
  dragHandle: (item) => "Drag " + item,
  moveMenu: (item) => "Move " + item,
  moveMenuTitle: "Move to",
  announce: {
    pickedUp: ({ item, column, position, total }) =>
      "Picked up " + item + " in " + column + ", position " + position + " of " + total + ".",
    movedWithin: ({ item, column, position, total }) =>
      "Reordered " + item + " in " + column + ", position " + position + " of " + total + ".",
    movedAcross: ({ item, column, position, total }) =>
      "Moved " + item + " to " + column + ", position " + position + " of " + total + ".",
    dropped: ({ item, column, position, total }) =>
      "Dropped " + item + " in " + column + ", position " + position + " of " + total + ".",
    cancelled: ({ item }) => "Cancelled " + item + ".",
  },
};

function renderBoard(
  overrides: Partial<{
    columns: KanbanColumn<Lead>[];
    onMove: (move: KanbanMove) => void;
    readOnly: boolean;
    labels: KanbanLabels;
    renderItem: (lead: Lead) => ReactNode;
  }> = {},
) {
  return render(
    <KanbanBoard
      columns={overrides.columns ?? columns}
      renderItem={
        overrides.renderItem ??
        ((lead) => (
          <>
            <h3>{lead.name}</h3>
            <p>{lead.company}</p>
          </>
        ))
      }
      getItemLabel={(lead) => lead.name}
      getColumnLabel={(column) => String(column.title)}
      onMove={overrides.onMove ?? (() => undefined)}
      labels={overrides.labels ?? labels}
      readOnly={overrides.readOnly}
    />,
  );
}

function setBounds(element: Element, left: number, top: number, width: number, height: number) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: left,
    y: top,
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
    toJSON: () => ({}),
  });
}

function setBoardBounds(container: HTMLElement, customColumns = columns) {
  const board = screen.getByRole("region", { name: labels.board });
  setBounds(board, 0, 0, 900, 500);
  customColumns.forEach((column, index) => {
    const columnElement = container.querySelector<HTMLElement>(
      '[data-kanban-column-id="' + column.id + '"]',
    )!;
    const list = columnElement.querySelector<HTMLElement>("[data-kanban-list]")!;
    const left = index * 280;
    setBounds(columnElement, left, 0, 260, 500);
    setBounds(list, left, 50, 240, 400);
  });
  return board;
}

function setCardBounds(container: HTMLElement, column: KanbanColumn<Lead>) {
  const columnElement = container.querySelector<HTMLElement>(
    '[data-kanban-column-id="' + column.id + '"]',
  )!;
  column.items.forEach((item, index) => {
    const card = columnElement.querySelector<HTMLElement>(
      '[data-kanban-card-id="' + item.id + '"]',
    );
    if (card)
      setBounds(card, columnElement.getBoundingClientRect().left + 10, 60 + index * 40, 220, 32);
  });
}

function dispatchPointerEvent(
  target: Element | Window | Document,
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  init: {
    pointerId: number;
    pointerType?: string;
    button?: number;
    isPrimary?: boolean;
    clientX?: number;
    clientY?: number;
  },
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  for (const [key, value] of Object.entries(init)) Object.defineProperty(event, key, { value });
  fireEvent(target, event);
}

function pointerDown(element: HTMLElement, pointerId = 7, pointerType = "mouse", x = 20, y = 70) {
  dispatchPointerEvent(element, "pointerdown", {
    button: 0,
    pointerId,
    pointerType,
    isPrimary: true,
    clientX: x,
    clientY: y,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("KanbanBoard", () => {
  it("renders labelled columns, item actions, and caller-provided content", () => {
    renderBoard();
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Open" })).toHaveTextContent("2 leads");
    expect(screen.getByRole("group", { name: "Closed" })).toHaveTextContent("No closed leads");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Drag Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add lead" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
    expect(screen.getByText("Northwind")).toBeInTheDocument();
  });

  it("omits all movement controls and body dragging in read-only mode", () => {
    const { container } = renderBoard({ readOnly: true });
    const body = screen.getByText("Northwind");
    const board = screen.getByRole("region", { name: "Sales pipeline" });
    setBoardBounds(container);
    pointerDown(body, 1, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 1, clientX: 60, clientY: 70 });
    expect(screen.queryByRole("button", { name: "Drag Alpha" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move Alpha" })).not.toBeInTheDocument();
    expect(container.querySelector("[data-kanban-placeholder]")).not.toBeInTheDocument();
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
  });

  it("moves an item to the end of an accepted column from its menu", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    renderBoard({ onMove });
    await user.click(screen.getByRole("button", { name: "Move Alpha" }));
    expect(await screen.findByText("Move to")).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Closed" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Qualified" }));
    expect(onMove).toHaveBeenCalledWith({
      itemId: "alpha",
      fromColumnId: "open",
      toColumnId: "qualified",
      beforeId: "q2",
      afterId: null,
    });
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Moved Alpha to Qualified, position 3 of 3.",
    );
  });

  it("starts mouse dragging from the card body after the four-pixel threshold and reports the correct neighbors", () => {
    const onMove = vi.fn();
    const { container } = renderBoard({ onMove });
    const board = setBoardBounds(container);
    setCardBounds(container, columns[0]!);
    setCardBounds(container, columns[1]!);
    const cardBody = screen.getByText("Northwind");
    pointerDown(cardBody, 7, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 7, clientX: 25, clientY: 70 });
    expect(document.body.querySelector("[data-kanban-preview]")).toBeInTheDocument();
    expect(document.body.querySelector("[data-kanban-preview]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("[data-kanban-placeholder]")).toBeInTheDocument();
    dispatchPointerEvent(board, "pointermove", { pointerId: 7, clientX: 400, clientY: 105 });
    dispatchPointerEvent(board, "pointerup", { pointerId: 7, clientX: 400, clientY: 105 });
    expect(onMove).toHaveBeenCalledWith({
      itemId: "alpha",
      fromColumnId: "open",
      toColumnId: "qualified",
      beforeId: "q1",
      afterId: "q2",
    });
    expect(container.querySelector("[data-kanban-placeholder]")).not.toBeInTheDocument();
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
  });

  it("blocks native text selection only while a pointer drag is active", () => {
    const { container } = renderBoard();
    const board = setBoardBounds(container);
    setCardBounds(container, columns[0]!);
    const selectStart = () => {
      const event = new Event("selectstart", { bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(selectStart()).toBe(false);
    pointerDown(screen.getByText("Northwind"), 8, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 8, clientX: 40, clientY: 70 });
    expect(selectStart()).toBe(true);
    dispatchPointerEvent(board, "pointerup", { pointerId: 8, clientX: 40, clientY: 70 });
    expect(selectStart()).toBe(false);
  });

  it("does not start below four pixels and keeps clicks on card controls working", () => {
    const onClick = vi.fn();
    const withButton: KanbanColumn<Lead>[] = [
      {
        id: "only",
        title: "Only",
        items: [{ id: "a", name: "Alpha", company: "Northwind" }],
      },
    ];
    const { container } = renderBoard({
      columns: withButton,
      renderItem: () => (
        <button type="button" onClick={onClick}>
          Open record
        </button>
      ),
    });
    const board = screen.getByRole("region", { name: "Sales pipeline" });
    const button = screen.getByRole("button", { name: "Open record" });
    const card = container.querySelector<HTMLElement>('[data-kanban-card-id="a"]')!;
    pointerDown(card, 4, "mouse", 10, 10);
    dispatchPointerEvent(board, "pointermove", { pointerId: 4, clientX: 12, clientY: 10 });
    dispatchPointerEvent(board, "pointerup", { pointerId: 4, clientX: 12, clientY: 10 });
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
    pointerDown(button, 3, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 3, clientX: 80, clientY: 70 });
    dispatchPointerEvent(board, "pointerup", { pointerId: 3, clientX: 80, clientY: 70 });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
    expect(container.querySelector("[data-kanban-placeholder]")).not.toBeInTheDocument();
  });

  it("starts touch dragging only from the handle and keeps touch action there", () => {
    const { container } = renderBoard();
    const board = setBoardBounds(container);
    const handle = screen.getByRole("button", { name: "Drag Alpha" });
    const body = screen.getByText("Northwind");
    expect(handle).toHaveClass("touch-none");
    expect(body.closest("[data-kanban-card-id]")).not.toHaveClass("touch-none");
    pointerDown(body, 10, "touch", 20, 70);
    dispatchPointerEvent(board, "pointermove", {
      pointerId: 10,
      pointerType: "touch",
      clientX: 35,
      clientY: 70,
    });
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
    pointerDown(handle, 11, "touch", 20, 70);
    dispatchPointerEvent(board, "pointermove", {
      pointerId: 11,
      pointerType: "touch",
      clientX: 35,
      clientY: 70,
    });
    expect(document.body.querySelector("[data-kanban-preview]")).toBeInTheDocument();
    dispatchPointerEvent(board, "pointercancel", { pointerId: 11, pointerType: "touch" });
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
  });

  it("cancels a pointer drag with Escape and on pointer cancellation", () => {
    const onMove = vi.fn();
    const { container } = renderBoard({ onMove });
    const board = setBoardBounds(container);
    const body = screen.getByText("Northwind");
    pointerDown(body, 12, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 12, clientX: 30, clientY: 70 });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onMove).not.toHaveBeenCalled();
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Cancelled Alpha.",
    );
    expect(document.body.querySelector("[data-kanban-preview]")).not.toBeInTheDocument();
    pointerDown(body, 13, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 13, clientX: 30, clientY: 70 });
    dispatchPointerEvent(board, "pointercancel", { pointerId: 13 });
    expect(onMove).not.toHaveBeenCalled();
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Cancelled Alpha.",
    );
  });

  it("ignores a non-droppable column in pointer, keyboard, and menu movement", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const blockedAndAccepted: KanbanColumn<Lead>[] = [
      { id: "open", title: "Open", items: [{ id: "alpha", name: "Alpha", company: "Northwind" }] },
      { id: "blocked", title: "Blocked", acceptsDrops: false, items: [] },
      {
        id: "qualified",
        title: "Qualified",
        items: [{ id: "q1", name: "Gamma", company: "Fabrikam" }],
      },
    ];
    const { container } = renderBoard({ columns: blockedAndAccepted, onMove });
    const board = setBoardBounds(container, blockedAndAccepted);
    setCardBounds(container, blockedAndAccepted[0]!);
    setCardBounds(container, blockedAndAccepted[2]!);
    await user.click(screen.getByRole("button", { name: "Move Alpha" }));
    expect(screen.queryByRole("menuitem", { name: "Blocked" })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    const handle = screen.getByRole("button", { name: "Drag Alpha" });
    handle.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(onMove).toHaveBeenCalledWith({
      itemId: "alpha",
      fromColumnId: "open",
      toColumnId: "qualified",
      beforeId: "q1",
      afterId: null,
    });
    onMove.mockClear();
    pointerDown(screen.getByText("Northwind"), 21, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 21, clientX: 30, clientY: 70 });
    dispatchPointerEvent(board, "pointermove", { pointerId: 21, clientX: 400, clientY: 70 });
    dispatchPointerEvent(board, "pointerup", { pointerId: 21, clientX: 400, clientY: 70 });
    expect(onMove).not.toHaveBeenCalled();
  });

  it("does not call onMove when pointer or keyboard drop at the original position", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const { container } = renderBoard({ onMove });
    const board = setBoardBounds(container);
    setCardBounds(container, columns[0]!);
    pointerDown(screen.getByText("Northwind"), 22, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 22, clientX: 30, clientY: 70 });
    dispatchPointerEvent(board, "pointermove", { pointerId: 22, clientX: 30, clientY: 70 });
    dispatchPointerEvent(board, "pointerup", { pointerId: 22, clientX: 30, clientY: 70 });
    expect(onMove).not.toHaveBeenCalled();
    const handle = screen.getByRole("button", { name: "Drag Alpha" });
    handle.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowUp}");
    await user.keyboard("{Enter}");
    expect(onMove).not.toHaveBeenCalled();
  });

  it("announces keyboard pickup, reordering, cross-column movement, and drop", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    renderBoard({ onMove });
    const handle = screen.getByRole("button", { name: "Drag Beta" });
    handle.focus();
    await user.keyboard(" ");
    expect(handle).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Picked up Beta in Open, position 2 of 2.",
    );
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Reordered Beta in Open, position 1 of 2.",
    );
    await user.keyboard("{Enter}");
    expect(onMove).toHaveBeenCalledWith({
      itemId: "beta",
      fromColumnId: "open",
      toColumnId: "open",
      beforeId: null,
      afterId: "alpha",
    });
    expect(handle).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Dropped Beta in Open, position 1 of 2.",
    );
  });

  it("moves a keyboard-picked item across columns with arrow keys", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    renderBoard({ onMove });
    const handle = screen.getByRole("button", { name: "Drag Alpha" });
    handle.focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("region", { name: "Sales pipeline" })).toHaveTextContent(
      "Moved Alpha to Qualified, position 3 of 3.",
    );
    await user.keyboard("{ArrowUp}");
    await user.keyboard("{Enter}");
    expect(onMove).toHaveBeenCalledWith({
      itemId: "alpha",
      fromColumnId: "open",
      toColumnId: "qualified",
      beforeId: "q1",
      afterId: "q2",
    });
  });

  it("uses Spanish labels with accents in controls and live announcements", async () => {
    const user = userEvent.setup();
    const spanish: KanbanLabels = {
      board: "Canal de ventas",
      dragHandle: (item) => "Mover " + item,
      moveMenu: (item) => "Cambiar etapa de " + item,
      moveMenuTitle: "Mover a",
      announce: {
        pickedUp: ({ item, column, position, total }) =>
          item + " recogido en " + column + ", posición " + position + " de " + total + ".",
        movedWithin: ({ item, column, position, total }) =>
          item + " reordenado en " + column + ", posición " + position + " de " + total + ".",
        movedAcross: ({ item, column, position, total }) =>
          item + " movido a " + column + ", posición " + position + " de " + total + ".",
        dropped: ({ item, column, position, total }) =>
          item + " soltado en " + column + ", posición " + position + " de " + total + ".",
        cancelled: ({ item }) => "Se canceló " + item + ".",
      },
    };
    renderBoard({ labels: spanish });
    const handle = screen.getByRole("button", { name: "Mover Alpha" });
    expect(screen.getByRole("button", { name: "Cambiar etapa de Alpha" })).toBeInTheDocument();
    handle.focus();
    await user.keyboard(" ");
    expect(screen.getByRole("region", { name: "Canal de ventas" })).toHaveTextContent(
      "Alpha recogido en Open, posición 1 de 2.",
    );
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Cambiar etapa de Alpha" }));
    expect(await screen.findByText("Mover a")).toBeInTheDocument();
  });

  it("scrolls horizontally when the pointer is within 48 pixels of the board edge", () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    const { container } = renderBoard();
    const board = setBoardBounds(container);
    Object.defineProperty(board, "scrollWidth", { configurable: true, value: 1800 });
    Object.defineProperty(board, "clientWidth", { configurable: true, value: 900 });
    setCardBounds(container, columns[0]!);
    const body = screen.getByText("Northwind");
    pointerDown(body, 30, "mouse", 20, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 30, clientX: 30, clientY: 70 });
    dispatchPointerEvent(board, "pointermove", { pointerId: 30, clientX: 870, clientY: 100 });
    for (let index = 0; index < 3 && frames.length > 0; index += 1) {
      const callback = frames.shift()!;
      act(() => callback(16));
    }
    expect(board.scrollLeft).toBeGreaterThan(0);
    dispatchPointerEvent(board, "pointercancel", { pointerId: 30 });
  });

  it("measures a 500-item six-column board without rerendering unrelated cards as targets change", () => {
    const manyColumns: KanbanColumn<{ id: string; name: string }>[] = Array.from(
      { length: 6 },
      (_, columnIndex) => ({
        id: "column-" + columnIndex,
        title: "Column " + columnIndex,
        items: Array.from({ length: columnIndex === 5 ? 85 : 83 }, (_, itemIndex) => {
          const ordinal = columnIndex * 83 + itemIndex;
          return { id: "item-" + ordinal, name: "Item " + ordinal };
        }),
      }),
    );
    const renderItem = vi.fn((item: { id: string; name: string }) => <span>{item.name}</span>);
    const getItemLabel = (item: { id: string; name: string }) => item.name;
    const getColumnLabel = (column: KanbanColumn<{ id: string; name: string }>) =>
      String(column.title);
    const boardLabels: KanbanLabels = { ...labels, board: "Large board" };
    const { container } = render(
      <KanbanBoard
        columns={manyColumns}
        renderItem={renderItem}
        getItemLabel={getItemLabel}
        getColumnLabel={getColumnLabel}
        onMove={() => undefined}
        labels={boardLabels}
      />,
    );
    const board = screen.getByRole("region", { name: "Large board" });
    setBounds(board, 0, 0, 1600, 500);
    manyColumns.forEach((column, index) => {
      const element = container.querySelector<HTMLElement>(
        '[data-kanban-column-id="' + column.id + '"]',
      )!;
      setBounds(element, index * 250, 0, 240, 500);
      setBounds(element.querySelector("[data-kanban-list]")!, index * 250, 50, 220, 400);
    });
    const firstCard = container.querySelector<HTMLElement>('[data-kanban-card-id="item-0"]')!;
    setBounds(firstCard, 10, 60, 200, 32);
    renderItem.mockClear();
    pointerDown(firstCard, 40, "mouse", 15, 70);
    dispatchPointerEvent(board, "pointermove", { pointerId: 40, clientX: 25, clientY: 70 });
    dispatchPointerEvent(board, "pointermove", { pointerId: 40, clientX: 300, clientY: 70 });
    dispatchPointerEvent(board, "pointermove", { pointerId: 40, clientX: 550, clientY: 70 });
    expect(renderItem).toHaveBeenCalledTimes(2);
    expect(renderItem.mock.calls.length).toBeLessThanOrEqual(6);
    dispatchPointerEvent(board, "pointercancel", { pointerId: 40 });
  });

  it("renders KanbanCard as a surface with a focus-within ring", () => {
    const { container } = render(<KanbanCard>Lead details</KanbanCard>);
    expect(container.firstElementChild).toHaveClass(
      "rounded-md",
      "border-border",
      "bg-surface",
      "focus-within:ring-2",
    );
  });

  it("renders a busy board skeleton with an accessible label", () => {
    render(<KanbanBoardSkeleton columns={2} cardsPerColumn={1} label="Loading sales pipeline" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading sales pipeline")).toHaveClass("sr-only");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});
