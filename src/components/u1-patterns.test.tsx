import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AccountMenuActionItem,
  AccountMenu,
  ActionFeedback,
  AsyncCombobox,
  Callout,
  FileInput,
  Field,
  LinkButton,
  MessageBubble,
  MessageThread,
  SidebarNav,
  Slider,
  SystemEventRow,
} from "../index.js";

describe("U1 shared patterns", () => {
  it("adds callout descriptions while ignoring legacy children", () => {
    render(
      <Callout title="Saved" description="Visible to operators">
        legacy child
      </Callout>,
    );
    expect(screen.getByText("Visible to operators")).toBeInTheDocument();
    expect(screen.queryByText("legacy child")).not.toBeInTheDocument();
  });

  it("keeps action feedback mounted with the right announcement role", () => {
    const { rerender } = render(
      <ActionFeedback
        status="pending"
        pendingLabel="Saving"
        successTitle="Saved"
        errorTitle="Failed"
        message="Saving"
      />,
    );
    expect(screen.getAllByText("Saving").length).toBeGreaterThan(0);
    rerender(
      <ActionFeedback
        status="success"
        pendingLabel="Saving"
        successTitle="Saved"
        errorTitle="Failed"
        message="Saved"
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    rerender(
      <ActionFeedback
        status="error"
        pendingLabel="Saving"
        successTitle="Saved"
        errorTitle="Failed"
        message="Failed"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it("renders responsive navigation and avoids false prefix matches", () => {
    render(
      <SidebarNav
        ariaLabel="Primary"
        pathname="/services-archive"
        items={[
          {
            href: "/services",
            label: "Services",
            icon: <span aria-hidden="true">S</span>,
            match: "prefix",
          },
          {
            href: "/services-archive",
            label: "Archive",
            icon: <span aria-hidden="true">A</span>,
            match: "exact",
          },
        ]}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links[0]).not.toHaveAttribute("aria-current");
    expect(links[1]).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("navigation")).toHaveLength(2);
  });

  it("submits the owner form from a menu action before the menu unmounts", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <>
        <form id="sign-out" onSubmit={submit} />
        <AccountMenu label="Account menu" email="owner@example.com">
          <AccountMenuActionItem formId="sign-out" label="Sign out" />
        </AccountMenu>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Account menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("provides accessible message and system event presentation", () => {
    render(
      <MessageThread ariaLabel="Conversation">
        <MessageBubble
          direction="inbound"
          author="Customer"
          timestamp="10:00"
          deliveryStatus="Received"
          body={"Line one\nLine two"}
        />
        <SystemEventRow timestamp="10:01">Contact blocked</SystemEventRow>
      </MessageThread>,
    );
    expect(screen.getByRole("log", { name: "Conversation" })).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByText(/Line one/)).toHaveTextContent("Line two");
    expect(screen.getByText("Received")).toHaveClass("border-border");
  });

  it("keeps link-button semantics and removes navigation when disabled", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <LinkButton href="/settings" disabled onClick={click}>
        Settings
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    await user.click(link);
    expect(click).not.toHaveBeenCalled();
  });

  it("uses native file input semantics and renders selected filenames", () => {
    render(
      <FileInput
        id="attachment"
        name="attachment"
        chooseLabel="Choose file"
        noFileLabel="No file"
      />,
    );
    const input = document.querySelector<HTMLInputElement>("#attachment")!;
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("hello.txt")).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "attachment");
  });

  it("inherits Field description semantics through the file control", () => {
    render(
      <Field htmlFor="file" label="Knowledge file" description="Approved customer information">
        <FileInput id="file" name="file" chooseLabel="Choose" noFileLabel="None" />
      </Field>,
    );
    expect(screen.getByLabelText("Knowledge file")).toHaveAttribute(
      "aria-describedby",
      "file-description",
    );
  });

  it("snaps slider values to the declared steps and exposes the label", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="Priority"
        name="priority"
        steps={[
          { value: 0, label: "Low" },
          { value: 50, label: "Medium" },
          { value: 100, label: "High" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Priority" });
    expect(slider).toHaveAttribute("aria-valuetext", "Low");
    fireEvent.change(slider, { target: { value: "51" } });
    expect(onValueChange).toHaveBeenCalledWith(50);
    expect(document.querySelector<HTMLInputElement>('input[name="priority"]')).toHaveValue("50");
  });
});

describe("AsyncCombobox", () => {
  it("debounces requests, aborts the previous query, keeps selection and supports create", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const resolvers: Array<(options: { value: string; label: string }[]) => void> = [];
      const signals: AbortSignal[] = [];
      const fetcher = vi.fn((_query: string, signal: AbortSignal) => {
        signals.push(signal);
        return new Promise<{ value: string; label: string }[]>((resolve) =>
          resolvers.push(resolve),
        );
      });
      render(
        <AsyncCombobox
          placeholder="Select"
          searchPlaceholder="Search..."
          emptyText="No results"
          loadingLabel="Loading"
          name="person"
          defaultValue="selected"
          selectedOption={{ value: "selected", label: "Selected" }}
          allowCreate
          createLabel={(query) => `Create “${query}”`}
          debounceMs={250}
          defaultOpen
          fetcher={fetcher}
        />,
      );
      const search = screen.getByPlaceholderText("Search...");
      fireEvent.change(search, { target: { value: "al" } });
      vi.advanceTimersByTime(249);
      expect(fetcher).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fetcher).toHaveBeenCalledTimes(1);
      fireEvent.change(search, { target: { value: "ali" } });
      expect(signals[0]?.aborted).toBe(true);
      vi.advanceTimersByTime(250);
      expect(fetcher).toHaveBeenCalledTimes(2);
      await act(async () => {
        resolvers[1]!([{ value: "alice", label: "Alice" }]);
        await Promise.resolve();
      });
      expect(screen.getByRole("option", { name: "Alice" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Selected" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Create “ali”" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("surfaces fetch failures in the open list", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("network");
    });
    render(
      <AsyncCombobox
        placeholder="Select"
        searchPlaceholder="Search..."
        emptyText="No results"
        loadingLabel="Loading"
        defaultOpen
        errorText="Unable to load options"
        fetcher={fetcher}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "x" } });
    await waitFor(
      () => expect(screen.getByRole("alert")).toHaveTextContent("Unable to load options"),
      { timeout: 1000 },
    );
  });
});
