import { Meta } from "@storybook/react";
import { useState } from "react";
import HBClueArea from "./HBClueArea";
import DummyBoard from "../../../client/DummyBoard";
import { BoardContext } from "../../BoardContext";

export default {
  title: "HBClueArea",
  component: HBClueArea,
  parameters: {
    layout: "centered",
    controls: { disabled: true, hideNoControlsWarning: true },
  },
  argTypes: {
    onAttempt: { action: "attemptedAction", table: { disable: true } },
  },
} as Meta;

export const HBClueAreaStory = ({ onAttempt }: any) => {
  const [board] = useState(() => new DummyBoard(onAttempt));
  return (
    <BoardContext.Provider value={board}>
      <HBClueArea />
    </BoardContext.Provider>
  );
};

HBClueAreaStory.storyName = "HBClueArea";
