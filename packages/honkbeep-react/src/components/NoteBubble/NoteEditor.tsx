import { useState } from "react";
import { NoteBubbleStyles as styles } from ".";
export type NoteEditorProps = {
  notes:
    | string
    | {
        readonly [x: string]: string;
      }
    | undefined;
  setNotes: (c: string) => void;
};
export function NoteEditor({ notes, setNotes }: NoteEditorProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className={styles.NoteEditor}
      onDoubleClick={() => setEditing(!editing)}
    >
      {editing ? (
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setNotes((e.target as HTMLInputElement).value);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span>{notes}</span>
      )}
    </div>
  );
}
