import { Meta, Story } from "@storybook/react";
import HBClueArea from "./ClueArea";
import DummyBoard from "../../../client/DummyBoard";
import { BoardContext } from "../../BoardContext";

import colors from "../../colors.json";

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

export const ClueAreaStory: Story<any> = ({
  onAttempt,
  suits,
  players,
}: any) => {
  const gameDef = {
    variant: {
      suits,
      numPlayers: players.length,
      handSize: 4,
    },
    playerNames: players,
  };
  return (
    <BoardContext.Provider value={new DummyBoard(onAttempt, gameDef)}>
      <HBClueArea />
    </BoardContext.Provider>
  );
};
ClueAreaStory.storyName = "Clue Area";
ClueAreaStory.args = {
  suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
  players: ["Alice", "Bob", "Cathy", "Donald"],
};
