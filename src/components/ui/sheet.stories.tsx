import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./sheet.js";

const meta = { title: "ui/Sheet", component: Sheet, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild><Button>Open sheet</Button></SheetTrigger>
      <SheetContent className="max-w-lg">
        <SheetHeader>
          <SheetTitle>Connect to your project</SheetTitle>
          <SheetDescription>Choose how you want to use the service</SheetDescription>
        </SheetHeader>
        <SheetBody><p className="text-sm text-muted-foreground">Sheet content.</p></SheetBody>
      </SheetContent>
    </Sheet>
  )
};
