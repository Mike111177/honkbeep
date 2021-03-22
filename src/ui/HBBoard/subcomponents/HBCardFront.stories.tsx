import { Meta, Story } from "@storybook/react";
import colors from "../../colors.json";
import HBCardFront, { HBCardFrontProps } from "./HBCardFront";

export default {
  title: "HBCardFront",
  component: HBCardFront,
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
    borderOverride: { control: "color" },
  },
  parameters: {
    layout: "centered",
    actions: { disabled: true },
  },
} as Meta;

export const HBCardFrontStory: Story<HBCardFrontProps> = (props) => (
  <HBCardFront height="200px" {...props} />
);
HBCardFrontStory.args = { rank: 1, suit: "Red" };
HBCardFrontStory.storyName = "HBCardFront";
