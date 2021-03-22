import { Meta, Story } from "@storybook/react";
import colors from "../colors.json";
import CardFront, { CardFrontProps } from "./CardFront";

export default {
  title: "Card/Front",
  component: CardFront,
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

export const HBCardFrontStory: Story<CardFrontProps> = (props) => (
  <CardFront height="200px" {...props} />
);
HBCardFrontStory.args = { card: { rank: 1, suit: "Red" } };
HBCardFrontStory.storyName = "Front";
