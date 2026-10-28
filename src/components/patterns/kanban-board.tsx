"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ArrowRightLeft, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js";
import { Button } from "../ui/button.js";
import { Skeleton } from "../ui/skeleton.js";
import { Section } from "./section.js";
import { cn } from "../../utils/cn.js";

export type KanbanMove = {
  itemId: string;
  fromColumnId: string;
  toColumnId: string;
  beforeId: string | null;
  afterId: string | null;
};

export type KanbanColumn<T extends { id: string }> = {
  id: string;
  title: ReactNode;
  items: T[];
  summary?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "success" | "danger";
  emptyText?: ReactNode;
  acceptsDrops?: boolean;
};

export type KanbanLabels = {
  board: string;
  dragHandle: (itemLabel: string) => string;
  moveMenu: (itemLabel: string) => string;
  moveMenuTitle: string;
  announce: {
    pickedUp: (a: { item: string; column: string; position: number; total: number }) => string;
    movedWithin: (a: { item: string; column: string; position: number; total: number }) => string;
    movedAcross: (a: { item: string; column: string; position: number; total: number }) => string;
    dropped: (a: { item: string; column: string; position: number; total: number }) => string;
    cancelled: (a: { item: string }) => string;
  };
};

export type KanbanBoardProps<T extends { id: string }> = {
  columns: KanbanColumn<T>[];
  renderItem: (item: T) => ReactNode;
  getItemLabel: (item: T) => string;
  getColumnLabel: (column: KanbanColumn<T>) => string;
  /** Return `false` when the move is not applied yet (for example it awaits confirmation): no completion is announced. */
  onMove: (move: KanbanMove) => void | false;
  labels: KanbanLabels;
  readOnly?: boolean;
  className?: string;
};

export type KanbanCardProps = { children: ReactNode; className?: string };
export type KanbanBoardSkeletonProps = { columns?: number; cardsPerColumn?: number; label: string };

type DropPosition = { columnId: string; index: number };
type ActiveDrag = {
  itemId: string;
  itemLabel: string;
  fromColumnId: string;
  fromIndex: number;
  pointerId: number | null;
  pointerType?: string;
  targetColumnId?: string;
  targetIndex?: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
};
type PendingGesture = {
  itemId: string;
  itemLabel: string;
  fromColumnId: string;
  fromIndex: number;
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  element: HTMLElement;
  cardElement: HTMLElement;
};
type RectBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};
type CardMeasurement = { id: string; rect: RectBounds };
type ColumnMeasurement = {
  columnId: string;
  outer: RectBounds;
  list: RectBounds;
  cards: CardMeasurement[];
};
type Measurements = { board: RectBounds | null; columns: Map<string, ColumnMeasurement> };
type LatestProps<T extends { id: string }> = {
  columns: KanbanColumn<T>[];
  renderItem: (item: T) => ReactNode;
  getItemLabel: (item: T) => string;
  getColumnLabel: (column: KanbanColumn<T>) => string;
  onMove: (move: KanbanMove) => void | false;
  labels: KanbanLabels;
  readOnly: boolean;
  token: object;
};

const columnTones: Record<NonNullable<KanbanColumn<{ id: string }>["tone"]>, string> = {
  default: "border-border",
  success: "border-chart-success",
  danger: "border-destructive",
};

function acceptsDrops<T extends { id: string }>(column: KanbanColumn<T>) {
  return column.acceptsDrops !== false;
}

