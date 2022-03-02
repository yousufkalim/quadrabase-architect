import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";

export default function Index(props) {
  const editor = useRef(null);

  const config = {
    readonly: false,
    enableDragAndDropFileToEditor: true,
    uploader: {
      url: `${process.env.REACT_APP_API_URL}/fileUploader`,
      format: "json",
      pathVariableName: "path",
      filesVariableName: function (t) {
        return "file";
      },
      prepareData: function (data) {
        return data;
      },
      isSuccess: function (resp) {
        if (resp) {
          return true;
        } else {
          toast.error("Image upload failed");
        }
      },
      process: function (resp) {
        return {
          file: resp.files[0].uri || [],
        };
      },
      defaultHandlerSuccess: function (data) {
        if (data.file) {
          this.selection.insertImage(data.file);
        }
      },
    },
    buttons: [
      "bold",
      "strikethrough",
      "underline",
      "italic",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "|",
      "print",
    ],
    buttonsMD: [
      "bold",
      "strikethrough",
      "underline",
      "italic",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "|",
      "print",
    ],
    buttonsSM: [
      "bold",
      "strikethrough",
      "underline",
      "italic",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "|",
      "print",
    ],
    buttonsXS: [
      "bold",
      "strikethrough",
      "underline",
      "italic",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "|",
      "print",
    ],
  };

  return (
    <JoditEditor
      ref={editor}
      value={props.value}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => props.setValue(newContent)}
      onChange={(newContent) => {}}
    />
  );
}
