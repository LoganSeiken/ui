import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Checkbox,
  Code,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Indicator,
  Input,
  Kbd,
  RadioCard,
  RadioGroup,
  RadioGroupItem,
  StatusDot,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem
} from "../../index.js";

describe("Button", () => {
  it("renders an accessible button that defaults to type=button", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls onClick and ignores clicks when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled and busy while loading", () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("applies the 24/32/40 size scale", () => {
    render(
      <>
        <Button size="sm">a</Button>
        <Button size="md">b</Button>
        <Button size="lg">c</Button>
      </>
    );
    expect(screen.getByText("a")).toHaveClass("h-6");
    expect(screen.getByText("b")).toHaveClass("h-8");
    expect(screen.getByText("c")).toHaveClass("h-10");
  });

  it("exposes the pressed state through aria-pressed", () => {
    render(<Button variant="ghost" size="icon" aria-label="Toggle" aria-pressed />);
    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Input", () => {
  it("accepts typing and honors the disabled state", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input aria-label="Name" />);
    await user.type(screen.getByLabelText("Name"), "Ada");
    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
    rerender(<Input aria-label="Name" disabled />);
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });

  it("supports the sm and md heights and invalid state", () => {
    render(
      <>
        <Input aria-label="sm" size="sm" />
        <Input aria-label="md" aria-invalid />
      </>
    );
    expect(screen.getByLabelText("sm")).toHaveClass("h-8");
    expect(screen.getByLabelText("md")).toHaveClass("h-10");
    expect(screen.getByLabelText("md")).toBeInvalid();
  });
});

describe("Badge, Kbd, Code", () => {
  it("renders every badge variant with its semantic tint", () => {
    render(
      <>
        <Badge variant="success">ok</Badge>
        <Badge variant="warning">warn</Badge>
        <Badge variant="danger">bad</Badge>
        <Badge variant="success-outline">new</Badge>
      </>
    );
    expect(screen.getByText("ok")).toHaveClass("bg-success-subtle");
    expect(screen.getByText("warn")).toHaveClass("bg-warning-subtle");
    expect(screen.getByText("bad")).toHaveClass("bg-destructive-subtle");
    expect(screen.getByText("new")).toHaveClass("border-chart-success");
  });

  it("switches between pill and square shapes", () => {
    render(<><Badge>pill</Badge><Badge shape="square">sq</Badge></>);
    expect(screen.getByText("pill")).toHaveClass("rounded-pill");
    expect(screen.getByText("sq")).toHaveClass("rounded-sm");
  });

  it("renders semantic kbd and code elements", () => {
    render(<><Kbd>⌘K</Kbd><Code>4347a66e</Code></>);
    expect(screen.getByText("⌘K").tagName).toBe("KBD");
    expect(screen.getByText("4347a66e").tagName).toBe("CODE");
  });
});

describe("StatusDot and Indicator", () => {
  it("is an image with a label when labelled and hidden otherwise", () => {
    const { rerender } = render(<StatusDot status="success" label="Operational" />);
    expect(screen.getByRole("img", { name: "Operational" })).toBeInTheDocument();
    rerender(<StatusDot status="danger" data-testid="dot" />);
    expect(screen.getByTestId("dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the notification dot only when requested and announces it", () => {
    const { rerender } = render(<Indicator label="3 unread"><button type="button">Bell</button></Indicator>);
    expect(screen.getByRole("status", { name: "3 unread" })).toBeInTheDocument();
    rerender(<Indicator show={false} label="3 unread"><button type="button">Bell</button></Indicator>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("Table", () => {
  function Sample({ variant }: { variant?: "default" | "grid" }) {
    return (
      <Table variant={variant}>
        <TableHeader>
          <TableRow><TableHead variant="plain">Email</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>ana@example.com</TableCell></TableRow>
        </TableBody>
        <TableFooter>
          <TableRow><TableCell>Total: 1</TableCell></TableRow>
        </TableFooter>
      </Table>
    );
  }

  it("exposes table semantics with column headers", () => {
    render(<Sample />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "ana@example.com" })).toBeInTheDocument();
  });

  it("uses the dense 36px header for the plain variant and the caps header by default", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead variant="plain">plain</TableHead>
            <TableHead>caps</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText("plain")).toHaveClass("h-9");
    expect(screen.getByText("caps")).toHaveClass("h-10", "uppercase");
  });

  it("adds column dividers in the grid variant", () => {
    render(<Sample variant="grid" />);
    expect(screen.getByRole("table")).toHaveClass("[&_td]:border-r");
  });
});

describe("Avatar", () => {
  it("shows the fallback when there is no image", () => {
    render(<Avatar><AvatarFallback>CB</AvatarFallback></Avatar>);
    expect(screen.getByText("CB")).toBeInTheDocument();
  });
});

describe("Switch", () => {
  it("toggles with click and with the Space key", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Read-only" />);
    const sw = screen.getByRole("switch", { name: "Read-only" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    sw.focus();
    await user.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Locked" disabled />);
    await user.click(screen.getByRole("switch", { name: "Locked" }));
    expect(screen.getByRole("switch", { name: "Locked" })).toHaveAttribute("aria-checked", "false");
  });
});

describe("Checkbox", () => {
  it("toggles checked state and reports it to assistive tech", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Select all" />);
    const box = screen.getByRole("checkbox", { name: "Select all" });
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(box);
    expect(box).not.toBeChecked();
  });

  it("supports the indeterminate state", () => {
    render(<Checkbox aria-label="Some" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Some" })).toHaveAttribute("aria-checked", "mixed");
  });
});

describe("RadioGroup and RadioCard", () => {
  it("selects an option by click and keeps a single selection", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Options" defaultValue="a">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>
    );
    await user.click(screen.getByRole("radio", { name: "B" }));
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
  });

  it("renders cards with title and description and selects on click", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Connection" defaultValue="direct" variant="joined">
        <RadioCard value="direct" title="Direct connection" description="Long-lived connections" />
        <RadioCard value="pooler" title="Transaction pooler" description="Serverless functions" />
      </RadioGroup>
    );
    expect(screen.getByText("Long-lived connections")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Transaction pooler/ }));
    expect(screen.getByRole("radio", { name: /Transaction pooler/ })).toBeChecked();
    expect(screen.getByRole("radiogroup", { name: "Connection" })).toHaveAttribute("data-variant", "joined");
  });
});

describe("ToggleGroup", () => {
  it("switches the active item", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" defaultValue="grid" aria-label="View">
        <ToggleGroupItem value="grid" aria-label="Grid" />
        <ToggleGroupItem value="list" aria-label="List" />
      </ToggleGroup>
    );
    await user.click(screen.getByRole("radio", { name: "List" }));
    expect(screen.getByRole("radio", { name: "List" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Grid" })).not.toBeChecked();
  });
});

describe("Collapsible", () => {
  it("expands and collapses its content from the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Private</CollapsibleTrigger>
        <CollapsibleContent>Saved query</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole("button", { name: "Private" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Saved query")).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(document.body).getByText("Saved query")).toBeVisible();
  });
});
