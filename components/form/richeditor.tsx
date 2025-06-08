"use client";

import { ControllerRenderProps } from "react-hook-form";
//import MDEditor from "@uiw/react-md-editor";
//import Editor from "../rich-text/editor";
//import { MinimalTiptapEditor } from "../minimal-tiptap";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
//import { cn } from "@/lib/utils";

interface RichEditorProps {
  label?: string;
  className?: string;
  contentClassName?: string;
  field: ControllerRenderProps;
}

export default function RichEditor(props: RichEditorProps) {
  const { label, /*field, className, contentClassName*/ } = props;
  // <Editor content={value} onChange={onChange} />

  const Element = (
    <div>
    {/*<MinimalTiptapEditor
      value={field.value}
      onChange={field.onChange}
      className={className}
      editorContentClassName={cn("p-5", contentClassName)}
      output="json"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
    />*/}
    </div>
  );

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
