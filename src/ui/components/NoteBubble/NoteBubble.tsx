import { Popover } from "react-tiny-popover";
import { NoteEditor } from "./NoteEditor";

export type NoteBubbleProps = {
  open: boolean;
  notes: Parameters<typeof NoteEditor>[0]["notes"];
  children: Parameters<typeof Popover>[0]["children"];
};
export default function NoteBubble({ open, children, notes }: NoteBubbleProps) {
  if (open) {
    const Notes = <NoteEditor notes={notes} />;
    return (
      <Popover
        positions={["top", "bottom", "left", "right"]}
        isOpen={true}
        content={Notes}
      >
        {children}
      </Popover>
    );
  } else {
    return children;
  }
}
