import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../ui/badge.js";
import { SubNav, SubNavItem, SubNavSection, SubNavTitle } from "./sub-nav.js";

const meta = {
  title: "layout/SubNav",
  component: SubNav,
  parameters: { layout: "fullscreen" },
  args: { "aria-label": "Section" },
} satisfies Meta<typeof SubNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {
  args: {
    className: "h-96",
    children: (
      <>
        <SubNavTitle>Storage</SubNavTitle>
        <SubNavSection title="Manage">
          <SubNavItem href="#" active>
            Files
          </SubNavItem>
          <SubNavItem href="#" className="justify-between">
            Analytics{" "}
            <Badge variant="success-outline" shape="square" className="font-mono uppercase">
              New
            </Badge>
          </SubNavItem>
        </SubNavSection>
        <SubNavSection title="Configuration">
          <SubNavItem href="#">S3</SubNavItem>
        </SubNavSection>
      </>
    ),
  },
};
