import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination.js";
const meta = {
  title: "patterns/Pagination",
  component: Pagination,
  args: { page: 3, pageCount: 8, hrefFor: (page) => `?page=${page}` },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Middle: Story = {};
export const First: Story = { args: { page: 1 } };
export const Last: Story = { args: { page: 8 } };
export const WithTotal: Story = { args: { total: 120, pageSize: 15 } };
export const ButtonMode: Story = { args: { hrefFor: undefined, onPageChange: () => undefined } };
