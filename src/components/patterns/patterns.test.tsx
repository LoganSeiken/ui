import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Button,
  ButtonGroup,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartTile,
  CodeBlock,
  ContextBreadcrumb,
  EmptyState,
  Field,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  ListItem,
  MiniBarChart,
  SearchInput,
  SortableHead,
  StatTile,
  Step,
  Steps,
  TileGrid,
  Toolbar,
  ToolbarSpacer
} from "../../index.js";

describe("Field", () => {
  it("associates the label with its control", () => {
    render(<Field label="Search name" htmlFor="f1"><Input id="f1" /></Field>);
    expect(screen.getByLabelText("Search name")).toBeInTheDocument();
  });

  it("shows the description and announces errors", () => {
    render(
      <Field label="Name" htmlFor="f2" description="Visible to admins" error="Required">
        <Input id="f2" />
      </Field>
    );
    expect(screen.getByText("Visible to admins")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("lays label and control side by side in the horizontal orientation", () => {
    const { container } = render(<Field label="Client" orientation="horizontal" htmlFor="f3"><Input id="f3" /></Field>);
    expect(container.firstElementChild).toHaveClass("sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]");
  });
});

describe("SearchInput and InputGroup", () => {
  it("is a search field and renders trailing content", () => {
    render(<SearchInput aria-label="Search" trailing={<kbd>⌘K</kbd>} />);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("combines an addon and an input in one control", async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupAddon>Email address</InputGroupAddon>
        <InputGroupInput aria-label="Search by email" />
      </InputGroup>
    );
    await user.type(screen.getByLabelText("Search by email"), "ana");
    expect(screen.getByLabelText("Search by email")).toHaveValue("ana");
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("composes header, content and footer", () => {
    render(
      <Card>
        <CardHeader><CardTitle>Title</CardTitle><CardDescription>Desc</CardDescription></CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Foot")).toBeInTheDocument();
  });

  it("supports the dashed variant", () => {
    render(<Card variant="dashed" data-testid="card">x</Card>);
    expect(screen.getByTestId("card")).toHaveClass("border-dashed");
  });
});

describe("StatTile and ChartTile", () => {
  it("shows label and value and only draws a chevron when interactive", () => {
    const { container, rerender } = render(<StatTile label="CPU" value="2%" />);
    expect(screen.getByText("CPU")).toBeInTheDocument();
    expect(screen.getByText("2%")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeNull();
    rerender(<StatTile label="CPU" value="2%" interactive />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a chart tile inside a joined grid with its summary", () => {
    render(
      <TileGrid>
        <ChartTile label="API Gateway" summary="1.2% warnings"><div>chart</div></ChartTile>
      </TileGrid>
    );
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
    expect(screen.getByText("1.2% warnings")).toBeInTheDocument();
    expect(screen.getByText("chart")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("shows title, description and action", () => {
    render(<EmptyState title="Create a file bucket" description="Store files" action={<Button>New bucket</Button>} />);
    expect(screen.getByText("Create a file bucket")).toBeInTheDocument();
    expect(screen.getByText("Store files")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New bucket" })).toBeInTheDocument();
  });

  it("uses a dashed border by default and none in the plain variant", () => {
    const { rerender } = render(<EmptyState title="x" data-testid="e" />);
    expect(screen.getByTestId("e")).toHaveClass("border-dashed");
    rerender(<EmptyState title="x" variant="plain" data-testid="e" />);
    expect(screen.getByTestId("e")).not.toHaveClass("border-dashed");
  });
});

describe("ListItem", () => {
  it("renders title, description and trailing content", () => {
    render(<ListItem title="Docs" description="Browse guides" trailing={<span>NEW</span>} />);
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("Browse guides")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });
});

describe("Toolbar and ButtonGroup", () => {
  it("is a toolbar and hides the spacer from assistive tech", () => {
    render(<Toolbar aria-label="Filters"><Button>A</Button><ToolbarSpacer data-testid="sp" /></Toolbar>);
    expect(screen.getByRole("toolbar", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByTestId("sp")).toHaveAttribute("aria-hidden", "true");
  });

  it("groups joined buttons", () => {
    render(<ButtonGroup aria-label="Add"><Button>Add user</Button><Button aria-label="More">v</Button></ButtonGroup>);
    expect(within(screen.getByRole("group", { name: "Add" })).getAllByRole("button")).toHaveLength(2);
  });
});

describe("SortableHead", () => {
  it("exposes aria-sort and calls onSort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <table>
        <thead>
          <tr>
            <SortableHead sorted="desc" onSort={onSort}>Created</SortableHead>
            <SortableHead>Plan</SortableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole("columnheader", { name: "Created" })).toHaveAttribute("aria-sort", "descending");
    expect(screen.getByRole("columnheader", { name: "Plan" })).toHaveAttribute("aria-sort", "none");
    await user.click(screen.getByRole("button", { name: "Created" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});

describe("Steps", () => {
  it("is an ordered list whose items show their number and content", () => {
    render(
      <Steps>
        <Step number={1} title="Install package">code</Step>
        <Step number={2} title="Set variables" description="Copy these" />
      </Steps>
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Install package")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("CodeBlock", () => {
  afterEach(() => vi.restoreAllMocks());

  it("copies the code and confirms to the user", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<CodeBlock tablistLabel="Code variants" copyLabel="Copy code" copiedLabel="Copied" code="npm install prisma" />);
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith("npm install prisma");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("switches between tabs and copies the selected variant", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<CodeBlock tablistLabel="Code variants" copyLabel="Copy code" copiedLabel="Copied" tabs={[{ label: "npm", code: "npm i x" }, { label: "pnpm", code: "pnpm add x" }]} />);
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByText("pnpm add x")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith("pnpm add x");
  });

  it("uses supplied labels for code variants and copy feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<CodeBlock tabs={[{ label: "npm", code: "npm install x" }]} tablistLabel="Variantes de código" copyLabel="Copiar código" copiedLabel="Copiado" />);
    expect(screen.getByRole("tablist", { name: "Variantes de código" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copiar código" }));
    expect(writeText).toHaveBeenCalledWith("npm install x");
    expect(await screen.findByRole("button", { name: "Copiado" })).toBeInTheDocument();
  });
});

describe("MiniBarChart", () => {
  it("is an image with an accessible name and one pair of bars per datum", () => {
    const { container } = render(<MiniBarChart label="Requests, last 24 hours" data={[{ success: 3 }, { success: 5, danger: 2 }]} />);
    expect(screen.getByRole("img", { name: "Requests, last 24 hours" })).toBeInTheDocument();
    expect(container.querySelectorAll("rect")).toHaveLength(4);
  });
});

describe("ContextBreadcrumb", () => {
  it("is a labelled navigation and fires the switch action", async () => {
    const user = userEvent.setup();
    const onSwitch = vi.fn();
    render(
      <ContextBreadcrumb
        items={[
          { key: "org", label: "Demo Org", badge: <span>FREE</span>, onSwitch, switchLabel: "Switch organization" },
          { key: "proj", label: "Acme" }
        ]}
        action={<Button>Connect</Button>}
      />
    );
    expect(screen.getByRole("navigation", { name: "Context" })).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Switch organization" }));
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });
});

describe("Callout", () => {
  it("shows its title and action", () => {
    render(<Callout title="Give your agent everything it needs" action={<Button>Copy prompt</Button>} />);
    expect(screen.getByText("Give your agent everything it needs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy prompt" })).toBeInTheDocument();
  });
});
