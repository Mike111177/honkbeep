import { NoteBubbleStyles as styles } from ".";
export type NoteEditorProps = {
  notes: { [key: string]: string } | string;
};
export function NoteEditor({ notes }: NoteEditorProps) {
  return (
    <div className={styles.NoteEditor}>
      {typeof notes === "string" ? (
        <span>{notes}</span>
      ) : (
        Object.getOwnPropertyNames(notes).map((name, i) => (
          <span key={i}>
            {name}: {notes[name]}
          </span>
        ))
      )}
    </div>
  );
}
