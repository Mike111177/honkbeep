import { Meta, Story } from "@storybook/react";

import NoteBubble, { NoteBubbleProps } from ".";

export default {
  title: "Components/NoteBubble",
  component: NoteBubble,
} as Meta;

export const NoteBubbleStory: Story<NoteBubbleProps> = (props) => (
  <div
    style={{
      position: "relative",
      height: "300px",
      width: "300px",
    }}
  >
    <NoteBubble {...props}>
      <div
        style={{
          height: "150px",
          width: "110px",
          top: "50%",
          left: "50%",
          position: "absolute",
          margin: "-55px 0 0 -75px",
          backgroundColor: "grey",
        }}
      ></div>
    </NoteBubble>
  </div>
);
NoteBubbleStory.storyName = "NoteBubble";
