import { Meta, Story } from "@storybook/react";
import HBClueArea from "./ClueArea";

import colors from "../../colors.json";
import { DummyContext } from "../../storybook/DummyContext";

export default {
  title: "Board Components/Clue Area",
  component: HBClueArea,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onAttempt: { action: "User Action", table: { disable: true } },
    suits: {
      control: {
        type: "check",
        options: colors.map((c) => c.name),
      },
    },
    players: {
      type: "array",
    },
  },
} as Meta;

export const ClueAreaStory: Story<any> = (props) => (
  <DummyContext {...props}>
    <HBClueArea />
  </DummyContext>
);
ClueAreaStory.storyName = "Clue Area";
ClueAreaStory.args = {
  suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
  players: ["Alice", "Bob", "Cathy", "Donald"],
};
