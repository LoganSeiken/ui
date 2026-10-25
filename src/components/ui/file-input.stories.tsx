import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileInput } from "./file-input.js";

const meta = { title: "ui/FileInput", component: FileInput, args: { id: "story-file", name: "file", chooseLabel: "Choose file", noFileLabel: "No file selected", help: "PDF, DOCX, TXT or Markdown up to 10 MB." } } satisfies Meta<typeof FileInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true, accept: ".pdf,.docx,.txt,.md" } };
