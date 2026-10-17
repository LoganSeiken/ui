import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { Textarea } from "../ui/textarea.js";
import { Field } from "./field.js";
import { FormActions, FormCard, FormSection } from "./form-card.js";

const meta = { title: "patterns/FormCard", component: FormCard } satisfies Meta<typeof FormCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CompanyLikeForm: Story = {
  render: () => (
    <FormCard className="max-w-3xl" onSubmit={(event) => event.preventDefault()}>
      <FormSection title="Company details" description="Basic information about the company." columns={2}>
        <Field label="Company name" htmlFor="company-name" error="A company name is required.">
          <Input id="company-name" aria-invalid defaultValue="" />
        </Field>
        <Field label="Website" htmlFor="company-website"><Input id="company-website" placeholder="https://example.com" /></Field>
      </FormSection>
      <FormSection title="Contact information" description="How the company can be reached." columns={2}>
        <Field label="Email" htmlFor="company-email"><Input id="company-email" type="email" defaultValue="team@example.com" /></Field>
        <Field label="Industry" htmlFor="company-industry">
          <Select defaultValue="technology"><SelectTrigger id="company-industry"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="technology">Technology</SelectItem><SelectItem value="services">Professional services</SelectItem></SelectContent></Select>
        </Field>
        <Field label="Notes" htmlFor="company-notes" className="md:col-span-2">
          <Textarea id="company-notes" maxLength={240} showCount placeholder="Add a short note" />
        </Field>
      </FormSection>
      <FormSection title="Internal notes" description="Visible to your team.">
        <Field label="Summary" htmlFor="company-summary"><Textarea id="company-summary" maxLength={240} showCount /></Field>
      </FormSection>
      <FormActions><Button variant="outline">Cancel</Button><Button>Save</Button></FormActions>
    </FormCard>
  )
};
