import { Meta, Story } from "@storybook/react";

import Slider, { SliderProps } from ".";

export default {
  title: "Components/Slider",
  component: Slider,
} as Meta;

export const SliderStory: Story<SliderProps> = (props) => <Slider {...props} />;
SliderStory.storyName = "Slider";
