import { Meta } from "@storybook/react";
import ReplayControls from "./ReplayControls";
import { DummyContext } from "../../storybook/DummyContext";

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

export const ReplayControlsStory = ({ onAttempt }: any) => (
  <DummyContext onAttempt={onAttempt}>
    <ReplayControls />
  </DummyContext>
);

ReplayControlsStory.storyName = "Replay Controls";