function readRect(element: Element): RectBounds {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

export function KanbanCard({ children, className }: KanbanCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface transition-colors hover:bg-surface-subtle focus-within:outline-hidden focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}

type LiveRegionHandle = { announce: (message: string) => void };

const LiveRegion = forwardRef<LiveRegionHandle, { children?: never }>(
  function LiveRegion(_props, ref) {
    const [message, setMessage] = useState("");
    useImperativeHandle(ref, () => ({ announce: setMessage }), []);
    return (
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {message}
      </span>
    );
  },
);

type StableLabels = Omit<KanbanLabels, "board">;

type KanbanItemProps<T extends { id: string }> = {
  item: T;
  columnId: string;
  index: number;
  isDragging: boolean;
  isKeyboardActive: boolean;
  readOnly: boolean;
  moveTargets: KanbanColumn<T>[];
  configurationToken: object;
  renderItem: (item: T) => ReactNode;
  getItemLabel: (item: T) => string;
  labels: StableLabels;
  onGestureStart: (
    event: ReactPointerEvent<HTMLDivElement>,
    item: T,
    columnId: string,
    index: number,
  ) => void;
  onKeyboardMove: (
    event: KeyboardEvent<HTMLButtonElement>,
    item: T,
    columnId: string,
    index: number,
  ) => void;
  onKeyboardBlur: (itemId: string) => void;
  onMenuMove: (item: T, sourceColumnId: string, targetColumnId: string) => void;
  getColumnLabel: (column: KanbanColumn<T>) => string;
};

function KanbanItemComponent<T extends { id: string }>({
  item,
  columnId,
  index,
  isDragging,
  isKeyboardActive,
  readOnly,
  moveTargets,
  configurationToken: _configurationToken,
  renderItem,
  getItemLabel,
  labels,
  onGestureStart,
  onKeyboardMove,
  onKeyboardBlur,
  onMenuMove,
  getColumnLabel,
}: KanbanItemProps<T>): JSX.Element {
  void _configurationToken;
  const itemLabel = getItemLabel(item);
  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => onGestureStart(event, item, columnId, index),
    [columnId, index, item, onGestureStart],
  );
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => onKeyboardMove(event, item, columnId, index),
    [columnId, index, item, onKeyboardMove],
  );
  const onBlur = useCallback(() => onKeyboardBlur(item.id), [item.id, onKeyboardBlur]);
  const cardContent = renderItem(item);

  return (
    <div
      data-kanban-card-id={item.id}
      role="listitem"
      className={cn("group relative min-w-0", isDragging && "opacity-50")}
      onPointerDown={readOnly ? undefined : onPointerDown}
    >
      <KanbanCard className="relative min-w-0 p-3">
        {!readOnly ? (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-kanban-handle=""
              aria-label={labels.dragHandle(itemLabel)}
              aria-pressed={isKeyboardActive}
              className={cn("touch-none", isDragging && "cursor-grabbing")}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
            >
              <GripVertical className="size-4" aria-hidden="true" />
            </Button>
            {moveTargets.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={labels.moveMenu(itemLabel)}
                  >
                    <ArrowRightLeft className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" aria-label={labels.moveMenuTitle}>
                  <DropdownMenuLabel>{labels.moveMenuTitle}</DropdownMenuLabel>
                  {moveTargets.map((target) => (
                    <DropdownMenuItem
                      key={target.id}
                      onSelect={() => onMenuMove(item, columnId, target.id)}
                    >
                      {getColumnLabel(target)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        ) : null}
        <div className="pr-16">{cardContent}</div>
      </KanbanCard>
    </div>
  );
}

const KanbanItem = memo(KanbanItemComponent) as typeof KanbanItemComponent;

type KanbanColumnViewProps<T extends { id: string }> = {
  column: KanbanColumn<T>;
  moveTargets: KanbanColumn<T>[];
  targetIndex: number | null;
  placeholderHeight: number;
  draggedItemId: string | null;
  keyboardItemId: string | null;
  configurationToken: object;
  renderItem: (item: T) => ReactNode;
  getItemLabel: (item: T) => string;
  getColumnLabel: (column: KanbanColumn<T>) => string;
  labels: StableLabels;
  readOnly: boolean;
  onGestureStart: KanbanItemProps<T>["onGestureStart"];
  onKeyboardMove: KanbanItemProps<T>["onKeyboardMove"];
  onKeyboardBlur: KanbanItemProps<T>["onKeyboardBlur"];
  onMenuMove: KanbanItemProps<T>["onMenuMove"];
  onColumnElement: (columnId: string, element: HTMLElement | null) => void;
  onListElement: (columnId: string, element: HTMLElement | null) => void;
};

function KanbanColumnViewComponent<T extends { id: string }>({
  column,
  moveTargets,
  targetIndex,
  placeholderHeight,
  draggedItemId,
  keyboardItemId,
  configurationToken,
  renderItem,
  getItemLabel,
  getColumnLabel,
  labels,
  readOnly,
  onGestureStart,
  onKeyboardMove,
  onKeyboardBlur,
  onMenuMove,
  onColumnElement,
  onListElement,
}: KanbanColumnViewProps<T>): JSX.Element {
  const columnRef = useCallback(
    (element: HTMLDivElement | null) => onColumnElement(column.id, element),
    [column.id, onColumnElement],
  );
  const listRef = useCallback(
    (element: HTMLDivElement | null) => onListElement(column.id, element),
    [column.id, onListElement],
  );
  let placeholderAdded = false;
  const placeholder =
    targetIndex !== null ? (
      <div
        key="kanban-placeholder"
        data-kanban-placeholder=""
        aria-hidden="true"
        className="rounded-md border border-dashed border-input bg-muted/40"
        style={{ height: placeholderHeight }}
      />
    ) : null;
  const listItems: ReactNode[] = [];
  let remainingIndex = 0;

  for (let itemIndex = 0; itemIndex < column.items.length; itemIndex += 1) {
    const item = column.items[itemIndex]!;
    if (!placeholderAdded && placeholder && targetIndex === remainingIndex) {
      listItems.push(placeholder);
      placeholderAdded = true;
    }
    listItems.push(
      <KanbanItem
        key={item.id}
        item={item}
        columnId={column.id}
        index={itemIndex}
        isDragging={draggedItemId === item.id}
        isKeyboardActive={keyboardItemId === item.id}
        readOnly={readOnly}
        moveTargets={moveTargets}
        configurationToken={configurationToken}
        renderItem={renderItem}
        getItemLabel={getItemLabel}
        labels={labels}
        onGestureStart={onGestureStart}
        onKeyboardMove={onKeyboardMove}
        onKeyboardBlur={onKeyboardBlur}
        onMenuMove={onMenuMove}
        getColumnLabel={getColumnLabel}
      />,
    );
    if (item.id !== draggedItemId) remainingIndex += 1;
  }
  if (!placeholderAdded && placeholder && targetIndex !== null && targetIndex >= remainingIndex)
    listItems.push(placeholder);

  return (
    <div
      ref={columnRef}
      data-kanban-column-id={column.id}
      role="group"
      aria-label={getColumnLabel(column)}
      className={cn(
        "flex h-full max-h-full min-h-0 w-72 shrink-0 snap-start flex-col gap-3 rounded-md border bg-surface-subtle p-3 transition-shadow",
        columnTones[column.tone ?? "default"],
        targetIndex !== null && "ring-2 ring-ring ring-offset-2 ring-offset-background",
      )}
    >
      <Section
        title={column.title}
        description={column.summary}
        actions={column.actions}
        className="shrink-0 space-y-0"
      />
      <div
        ref={listRef}
        data-kanban-list=""
        role="list"
        className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto"
      >
        {listItems}
      </div>
      {column.items.length === 0 && column.emptyText !== undefined && column.emptyText !== null ? (
        <div className="px-2 py-3 text-sm text-muted-foreground">{column.emptyText}</div>
      ) : null}
      {column.footer !== undefined && column.footer !== null ? (
        <footer className="shrink-0 border-t border-border pt-3">{column.footer}</footer>
      ) : null}
    </div>
  );
}

const KanbanColumnView = memo(KanbanColumnViewComponent) as typeof KanbanColumnViewComponent;

type PreviewProps<T extends { id: string }> = {
  item: T;
  renderItem: (item: T) => ReactNode;
  width: number;
  onElement: (element: HTMLDivElement | null) => void;
};

function KanbanPreviewComponent<T extends { id: string }>({
  item,
  renderItem,
  width,
  onElement,
}: PreviewProps<T>): JSX.Element {
  return (
    <div
      ref={onElement}
      data-kanban-preview=""
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-(--ui-z-popover) rotate-1 shadow-xl"
      style={{ width }}
    >
      <KanbanCard className="relative min-w-0 p-3">
        <div className="pr-16">{renderItem(item)}</div>
      </KanbanCard>
    </div>
  );
}

const KanbanPreview = memo(KanbanPreviewComponent) as typeof KanbanPreviewComponent;

export function KanbanBoard<T extends { id: string }>({
  columns,
  renderItem,
  getItemLabel,
  getColumnLabel,
  onMove,
  labels,
  readOnly = false,
  className,
}: KanbanBoardProps<T>): JSX.Element {
  const latestRef = useRef<LatestProps<T>>({
    columns,
    renderItem,
    getItemLabel,
    getColumnLabel,
    onMove,
    labels,
    readOnly,
    token: {},
  });
  const previous = latestRef.current;
  if (
    previous.renderItem !== renderItem ||
    previous.getItemLabel !== getItemLabel ||
    previous.getColumnLabel !== getColumnLabel ||
    previous.labels !== labels ||
    previous.readOnly !== readOnly
  ) {
    latestRef.current = {
      columns,
      renderItem,
      getItemLabel,
      getColumnLabel,
      onMove,
      labels,
      readOnly,
      token: {},
    };
  } else {
    latestRef.current = {
      ...previous,
      columns,
      renderItem,
      getItemLabel,
      getColumnLabel,
      onMove,
      labels,
      readOnly,
    };
  }

  const latest = latestRef.current;
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const pendingGestureRef = useRef<PendingGesture | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const columnElementsRef = useRef(new Map<string, HTMLElement>());
  const listElementsRef = useRef(new Map<string, HTMLElement>());
  const measurementsRef = useRef<Measurements>({ board: null, columns: new Map() });
  const previewElementRef = useRef<HTMLDivElement | null>(null);
  const previewRafRef = useRef<number | null>(null);
  const latestPointerRef = useRef({ x: 0, y: 0 });
  const captureElementRef = useRef<HTMLElement | null>(null);
  const clickSuppressTimerRef = useRef<number | null>(null);
  const clickSuppressListenerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const liveRegionRef = useRef<LiveRegionHandle>(null);

  const stableRenderItem = useCallback((item: T) => latestRef.current.renderItem(item), []);
  const stableGetItemLabel = useCallback((item: T) => latestRef.current.getItemLabel(item), []);
  const stableGetColumnLabel = useCallback(
    (column: KanbanColumn<T>) => latestRef.current.getColumnLabel(column),
    [],
  );
  const stableMove = useCallback(
    (move: KanbanMove): void | false => latestRef.current.onMove(move),
    [],
  );
  const stableLabels = useMemo<StableLabels>(
    () => ({
      dragHandle: (item) => latestRef.current.labels.dragHandle(item),
      moveMenu: (item) => latestRef.current.labels.moveMenu(item),
      get moveMenuTitle() {
        return latestRef.current.labels.moveMenuTitle;
      },
      announce: {
        pickedUp: (args) => latestRef.current.labels.announce.pickedUp(args),
        movedWithin: (args) => latestRef.current.labels.announce.movedWithin(args),
        movedAcross: (args) => latestRef.current.labels.announce.movedAcross(args),
        dropped: (args) => latestRef.current.labels.announce.dropped(args),
        cancelled: (args) => latestRef.current.labels.announce.cancelled(args),
      },
    }),
    [],
  );
  const moveTargetsByColumn = useMemo(
    () =>
      new Map(
        columns.map((column) => [
          column.id,
          columns.filter((target) => target.id !== column.id && acceptsDrops(target)),
        ]),
      ),
    [columns],
  );
  const isPointerDragActive = activeDrag?.pointerId !== undefined && activeDrag.pointerId !== null;

  const announce = useCallback((message: string) => {
    liveRegionRef.current?.announce(message);
  }, []);

  const getColumn = useCallback(
    (columnId: string) => latestRef.current.columns.find((column) => column.id === columnId),
    [],
  );

  const updateActiveDrag = useCallback((next: ActiveDrag | null) => {
    activeDragRef.current = next;
    setActiveDrag(next);
  }, []);

  const setColumnElement = useCallback((columnId: string, element: HTMLElement | null) => {
    if (element) columnElementsRef.current.set(columnId, element);
    else columnElementsRef.current.delete(columnId);
  }, []);
  const setListElement = useCallback((columnId: string, element: HTMLElement | null) => {
    if (element) listElementsRef.current.set(columnId, element);
    else listElementsRef.current.delete(columnId);
  }, []);

  const measureAll = useCallback((): Measurements => {
    const currentColumns = latestRef.current.columns;
    const measuredColumns = new Map<string, ColumnMeasurement>();
    const board = boardRef.current ? readRect(boardRef.current) : null;
    for (const column of currentColumns) {
      const columnElement = columnElementsRef.current.get(column.id);
      const listElement = listElementsRef.current.get(column.id);
      if (!columnElement || !listElement) continue;
      const cardElements = Array.from(
        columnElement.querySelectorAll<HTMLElement>("[data-kanban-card-id]"),
      );
      const cards = cardElements.map((element) => ({
        id: element.dataset.kanbanCardId ?? "",
        rect: readRect(element),
      }));
      measuredColumns.set(column.id, {
        columnId: column.id,
        outer: readRect(columnElement),
        list: readRect(listElement),
        cards,
      });
    }
    const next = { board, columns: measuredColumns };
    measurementsRef.current = next;
    return next;
  }, []);

  const positionPreview = useCallback((x: number, y: number) => {
    const drag = activeDragRef.current;
    const element = previewElementRef.current;
    if (!drag || drag.pointerId === null || !element) return;
    element.style.transform =
      "translate3d(" + (x - (drag.offsetX ?? 0)) + "px, " + (y - (drag.offsetY ?? 0)) + "px, 0)";
  }, []);

  const schedulePreview = useCallback(
    (x: number, y: number) => {
      latestPointerRef.current = { x, y };
      if (previewRafRef.current !== null) window.cancelAnimationFrame(previewRafRef.current);
      previewRafRef.current = window.requestAnimationFrame(() => {
        previewRafRef.current = null;
        positionPreview(latestPointerRef.current.x, latestPointerRef.current.y);
      });
    },
    [positionPreview],
  );

  const setPreviewElement = useCallback(
    (element: HTMLDivElement | null) => {
      previewElementRef.current = element;
      if (element) {
        const pointer = latestPointerRef.current;
        schedulePreview(pointer.x, pointer.y);
      }
    },
    [schedulePreview],
  );

  const releasePointer = useCallback((pointerId: number) => {
    const element = captureElementRef.current;
    captureElementRef.current = null;
    try {
      element?.releasePointerCapture?.(pointerId);
    } catch {
      // The browser may already have released capture during pointer cancellation.
    }
  }, []);

  const armClickSuppression = useCallback(() => {
    if (clickSuppressTimerRef.current !== null) window.clearTimeout(clickSuppressTimerRef.current);
    if (clickSuppressListenerRef.current)
      window.removeEventListener("click", clickSuppressListenerRef.current, true);
    const suppressClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.removeEventListener("click", suppressClick, true);
      clickSuppressListenerRef.current = null;
      if (clickSuppressTimerRef.current !== null)
        window.clearTimeout(clickSuppressTimerRef.current);
      clickSuppressTimerRef.current = null;
    };
    clickSuppressListenerRef.current = suppressClick;
    window.addEventListener("click", suppressClick, true);
    clickSuppressTimerRef.current = window.setTimeout(() => {
      window.removeEventListener("click", suppressClick, true);
      clickSuppressListenerRef.current = null;
      clickSuppressTimerRef.current = null;
    }, 500);
  }, []);

  const findDropPosition = useCallback(
    (x: number, y: number, itemId: string): DropPosition | null => {
      const measurements = measurementsRef.current;
      for (const column of latestRef.current.columns) {
        const measurement = measurements.columns.get(column.id);
        if (!measurement || !acceptsDrops(column)) continue;
        if (
          x < measurement.outer.left ||
          x > measurement.outer.right ||
          y < measurement.outer.top ||
          y > measurement.outer.bottom
        )
          continue;
        let index = 0;
        const cardById = new Map(measurement.cards.map((card) => [card.id, card.rect]));
        for (const item of column.items) {
          if (item.id === itemId) continue;
          const rect = cardById.get(item.id);
          if (rect && y >= rect.top + rect.height / 2) index += 1;
          else if (rect) break;
        }
        return { columnId: column.id, index };
      }
      return null;
    },
    [],
  );

  const positionDetails = useCallback(
    (drag: ActiveDrag, position: DropPosition) => {
      const column = getColumn(position.columnId);
      if (!column) return null;
      const total = column.items.filter((item) => item.id !== drag.itemId).length + 1;
      return {
        item: drag.itemLabel,
        column: stableGetColumnLabel(column),
        position: Math.max(0, Math.min(position.index, total - 1)) + 1,
        total,
      };
    },
    [getColumn, stableGetColumnLabel],
  );

  const announceTarget = useCallback(
    (drag: ActiveDrag, position: DropPosition) => {
      const details = positionDetails(drag, position);
      if (!details) return;
      const message =
        drag.fromColumnId === position.columnId
          ? stableLabels.announce.movedWithin(details)
          : stableLabels.announce.movedAcross(details);
      announce(message);
    },
    [announce, positionDetails, stableLabels],
  );

  const updateTarget = useCallback(
    (position: DropPosition | null) => {
      const current = activeDragRef.current;
      if (!current || current.pointerId === null) return;
      const nextColumnId = position?.columnId;
      const nextIndex = position?.index;
      if (current.targetColumnId === nextColumnId && current.targetIndex === nextIndex) return;
      const next = { ...current, targetColumnId: nextColumnId, targetIndex: nextIndex };
      updateActiveDrag(next);
      if (position) announceTarget(next, position);
    },
    [announceTarget, updateActiveDrag],
  );

  const beginPointerDrag = useCallback(
    (pending: PendingGesture, x: number, y: number) => {
      const sourceColumn = getColumn(pending.fromColumnId);
      if (!sourceColumn) {
        pendingGestureRef.current = null;
        releasePointer(pending.pointerId);
        return;
      }
      const measurements = measureAll();
      const sourceMeasurement = measurements.columns.get(pending.fromColumnId);
      const sourceCard = sourceMeasurement?.cards.find((card) => card.id === pending.itemId);
      const rect = sourceCard?.rect ?? {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
      const drag: ActiveDrag = {
        itemId: pending.itemId,
        itemLabel: pending.itemLabel,
        fromColumnId: pending.fromColumnId,
        fromIndex: pending.fromIndex,
        pointerId: pending.pointerId,
        pointerType: pending.pointerType,
        targetColumnId: pending.fromColumnId,
        targetIndex: pending.fromIndex,
        width: rect.width,
        height: rect.height,
        offsetX: x - rect.left,
        offsetY: y - rect.top,
      };
      pendingGestureRef.current = null;
      latestPointerRef.current = { x, y };
      updateActiveDrag(drag);
      announce(
        stableLabels.announce.pickedUp({
          item: drag.itemLabel,
          column: stableGetColumnLabel(sourceColumn),
          position: drag.fromIndex + 1,
          total: sourceColumn.items.length,
        }),
      );
      schedulePreview(x, y);
    },
    [
      announce,
      getColumn,
      measureAll,
      releasePointer,
      schedulePreview,
      stableGetColumnLabel,
      stableLabels,
      updateActiveDrag,
    ],
  );

  const clearDrag = useCallback(
    (pointerId: number | null) => {
      if (previewRafRef.current !== null) {
        window.cancelAnimationFrame(previewRafRef.current);
        previewRafRef.current = null;
      }
      if (pointerId !== null) {
        armClickSuppression();
        releasePointer(pointerId);
      }
      pendingGestureRef.current = null;
      updateActiveDrag(null);
    },
    [armClickSuppression, releasePointer, updateActiveDrag],
  );

  const finishDrop = useCallback(
    (drag: ActiveDrag, position: DropPosition, shouldAnnounceDrop = true) => {
      const sourceColumn = getColumn(drag.fromColumnId);
      const targetColumn = getColumn(position.columnId);
      if (!sourceColumn || !targetColumn || !acceptsDrops(targetColumn)) {
        announce(stableLabels.announce.cancelled({ item: drag.itemLabel }));
        clearDrag(drag.pointerId);
        return;
      }
      const targetItems = targetColumn.items.filter((item) => item.id !== drag.itemId);
      const index = Math.max(0, Math.min(position.index, targetItems.length));
      const sourceIndex = sourceColumn.items.findIndex((item) => item.id === drag.itemId);
      if (sourceIndex < 0) {
        announce(stableLabels.announce.cancelled({ item: drag.itemLabel }));
        clearDrag(drag.pointerId);
        return;
      }
      if (sourceColumn.id !== targetColumn.id || sourceIndex !== index) {
        const accepted = stableMove({
          itemId: drag.itemId,
          fromColumnId: sourceColumn.id,
          toColumnId: targetColumn.id,
          beforeId: targetItems[index - 1]?.id ?? null,
          afterId: targetItems[index]?.id ?? null,
        });
        if (accepted === false) {
          clearDrag(drag.pointerId);
          return;
        }
      }
      const details = {
        item: drag.itemLabel,
        column: stableGetColumnLabel(targetColumn),
        position: index + 1,
        total: targetItems.length + 1,
      };
      announce(
        shouldAnnounceDrop
          ? stableLabels.announce.dropped(details)
          : stableLabels.announce.movedAcross(details),
      );
      clearDrag(drag.pointerId);
    },
    [announce, clearDrag, getColumn, stableGetColumnLabel, stableLabels, stableMove],
  );

  const cancelDrag = useCallback(
    (drag: ActiveDrag) => {
      announce(stableLabels.announce.cancelled({ item: drag.itemLabel }));
      clearDrag(drag.pointerId);
    },
    [announce, clearDrag, stableLabels],
  );

  const onGestureStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, item: T, columnId: string, index: number) => {
      if (latestRef.current.readOnly || event.button !== 0 || event.isPrimary === false) return;
      if (activeDragRef.current || pendingGestureRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      // Portaled content (move menu) bubbles through React but is not part of the card.
      if (!target || !event.currentTarget.contains(target)) return;
      const handle = target.closest<HTMLElement>("[data-kanban-handle]");
      const isHandle = Boolean(handle);
      if (event.pointerType === "touch" && !isHandle) return;
      if (!isHandle && target.closest("a,button,input,textarea,select,[role='button']")) return;
      const element = handle ?? event.currentTarget;
      try {
        element.setPointerCapture?.(event.pointerId);
        captureElementRef.current = element;
      } catch {
        captureElementRef.current = null;
      }
      pendingGestureRef.current = {
        itemId: item.id,
        itemLabel: stableGetItemLabel(item),
        fromColumnId: columnId,
        fromIndex: index,
        pointerId: event.pointerId,
        pointerType: event.pointerType || "mouse",
        startX: event.clientX,
        startY: event.clientY,
        element,
        cardElement: event.currentTarget,
      };
    },
    [stableGetItemLabel],
  );

  const onPendingPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pending = pendingGestureRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY);
      if (distance < 4) return;
      beginPointerDrag(pending, event.clientX, event.clientY);
    },
    [beginPointerDrag],
  );

  const onPendingPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pending = pendingGestureRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      pendingGestureRef.current = null;
      releasePointer(event.pointerId);
    },
    [releasePointer],
  );

  const onKeyboardMove = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, item: T, columnId: string, index: number) => {
      if (latestRef.current.readOnly) return;
      const drag = activeDragRef.current;
      const isPickupKey = event.key === " " || event.key === "Enter";
      if (!drag && isPickupKey) {
        event.preventDefault();
        const column = getColumn(columnId);
        if (!column) return;
        const measurements = measureAll();
        const card = measurements.columns
          .get(columnId)
          ?.cards.find((entry) => entry.id === item.id);
        const next: ActiveDrag = {
          itemId: item.id,
          itemLabel: stableGetItemLabel(item),
          fromColumnId: columnId,
          fromIndex: index,
          pointerId: null,
          targetColumnId: columnId,
          targetIndex: index,
          height: card?.rect.height ?? 0,
        };
        updateActiveDrag(next);
        announce(
          stableLabels.announce.pickedUp({
            item: next.itemLabel,
            column: stableGetColumnLabel(column),
            position: index + 1,
            total: column.items.length,
          }),
        );
        return;
      }
      if (!drag || drag.pointerId !== null || drag.itemId !== item.id) return;
      if (event.key === "Escape") {
        event.preventDefault();
        cancelDrag(drag);
        return;
      }
      if (isPickupKey) {
        event.preventDefault();
        if (drag.targetColumnId !== undefined && drag.targetIndex !== undefined) {
          finishDrop(drag, { columnId: drag.targetColumnId, index: drag.targetIndex });
        } else {
          cancelDrag(drag);
        }
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const currentColumnId = drag.targetColumnId ?? drag.fromColumnId;
      const currentColumn = getColumn(currentColumnId);
      if (!currentColumn) return;
      const currentItems = currentColumn.items.filter(
        (currentItem) => currentItem.id !== drag.itemId,
      );
      let position: DropPosition | null = null;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (!acceptsDrops(currentColumn)) return;
        const currentIndex = drag.targetIndex ?? drag.fromIndex;
        const nextIndex = Math.max(
          0,
          Math.min(currentItems.length, currentIndex + (event.key === "ArrowUp" ? -1 : 1)),
        );
        position = { columnId: currentColumn.id, index: nextIndex };
      } else {
        const currentColumnIndex = latestRef.current.columns.findIndex(
          (candidate) => candidate.id === currentColumn.id,
        );
        const direction = event.key === "ArrowRight" ? 1 : -1;
        for (
          let candidateIndex = currentColumnIndex + direction;
          candidateIndex >= 0 && candidateIndex < latestRef.current.columns.length;
          candidateIndex += direction
        ) {
          const candidate = latestRef.current.columns[candidateIndex]!;
          if (!acceptsDrops(candidate)) continue;
          const candidateItems = candidate.items.filter(
            (candidateItem) => candidateItem.id !== drag.itemId,
          );
          position = { columnId: candidate.id, index: candidateItems.length };
          break;
        }
      }
      if (
        position &&
        (drag.targetColumnId !== position.columnId || drag.targetIndex !== position.index)
      ) {
        const next = { ...drag, targetColumnId: position.columnId, targetIndex: position.index };
        updateActiveDrag(next);
        announceTarget(next, position);
      }
    },
    [
      announce,
      announceTarget,
      cancelDrag,
      finishDrop,
      getColumn,
      measureAll,
      stableGetColumnLabel,
      stableGetItemLabel,
      stableLabels,
      updateActiveDrag,
    ],
  );

  const onKeyboardBlur = useCallback(
    (itemId: string) => {
      const drag = activeDragRef.current;
      if (drag?.pointerId === null && drag.itemId === itemId) cancelDrag(drag);
    },
    [cancelDrag],
  );

  const onMenuMove = useCallback(
    (item: T, sourceColumnId: string, targetColumnId: string) => {
      const sourceColumn = getColumn(sourceColumnId);
      const targetColumn = getColumn(targetColumnId);
      if (!sourceColumn || !targetColumn || !acceptsDrops(targetColumn)) return;
      const targetItems = targetColumn.items.filter((targetItem) => targetItem.id !== item.id);
      const drag: ActiveDrag = {
        itemId: item.id,
        itemLabel: stableGetItemLabel(item),
        fromColumnId: sourceColumn.id,
        fromIndex: sourceColumn.items.findIndex((sourceItem) => sourceItem.id === item.id),
        pointerId: null,
      };
      finishDrop(drag, { columnId: targetColumn.id, index: targetItems.length }, false);
    },
    [finishDrop, getColumn, stableGetItemLabel],
  );

  const handleWindowPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = activeDragRef.current;
      if (!drag || drag.pointerId === null || drag.pointerId !== event.pointerId) return;
      schedulePreview(event.clientX, event.clientY);
      updateTarget(findDropPosition(event.clientX, event.clientY, drag.itemId));
    },
    [findDropPosition, schedulePreview, updateTarget],
  );

  const handleWindowPointerUp = useCallback(
    (event: PointerEvent) => {
      const drag = activeDragRef.current;
      if (!drag || drag.pointerId === null || drag.pointerId !== event.pointerId) return;
      const position = findDropPosition(event.clientX, event.clientY, drag.itemId);
      if (position) finishDrop(drag, position);
      else cancelDrag(drag);
    },
    [cancelDrag, findDropPosition, finishDrop],
  );

  const handleWindowPointerCancel = useCallback(
    (event: PointerEvent) => {
      const drag = activeDragRef.current;
      if (drag?.pointerId === event.pointerId) cancelDrag(drag);
    },
    [cancelDrag],
  );

  const handleWindowKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const drag = activeDragRef.current;
      if (!drag || drag.pointerId === null) return;
      event.preventDefault();
      cancelDrag(drag);
    },
    [cancelDrag],
  );

  const remeasureOnScroll = useCallback(() => {
    if (activeDragRef.current?.pointerId === null || !activeDragRef.current) return;
    measureAll();
    const pointer = latestPointerRef.current;
    const drag = activeDragRef.current;
    updateTarget(findDropPosition(pointer.x, pointer.y, drag.itemId));
  }, [findDropPosition, measureAll, updateTarget]);

  const autoScroll = useCallback(() => {
    const drag = activeDragRef.current;
    const measurements = measurementsRef.current;
    const boardElement = boardRef.current;
    if (!drag || drag.pointerId === null || !boardElement || !measurements.board) return;
    const { x, y } = latestPointerRef.current;
    const edge = 48;
    const maxStep = 16;
    const boardBounds = measurements.board;
    let horizontalDelta = 0;
    if (x < boardBounds.left + edge)
      horizontalDelta = -maxStep * Math.min(1, (boardBounds.left + edge - x) / edge);
    else if (x > boardBounds.right - edge)
      horizontalDelta = maxStep * Math.min(1, (x - (boardBounds.right - edge)) / edge);
    let changed = false;
    if (horizontalDelta !== 0) {
      const before = boardElement.scrollLeft;
      boardElement.scrollLeft += horizontalDelta;
      changed ||= boardElement.scrollLeft !== before;
    }
    for (const measurement of measurements.columns.values()) {
      if (
        x < measurement.outer.left ||
        x > measurement.outer.right ||
        y < measurement.list.top ||
        y > measurement.list.bottom
      )
        continue;
      const list = listElementsRef.current.get(measurement.columnId);
      if (!list) break;
      let verticalDelta = 0;
      if (y < measurement.list.top + edge)
        verticalDelta = -maxStep * Math.min(1, (measurement.list.top + edge - y) / edge);
      else if (y > measurement.list.bottom - edge)
        verticalDelta = maxStep * Math.min(1, (y - (measurement.list.bottom - edge)) / edge);
      if (verticalDelta !== 0) {
        const before = list.scrollTop;
        list.scrollTop += verticalDelta;
        changed ||= list.scrollTop !== before;
      }
      break;
    }
    if (changed) remeasureOnScroll();
  }, [remeasureOnScroll]);

  useEffect(() => {
    if (!isPointerDragActive) return undefined;
    const boardElement = boardRef.current;
    const listElements = Array.from(listElementsRef.current.values());
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerCancel);
    window.addEventListener("keydown", handleWindowKeyDown);
    // Native text selection would highlight the whole board while dragging.
    const blockSelection = (event: Event) => event.preventDefault();
    document.addEventListener("selectstart", blockSelection);
    window.getSelection()?.removeAllRanges();
    boardElement?.addEventListener("scroll", remeasureOnScroll);
    for (const list of listElements) list.addEventListener("scroll", remeasureOnScroll);
    let frame = 0;
    const tick = () => {
      autoScroll();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
      window.removeEventListener("keydown", handleWindowKeyDown);
      document.removeEventListener("selectstart", blockSelection);
      boardElement?.removeEventListener("scroll", remeasureOnScroll);
      for (const list of listElements) list.removeEventListener("scroll", remeasureOnScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [
    autoScroll,
    handleWindowKeyDown,
    handleWindowPointerCancel,
    handleWindowPointerMove,
    handleWindowPointerUp,
    isPointerDragActive,
    remeasureOnScroll,
  ]);

  useEffect(
    () => () => {
      if (previewRafRef.current !== null) window.cancelAnimationFrame(previewRafRef.current);
      if (clickSuppressTimerRef.current !== null)
        window.clearTimeout(clickSuppressTimerRef.current);
      if (clickSuppressListenerRef.current)
        window.removeEventListener("click", clickSuppressListenerRef.current, true);
    },
    [],
  );

  const activeItem = activeDrag
    ? latestRef.current.columns
        .flatMap((column) => column.items)
        .find((item) => item.id === activeDrag.itemId)
    : undefined;
  const columnChildren = columns.map((column) => {
    const targetIndex =
      activeDrag?.targetColumnId === column.id && activeDrag.targetIndex !== undefined
        ? activeDrag.targetIndex
        : null;
    const isSourceColumn = activeDrag?.fromColumnId === column.id;
    return (
      <KanbanColumnView
        key={column.id}
        column={column}
        moveTargets={moveTargetsByColumn.get(column.id) ?? []}
        targetIndex={targetIndex}
        placeholderHeight={targetIndex !== null ? (activeDrag?.height ?? 0) : 0}
        draggedItemId={isSourceColumn ? (activeDrag?.itemId ?? null) : null}
        keyboardItemId={isSourceColumn && activeDrag?.pointerId === null ? activeDrag.itemId : null}
        configurationToken={latest.token}
        renderItem={stableRenderItem}
        getItemLabel={stableGetItemLabel}
        getColumnLabel={stableGetColumnLabel}
        labels={stableLabels}
        readOnly={readOnly}
        onGestureStart={onGestureStart}
        onKeyboardMove={onKeyboardMove}
        onKeyboardBlur={onKeyboardBlur}
        onMenuMove={onMenuMove}
        onColumnElement={setColumnElement}
        onListElement={setListElement}
      />
    );
  });

  return (
    <>
      <div
        ref={boardRef}
        role="region"
        aria-label={labels.board}
        className={cn(
          "flex h-full min-h-0 min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:snap-none",
          className,
        )}
        onPointerMove={onPendingPointerMove}
        onPointerUp={onPendingPointerUp}
        onPointerCancel={onPendingPointerUp}
      >
        <LiveRegion ref={liveRegionRef} />
        {columnChildren}
      </div>
      {activeDrag?.pointerId !== null && activeDrag && activeItem && typeof document !== "undefined"
        ? createPortal(
            <KanbanPreview
              item={activeItem}
              renderItem={stableRenderItem}
              width={activeDrag.width ?? 0}
              onElement={setPreviewElement}
            />,
            document.body,
          )
        : null}
    </>
  );
}

export function KanbanBoardSkeleton({
  columns = 3,
  cardsPerColumn = 3,
  label,
}: KanbanBoardSkeletonProps): JSX.Element {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex h-full min-h-0 min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:snap-none"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: Math.max(0, columns) }, (_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex h-full max-h-full min-h-0 w-72 shrink-0 snap-start flex-col gap-3 rounded-md border border-border bg-surface-subtle p-3"
        >
          <div className="flex shrink-0 items-start justify-between gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="size-7" />
          </div>
          <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto">
            {Array.from({ length: Math.max(0, cardsPerColumn) }, (_, cardIndex) => (
              <div key={cardIndex} className="rounded-md border border-border bg-surface p-3">
                <Skeleton className="mb-3 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
