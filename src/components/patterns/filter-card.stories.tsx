import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { Field } from "./field.js";
import { FilterCard } from "./filter-card.js";

const meta = { title: "patterns/FilterCard", component: FilterCard } satisfies Meta<typeof FilterCard>;
export default meta;
type Story = StoryObj<typeof meta>;

function CustomForm(props: ComponentProps<"form">) {
  return <form {...props} data-custom-form />;
}

export const WithFilters: Story = {
  render: () => (
    <FilterCard className="w-full" onSubmit={(event) => event.preventDefault()} actions={<><Button variant="outline">Apply</Button><Button variant="ghost">Clear</Button></>}>
      <Field label="Name" htmlFor="filter-name" className="min-w-48 flex-1"><Input id="filter-name" placeholder="Search name" /></Field>
      <Field label="Status" htmlFor="filter-status" className="min-w-48 flex-1">
        <Select defaultValue="active"><SelectTrigger id="filter-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
      </Field>
    </FilterCard>
  )
};

export const CustomFormComponent: Story = {
  render: () => <FilterCard formComponent={CustomForm} aria-label="Custom filters"><Field label="Name" htmlFor="custom-filter-name"><Input id="custom-filter-name" /></Field></FilterCard>
};
