import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, Callout, Combobox, ConfirmActionForm, ConfirmDialog, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, EmptyState, FocusOnInvalid, Pagination, Skeleton, Spinner, SubmitButton, TableSkeleton, Textarea, Toaster, toast } from "../../index.js";

describe("form and feedback components", () => {
  it("keeps the neutral callout presentation and assigns alert semantics to danger", () => {
    const { rerender } = render(<Callout title="Neutral" data-testid="callout" />);
    expect(screen.getByTestId("callout")).toHaveClass("bg-surface-subtle", "border-border");
    expect(screen.getByTestId("callout")).not.toHaveAttribute("role");
    rerender(<Callout title="Danger" variant="danger" />);
    expect(screen.getByRole("alert")).toHaveClass("bg-destructive-subtle");
  });

  it("renders labeled and decorative spinners and skeleton table rows", () => {
    const { rerender } = render(<Spinner />);
    expect(document.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Spinner label="Loading" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    rerender(<><Skeleton data-testid="skeleton" /><TableSkeleton columns={2} rows={3} headers={["Name", "Email"]} label="Loading table" /></>);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("tracks textarea character counts in uncontrolled and controlled modes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Textarea aria-label="Note" showCount maxLength={12} defaultValue="Hi" />);
    await user.type(screen.getByRole("textbox"), "!");
    expect(screen.getByText("3 / 12")).toBeInTheDocument();
    rerender(<Textarea aria-label="Note" showCount maxLength={12} value="hello" onChange={onChange} aria-invalid="true" />);
    expect(screen.getByText("5 / 12")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    rerender(<Textarea aria-label="No count" />);
    expect(screen.queryByText(/\/ 12/)).not.toBeInTheDocument();
  });

  it("opens a dialog with accessible title and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Dialog title</DialogTitle></DialogHeader></DialogContent></Dialog>);
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Dialog title" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("confirms once, supports cancel, external forms, and safe destructive focus", async () => {
    const user = userEvent.setup(); const onConfirm = vi.fn();
    const { rerender } = render(<ConfirmDialog trigger={<Button>Open</Button>} title="Remove item" onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    rerender(<ConfirmDialog trigger={<Button>Open delete</Button>} title="Delete?" variant="destructive" />);
    await user.click(screen.getByRole("button", { name: "Open delete" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form id="external" onSubmit={submit}><ConfirmDialog trigger={<Button>External</Button>} title="Submit?" confirmFormId="external" /></form>);
    await user.click(screen.getByRole("button", { name: "External" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("keeps a pending confirmation open and disables every dismissal control", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ConfirmDialog trigger={<Button>Open pending</Button>} title="Pending action" pending />);
    await user.click(screen.getByRole("button", { name: "Open pending" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Close" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
    fireEvent.pointerDown(document.body);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "Pending action" })).toBeInTheDocument();

    rerender(<ConfirmDialog trigger={<Button>Open pending</Button>} title="Pending action" />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the action form outside the dialog and supports hidden fields", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async (_previous, formData: FormData) => ({ status: "success" as const, message: formData.get("recordId") === "r1" ? "Archived" : "Wrong record" }));
    render(<ConfirmActionForm action={action} hiddenFields={{ recordId: "r1" }} labels={{ trigger: <Button type="button">Archive</Button>, title: "Archive?", confirm: "Confirm", cancel: "Cancel", close: "Close", pending: "Working…", success: "Success", error: "Error" }} />);
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(await screen.findByText("Archived")).toBeInTheDocument();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("renders multiple empty-state actions through the actions slot", () => {
    render(<EmptyState title="Nothing here" actions={<><Button type="button">Create</Button><Button type="button" variant="outline">Import</Button></>} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
  });

  it("paginates with links and button callbacks and clamps the current page", async () => {
    const user = userEvent.setup(); const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={0} pageCount={4} hrefFor={(p) => `?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "?page=2");
    expect(screen.getByRole("navigation")).toHaveTextContent("Page 1 of 4");
    expect(screen.getByText("Previous").closest("span")).toHaveAttribute("aria-disabled", "true");
    rerender(<Pagination page={4} pageCount={4} onPageChange={onPageChange} labels={{ previous: "Back", next: "Forward", nav: "Pages" }} />);
    expect(screen.getByRole("navigation", { name: "Pages" })).toHaveTextContent("Page 4 of 4");
    expect(screen.getByText("Forward").closest("span")).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    rerender(<Pagination page={1} pageCount={1} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("supports combobox filtering, keyboard selection, clear, hidden fields and accent normalization", async () => {
    const user = userEvent.setup(); const onValueChange = vi.fn();
    render(<Combobox name="country" options={[{ value: "pe", label: "Perú" }, { value: "ca", label: "Canada" }]} clearLabel="Clear" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "Peru");
    expect(screen.getByRole("option", { name: "Perú" })).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("pe");
    expect(screen.getByRole("combobox")).toHaveTextContent("Perú");
    expect(document.querySelector<HTMLInputElement>('input[name="country"]')).toHaveValue("pe");
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Clear" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("supports external combobox filtering, Escape focus restoration and disabled state", async () => {
    const user = userEvent.setup(); const onQueryChange = vi.fn();
    render(<Combobox options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} onQueryChange={onQueryChange} disabled={false} />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.type(screen.getByPlaceholderText("Search..."), "Al");
    expect(onQueryChange).toHaveBeenCalled();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    render(<Combobox options={[]} disabled />);
    expect(screen.getAllByRole("combobox")[1]).toBeDisabled();
  });

  it("opens the combobox by Enter, Space, or ArrowDown and exposes listbox options", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Combobox options={[{ value: "a", label: "Alpha" }]} />);
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "false");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    unmount();
    render(<Combobox options={[]} disabled />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("announces, closes and stacks imperative toasts", async () => {
    const user = userEvent.setup();
    render(<Toaster duration={Infinity} label="Notifications" closeLabel="Close" viewportLabel="Notifications ({hotkey})" />);
    toast({ title: "Saved" }); toast({ title: "Failed", variant: "danger" });
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(await screen.findByText("Failed")).toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(screen.getAllByRole("status")[1]).toHaveAttribute("aria-live", "assertive");
    await user.click(screen.getAllByRole("button", { name: "Close" })[0]);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("focuses the first invalid field only when requested", () => {
    const { rerender } = render(<form><input aria-invalid="true" aria-label="First" /><input aria-invalid="true" aria-label="Second" /><FocusOnInvalid when={false} /></form>);
    expect(screen.getByLabelText("First")).not.toHaveFocus();
    rerender(<form><input aria-invalid="true" aria-label="First" /><input aria-invalid="true" aria-label="Second" /><FocusOnInvalid when={1} /></form>);
    expect(screen.getByLabelText("First")).toHaveFocus();
  });

  it("disables the submit button while a form action is pending", async () => {
    let finish!: () => void;
    const action = () => new Promise<void>((resolve) => { finish = resolve; });
    const user = userEvent.setup();
    render(<form action={action}><SubmitButton pendingText="Saving...">Save</SubmitButton></form>);
    const button = screen.getByRole("button", { name: "Save" });
    await user.click(button);
    expect(await screen.findByRole("button", { name: "Saving..." })).toBeDisabled();
    finish();
    expect(await screen.findByRole("button", { name: "Save" })).toBeEnabled();
  });
});
