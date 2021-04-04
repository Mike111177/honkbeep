import { Meta, Story } from "@storybook/react";

import BoxButton, { BoxButtonProps } from ".";

export default {
  title: "Components/BoxButton",
  component: BoxButton,
  argTypes: {
    children: { control: "text" },
  },
} as Meta;

export const BoxButtonStory: Story<BoxButtonProps> = ({ children }) => (
  <BoxButton>{children}</BoxButton>
);
BoxButtonStory.storyName = "BoxButton";
