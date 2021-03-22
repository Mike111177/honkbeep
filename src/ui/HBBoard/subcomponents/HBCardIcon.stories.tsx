import { Meta, Story } from "@storybook/react";
import colors from "../../colors.json";
import HBCardIcon, { HBCardIconProps } from "./HBCardIcon";

export default {
  title: "HBCardIcon",
  component: HBCardIcon,
  argTypes: {
    suit: {
      control: {
        type: "select",
        options: colors.map((c) => c.name),
      },
    },
    rank: {
      control: {
        type: "number",
        min: 1,
        max: 5,
        step: 1,
      },
    },
  },
  parameters: {
    layout: "centered",
    actions: { disabled: true },
  },
} as Meta;

const Template: Story<HBCardIconProps> = (props) => (
  <span
    style={{
      color: "white",
      fontFamily: "Consolas, monospace",
      fontSize: "40px",
    }}
  >
    Alice played <HBCardIcon {...props} /> from Slot 1
  </span>
);

export const HBCardIconStory = Template.bind({});
HBCardIconStory.args = { rank: 1, suit: "Red" };
HBCardIconStory.storyName = "HBCardIcon";
