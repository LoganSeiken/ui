import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthSplitLayout } from "./auth-split-layout.js";

const meta = {
  title: "layout/AuthSplitLayout",
  component: AuthSplitLayout,
  parameters: { layout: "fullscreen" },
  args: {
    brand: (
      <div className="mx-auto grid w-full max-w-md gap-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground font-semibold text-primary">
            A
          </span>
          <span className="text-xl font-semibold">Appvance</span>
        </div>
        <div className="grid gap-3">
          <p className="text-sm font-medium text-primary-foreground/70">TEAM WORKSPACE</p>
          <p className="text-3xl font-semibold tracking-tight">One space for your team.</p>
          <p className="max-w-sm text-base leading-7 text-primary-foreground/80">
            Sign in to access the applications available to your organization.
          </p>
        </div>
      </div>
    ),
    children: (
      <div className="grid gap-6 text-center">
        <div className="grid gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Access your workspace.</p>
        </div>
        <p className="rounded-md border border-border bg-surface p-6 text-sm text-muted-foreground">
          Authentication form slot
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof AuthSplitLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
