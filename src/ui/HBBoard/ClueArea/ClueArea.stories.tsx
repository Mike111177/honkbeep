import { Meta } from "@storybook/react";
import { useState } from "react";
import HBClueArea from "./ClueArea";
import DummyBoard from "../../../client/DummyBoard";
import { BoardContext } from "../../BoardContext";

export default {
  title: "Board Components/Clue Area",
  component: HBClueArea,
  parameters: {
    layout: "centered",
    controls: { disabled: true, hideNoControlsWarning: true },
  },
  argTypes: {
    onAttempt: { action: "attemptedAction", table: { disable: true } },
  },
} as Meta;

export const ClueAreaStory = ({ onAttempt }: any) => {
  const [board] = useState(() => new DummyBoard(onAttempt));
  return (
    <BoardContext.Provider value={board}>
      <HBClueArea />
    </BoardContext.Provider>
  );
};

ClueAreaStory.storyName = "Clue Area";
