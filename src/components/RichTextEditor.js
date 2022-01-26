import React from "react";
import MyUploadAdapter from "../utils/MyUploadAdapter";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RichTextEditor = (props) => {
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={props.value}
        onReady={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader
          ) => {
            return new MyUploadAdapter(loader);
          };
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          props.setValue(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
