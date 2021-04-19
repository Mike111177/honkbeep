import { Meta } from "@storybook/react";

import Solitaire from "./Solitaire";

export default {
  title: "Pages/Solitaire",
  component: Solitaire,
  parameters: {
    controls: { disabled: true, hideNoControlsWarning: true },
    actions: { disabled: true },
  },
} as Meta;

export const SolitaireBoardStory = () => <Solitaire />;
SolitaireBoardStory.storyName = "Solitaire";
