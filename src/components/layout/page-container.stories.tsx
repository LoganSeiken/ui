import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageContainer } from "./page-container.js";

const meta = {
  title: "layout/PageContainer",
  component: PageContainer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageContainer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
  args: {
    children: (
      <div className="rounded-md border border-dashed border-input p-6 text-sm text-muted-foreground">
        Constrained to max-w-6xl and centered.
      </div>
    ),
  },
};
