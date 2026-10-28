import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

const meta = { title: "ui/Collapsible", component: Collapsible } satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {
  render: () => (
    <div className="w-80 rounded-md border border-border bg-surface">
      {["Shared", "Favorites", "Private"].map((name, i) => (
        <Collapsible
          key={name}
          defaultOpen={i === 2}
          className="border-b border-border last:border-b-0"
        >
          <CollapsibleTrigger>{name}</CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3 text-sm text-muted-foreground">
            No saved queries in {name}.
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  ),
};
