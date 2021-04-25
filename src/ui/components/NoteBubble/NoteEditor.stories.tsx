import { Meta, Story } from "@storybook/react";
import { useState } from "react";

import { NoteEditor, NoteEditorProps } from "./NoteEditor";

export default {
  title: "Components/NoteEditor",
  component: NoteEditor,
  parameters: {
    layout: "centered",
    controls: { disabled: true, hideNoControlsWarning: true },
    actions: { disabled: true },
  },
} as Meta;

export const NoteEditorStory: Story<NoteEditorProps> = (props) => {
  const [notes, setNotes] = useState("");
  return <NoteEditor notes={notes} setNotes={setNotes}></NoteEditor>;
};
NoteEditorStory.storyName = "NoteEditor";
