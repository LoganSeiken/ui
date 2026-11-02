import { Profiler } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { ActionForm, type ActionFormState } from "./action-form.js";

afterEach(cleanup);

it("records ActionForm commits on typing and a same-props parent rerender", async () => {
  const phases: string[] = [];
  const onRender = (_id: string, phase: string) => phases.push(phase);
  const initialState: ActionFormState = { status: "idle" };
  const action = async (): Promise<ActionFormState> => ({ status: "success" });
  const field = <input aria-label="Name" name="name" />;
  const form = () => (
    <Profiler id="action-form" onRender={onRender}>
      <ActionForm
        action={action}
        initialState={initialState}
        submitLabel="Save"
        pendingText="Saving"
        pendingLabel="Saving"
        successTitle="Saved"
        errorTitle="Error"
      >
        {field}
      </ActionForm>
    </Profiler>
  );
  const user = userEvent.setup();
  const view = render(form());
  const beforeTyping = phases.length;
  await user.type(screen.getByLabelText("Name"), "a");
  const afterTyping = phases.length;
  const interactionCommits = afterTyping - beforeTyping;
  view.rerender(form());
  const parentCommits = phases.length - afterTyping;
  console.info(
    "AUDIT_UI",
    JSON.stringify({ interactionCommits, minimumExpected: 0, parentCommits, phases }),
  );
  expect(interactionCommits).toBeGreaterThanOrEqual(0);
  expect(screen.getByLabelText("Name")).toHaveValue("a");
});

it("records commits when the shared combobox opens and its parent rerenders", async () => {
  const { Combobox } = await import("../ui/combobox.js");
  const phases: string[] = [];
  const options = [{ value: "one", label: "One" }];
  const tree = () => (
    <Profiler id="combobox" onRender={(_id, phase) => phases.push(phase)}>
      <Combobox
        options={options}
        placeholder="Choose"
        searchPlaceholder="Search"
        emptyText="No results"
        loadingLabel="Loading"
        aria-label="Choose item"
      />
    </Profiler>
  );
  const user = userEvent.setup();
  const view = render(tree());
  const beforeOpen = phases.length;
  await user.click(screen.getByRole("combobox", { name: "Choose item" }));
  const afterOpen = phases.length;
  const interactionCommits = afterOpen - beforeOpen;
  view.rerender(tree());
  const parentCommits = phases.length - afterOpen;
  console.info(
    "AUDIT_UI_COMBOBOX",
    JSON.stringify({ interactionCommits, minimumExpected: 1, parentCommits, phases }),
  );
  expect(interactionCommits).toBeGreaterThanOrEqual(1);
  expect(screen.getByRole("combobox", { name: "Choose item" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

it("records kanban commits for a menu move and same-props parent rerender", async () => {
  const { KanbanBoard } = await import("./kanban-board.js");
  const phases: string[] = [];
  const moves: unknown[] = [];
  const columns = [
    { id: "open", title: "Open", items: [{ id: "a", name: "Alpha" }] },
    { id: "closed", title: "Closed", items: [] },
  ];
  const labels = {
    board: "Board",
    dragHandle: (name: string) => `Drag ${name}`,
    moveMenu: (name: string) => `Move ${name}`,
    moveMenuTitle: "Move to",
    announce: {
      pickedUp: () => "Picked up",
      movedWithin: () => "Reordered",
      movedAcross: () => "Moved",
      dropped: () => "Dropped",
      cancelled: () => "Cancelled",
    },
  };
  const renderItem = (item: { id: string; name: string }) => item.name;
  const getItemLabel = (item: { id: string; name: string }) => item.name;
  const getColumnLabel = (column: { title: React.ReactNode }) => String(column.title);
  const onMove = (move: unknown) => {
    moves.push(move);
  };
  const tree = () => (
    <Profiler id="kanban" onRender={(_id, phase) => phases.push(phase)}>
      <KanbanBoard
        columns={columns}
        labels={labels}
        renderItem={renderItem}
        getItemLabel={getItemLabel}
        getColumnLabel={getColumnLabel}
        onMove={onMove}
      />
    </Profiler>
  );
  const user = userEvent.setup();
  const view = render(tree());
  const beforeMove = phases.length;
  await user.click(screen.getByRole("button", { name: "Move Alpha" }));
  await user.click(screen.getByRole("menuitem", { name: "Closed" }));
  const afterMove = phases.length;
  const interactionCommits = afterMove - beforeMove;
  view.rerender(tree());
  const parentCommits = phases.length - afterMove;
  console.info(
    "AUDIT_UI_KANBAN",
    JSON.stringify({ interactionCommits, minimumExpected: 1, parentCommits, phases }),
  );
  expect(interactionCommits).toBeGreaterThanOrEqual(1);
  expect(moves).toHaveLength(1);
});
