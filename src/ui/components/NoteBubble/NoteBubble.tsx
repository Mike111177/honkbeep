import { useCallback } from "react";
import { Popover } from "./Popover";
import { UserActionType } from "../../../client/types/UserAction";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import { NoteEditor } from "./NoteEditor";

export type NoteBubbleProps = {
  open: boolean;
  index: number;
  refHook: any;
};
export function NoteBubble({ open, index, refHook }: NoteBubbleProps) {
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