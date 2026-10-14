import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCard, RadioGroup, RadioGroupItem } from "./radio-group.js";

const meta = { title: "ui/RadioGroup", component: RadioGroup } satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="b" aria-label="Options">
      {["a", "b", "c"].map((v) => (
        <label key={v} className="flex items-center gap-2 text-sm"><RadioGroupItem value={v} /> Option {v.toUpperCase()}</label>
      ))}
    </RadioGroup>
  )
};
export const Cards: Story = {
  render: () => (
    <RadioGroup defaultValue="direct" aria-label="Connection method" className="w-96">
      <RadioCard value="direct" title="Direct connection" description="Ideal for persistent, long-lived connections." />
      <RadioCard value="tx" title="Transaction pooler" description="Ideal for stateless serverless functions." />
    </RadioGroup>
  )
};
export const Joined: Story = {
  render: () => (
    <RadioGroup variant="joined" defaultValue="tx" aria-label="Connection method" className="w-96">
      <RadioCard value="direct" title="Direct connection" description="Ideal for persistent connections." />
      <RadioCard value="tx" title="Transaction pooler" description="Ideal for serverless functions." />
      <RadioCard value="session" title="Session pooler" description="Alternative over IPv4." />
    </RadioGroup>
  )
};
