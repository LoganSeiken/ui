import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { Section } from "./section.js";

const meta = { title: "patterns/Section", component: Section, args: { title: "Company contacts" } } satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <p>Section content</p> },
  render: () => <Section title="Company contacts" description="People associated with this company." actions={<Badge>12</Badge>}><p>Section content</p></Section>
};

export const Separated: Story = {
  args: { children: <p>Section content</p> },
  render: () => <Section title="Archive company" separated actions={<Button variant="outline">Archive</Button>}><p>Archive actions are separated from the main content.</p></Section>
};
