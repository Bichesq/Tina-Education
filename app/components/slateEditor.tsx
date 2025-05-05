"use client";

import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { Button } from "@/components/ui/button"; // Optional: use your own button styling

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
};

export default function SlateEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "Type something and use buttons or Ctrl+B / Ctrl+I" }],
    },
  ]);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Toolbar />
      <Editable
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (
              (event.metaKey || event.ctrlKey) &&
              event.key === hotkey.split("+")[1]
            ) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
        placeholder="Start typing..."
      />
    </Slate>
  );
}

const Toolbar = () => {
  const editor = useSlate();
  return (
    <div className="mb-2 space-x-2">
      <MarkButton editor={editor} format="bold" label="Bold" />
      <MarkButton editor={editor} format="italic" label="Italic" />
    </div>
  );
};

const MarkButton = ({ editor, format, label }) => {
  const isActive = isMarkActive(editor, format);
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {label}
    </Button>
  );
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};
