import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog.js";

const meta = { title: "ui/Dialog", component: Dialog, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description with a short explanation of what happens next.</DialogDescription>
        </DialogHeader>
        <DialogFooter><Button variant="outline">Cancel</Button><Button>Continue</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
};
