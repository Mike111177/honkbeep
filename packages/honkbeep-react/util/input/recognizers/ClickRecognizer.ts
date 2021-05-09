import { Recognizer } from "../types/RecognizerTypes";

export default function ClickRecognizer(
  onClick: () => void,
  button: number
): Recognizer {
  switch (button) {
    case 2:
      return {
        onContextMenu(e) {
          e.preventDefault();
          onClick();
        },
      };
    default:
      return {};
  }
}
