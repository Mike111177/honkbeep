import { Meta } from "@storybook/react";

import HBSolitaireBoard from "./HBSolitaireBoard";

export default {
  title: "Game Boards/Solitaire",
  component: HBSolitaireBoard,
  parameters: {
    controls: { disabled: true, hideNoControlsWarning: true },
    actions: { disabled: true },
  },
} as Meta;

export const SolitaireBoardStory = () => <HBSolitaireBoard />;
SolitaireBoardStory.storyName = "Solitaire";
