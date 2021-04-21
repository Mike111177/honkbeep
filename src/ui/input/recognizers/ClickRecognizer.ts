export default function ClickRecognizer(onClick: () => void, button: number) {
  switch (button) {
    case 2:
      return {
        onContextMenu(e: PointerEvent) {
          e.preventDefault();
          onClick();
        },
      };
    default:
      return {};
  }
}
