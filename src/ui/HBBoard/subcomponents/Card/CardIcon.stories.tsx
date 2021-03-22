import { Meta, Story } from "@storybook/react";
import colors from "../../../colors.json";
import CardIcon, { CardIconProps } from "./CardIcon";

export default {
  title: "Card/Icon",
  component: CardIcon,
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

const Template: Story<CardIconProps> = (props) => (
  <span
    style={{
      color: "white",
      fontFamily: "Consolas, monospace",
      fontSize: "40px",
    }}
  >
    Alice played <CardIcon {...props} /> from Slot 1
  </span>
);

export const CardIconStory = Template.bind({});
CardIconStory.args = { card: { rank: 1, suit: "Red" } };
CardIconStory.storyName = "Icon";
