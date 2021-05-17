import { useCallback } from "react";
import { Popover } from "./Popover";
import { UserActionType } from "honkbeep-play";
import { useBoardReducer, useBoardStateSelector } from "../../BoardContext";
import { NoteEditor } from "./NoteEditor";

export type NoteBubbleProps = {
  open: boolean;
  index: number;
  refHook: any;
};
export function NoteBubble({ open, index, refHook }: NoteBubbleProps) {
  const notes = useBoardStateSelector(
    ({ cardNotes }) => cardNotes[index],
    [index]
  );
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

  return (
    <Popover
      positions={["top", "bottom", "left", "right"]}
      isOpen={open}
      refHook={refHook}
    >
      <NoteEditor notes={notes} setNotes={setNotes} />
    </Popover>
  );
}
