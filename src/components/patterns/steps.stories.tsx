import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block.js";
import { Step, Steps } from "./steps.js";

const meta = { title: "patterns/Steps", component: Steps } satisfies Meta<typeof Steps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Numbered: Story = {
  render: () => (
    <Steps className="w-[32rem]">
      <Step number={1} title="Install package" description="Add the client library to your project."><CodeBlock code="npm install @loganseiken/ui" /></Step>
      <Step number={2} title="Set environment variables" description="Copy these into your environment."><CodeBlock code="NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co" /></Step>
    </Steps>
  )
};
