import { useCallback } from "react";
import { Popover } from "react-tiny-popover";
import { UserActionType } from "../../../client/types/UserAction";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import { NoteEditor } from "./NoteEditor";

export type NoteBubbleProps = {
  open: boolean;
  index: number;
  children: Parameters<typeof Popover>[0]["children"];
};
export default function NoteBubble({ open, children, index }: NoteBubbleProps) {
  const notes = useBoardState(({ cardNotes }) => cardNotes[index], [index]);
  const dispatch = useBoardReducer();
  const setNotes = useCallback(
    (c: string) => {
      dispatch({
        type: UserActionType.EditNote,
        card: index,
        content: c,
      });
    },
    [dispatch, index]
  );

  if (open) {
    return (
      <Popover
        positions={["top", "bottom", "left", "right"]}
        isOpen={true}
        content={<NoteEditor notes={notes} setNotes={setNotes} />}
      >
        {children}
      </Popover>
    );
  } else {
    return children;
  }
}
