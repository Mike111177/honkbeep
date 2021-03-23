import { Meta } from "@storybook/react";
import { useState } from "react";
import ReplayControls from "./ReplayControls";
import DummyBoard from "../../../client/DummyBoard";
import { BoardContext } from "../../BoardContext";

export default {
  title: "Board Components/Replay Controls",
  component: ReplayControls,
  parameters: {
    layout: "centered",
    controls: { disabled: true, hideNoControlsWarning: true },
  },
  argTypes: {
    onAttempt: { action: "User Action", table: { disable: true } },
  },
} as Meta;

export const ReplayControlsStory = ({ onAttempt }: any) => {
  const [board] = useState(() => new DummyBoard(onAttempt));
  return (
    <BoardContext.Provider value={board}>
      <ReplayControls />
    </BoardContext.Provider>
  );
};

ReplayControlsStory.storyName = "Replay Controls";
