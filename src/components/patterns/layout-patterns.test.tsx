import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import {
  AccountMenu,
  Button,
  DropdownMenuItem,
  Field,
  FilterCard,
  FormActions,
  FormCard,
  FormSection,
  Input,
  ListItem,
  Section,
  TableCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../index.js";

function CustomForm(props: ComponentProps<"form">) {
  return <form {...props} data-testid="custom-form" />;
}

describe("TableCard", () => {
  it("renders children inside an overflow-hidden card", () => {
    render(<TableCard data-testid="table-card"><span>Rows</span></TableCard>);
    expect(screen.getByText("Rows")).toBeInTheDocument();
    expect(screen.getByTestId("table-card")).toHaveClass("overflow-hidden");
  });

  it("preserves base classes when an extra class is supplied", () => {
    render(<TableCard data-testid="table-card" className="max-w-3xl"><span>Rows</span></TableCard>);
    expect(screen.getByTestId("table-card")).toHaveClass("rounded-md", "border-border", "bg-surface", "overflow-hidden", "max-w-3xl");
  });

  it("composes a complete table with its header and rows", () => {
    render(
      <TableCard>
        <Table aria-label="Members"><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Alex</TableCell></TableRow></TableBody></Table>
      </TableCard>
    );
    expect(screen.getByRole("table", { name: "Members" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alex" })).toBeInTheDocument();
  });
});

describe("FilterCard", () => {
  it("renders as a form and shows the actions separator when actions are present", () => {
    const { container } = render(
      <FilterCard aria-label="Filters" actions={<Button>Apply</Button>}><Field label="Name"><Input /></Field></FilterCard>
    );
    expect(screen.getByRole("form", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    expect(container.querySelector("form > div.border-t")).toBeInTheDocument();
  });

  it("stacks fields below md and wraps them in a row from md", () => {
    const { container } = render(<FilterCard><Field label="Name"><Input /></Field></FilterCard>);
    expect(container.querySelector("form > div")).toHaveClass("grid", "md:flex", "md:flex-wrap");
  });

  it("does not render a second row without actions", () => {
    const { container } = render(<FilterCard><Field label="Name"><Input /></Field></FilterCard>);
    expect(container.querySelector("form")?.children).toHaveLength(1);
    expect(container.querySelector("form > div.border-t")).toBeNull();
  });

  it("renders through a supplied form component and forwards its props", () => {
    render(<FilterCard formComponent={CustomForm} aria-label="Custom filters"><Field label="Name"><Input /></Field></FilterCard>);
    expect(screen.getByTestId("custom-form")).toHaveAttribute("aria-label", "Custom filters");
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
});

describe("ListItem", () => {
  it("uses a link root with implied interaction when href is provided", () => {
    render(<ListItem href="/docs" title="Docs" description="Browse guides" />);
    const link = screen.getByRole("link", { name: /Docs.*Browse guides/ });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("cursor-pointer", "focus-visible:ring-2", "focus-visible:ring-ring");
  });

  it("keeps a static div root when href is omitted", () => {
    const { container } = render(<ListItem title="Static row" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("Section", () => {
  it("names its section landmark and applies the separated border", () => {
    render(<Section title="Company contacts" separated><span>Contact rows</span></Section>);
    expect(screen.getByRole("region", { name: "Company contacts" })).toHaveClass("border-t", "border-border", "pt-6");
    expect(screen.getByRole("heading", { level: 2, name: "Company contacts" })).toBeInTheDocument();
  });
});

describe("FormCard patterns", () => {
  it("uses a two-column grid and omits an empty heading", () => {
    const { container } = render(<FormCard><FormSection columns={2}><span>First</span><span>Second</span></FormSection></FormCard>);
    expect(container.querySelector("section > div")).toHaveClass("md:grid-cols-2");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders form sections and right-aligns form actions", () => {
    render(
      <FormCard><FormSection title="Details" description="Company information"><Field label="Name"><Input /></Field></FormSection><FormActions data-testid="form-actions"><Button>Save</Button></FormActions></FormCard>
    );
    expect(screen.getByRole("heading", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("Company information")).toBeInTheDocument();
    expect(screen.getByTestId("form-actions")).toHaveClass("justify-end");
    expect(screen.getByTestId("form-actions")).not.toHaveClass("border-t");
  });
});

describe("AccountMenu", () => {
  it("opens on click and shows the account name, email, extra items and avatar initial", async () => {
    const user = userEvent.setup();
    render(<AccountMenu name="Alex Morgan" email="alex@example.com" label="Account menu"><DropdownMenuItem>Profile</DropdownMenuItem></AccountMenu>);
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(within(trigger).getByText("A")).toBeInTheDocument();
    expect(within(trigger).getByText("A").parentElement).toHaveClass("size-8", "border");
    await user.click(trigger);
    expect(await screen.findByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Profile" })).toBeInTheDocument();
  });

  it("opens with Enter, uses the email initial without a name, and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<AccountMenu email="zoe@example.com" label="Account menu" />);
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(within(trigger).getByText("Z")).toBeInTheDocument();
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("zoe@example.com")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("uses the name initial when one is provided", () => {
    render(<AccountMenu name="sam lee" email="sam@example.com" label="Account menu" />);
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(within(trigger).getByText("S")).toBeInTheDocument();
    expect(trigger).toHaveClass("rounded-pill");
  });
});
