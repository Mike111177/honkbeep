import { Meta, Story } from "@storybook/react";
import { useEffect, useState } from "react";

import AnimatedDiv from "./AnimatedDiv";
import AnimatedNumber from "./AnimatedNumber";
import { onFrame } from "./FrameLoop";

export default {
  title: "Animation/Div",
  component: AnimatedDiv,
  parameters: {
    layout: "centered",
    controls: { disabled: true, hideNoControlsWarning: true },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{ height: "80vh", width: "80vw", backgroundColor: "black" }}
        >
          <Story />
        </div>
      );
    },
  ],
} as Meta;

export const AnimatedDivStory: Story<any> = () => {
  const width = useState(() => new AnimatedNumber());
  useEffect(() => onFrame(console.log));
  return (
    <AnimatedDiv style={{ width, height: "20vh", backgroundColor: "red" }} />
  );
};
AnimatedDivStory.storyName = "Div";
