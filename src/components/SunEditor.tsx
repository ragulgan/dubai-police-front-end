"use client";
import dynamic from "next/dynamic";
import * as React from "react";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

const defaultFonts = [
  "Arial",
  "Comic Sans MS",
  "Courier New",
  "Impact",
  "Georgia",
  "Tahoma",
  "Trebuchet MS",
  "Verdana",
];
const TextSunEditor = (props: any) => {
  const { setData, contentData, name, minHeight, isDisable } = props;

  const handleChange = (value: string) => {
    setData((values: any) => ({ ...values, [name]: value }));
  };

  const handleBlur = (event: FocusEvent) => {
    console.log("Blur event:", event);
  };

  const handleClick = (event: MouseEvent) => {
    console.log("Click event:", event);
  };

  const handleInput = (event: InputEvent) => {
    console.log("Input event:", event);
  };

  const sortedFontOptions = [
    "Logical",
    "Salesforce Sans",
    "Garamond",
    "Sans-Serif",
    "Serif",
    "Times New Roman",
    "Helvetica",
    ...defaultFonts,
  ].sort();

  const editorStyles = {
    fontSize: "16px",
    fontFamily: "dubai-med, Arial, sans-serif",
  };

  return (
    <div className="App bg-dark p-10" style={{ position: "relative" }}>
      <SunEditor
        setContents={contentData}
        onBlur={handleBlur}
        onChange={(value) => {
          handleChange(value);
        }}
        onInput={handleInput}
        onClick={handleClick}
        height="100%"
        width="100%"
        disable={isDisable}
        setOptions={{
          buttonList: [
            // ['undo', 'redo'],
            // ['fontSize'],
            // ['paragraphStyle', 'blockquote'],
            ["bold", "underline", "italic", "strike"],
            // ['fontColor', 'hiliteColor', 'textStyle'],
            // ['removeFormat'],
            // ['outdent', 'indent'],
            ["list"],
            // ['table', 'link', 'image', 'video', 'audio'],
            // ['imageGallery'],
            // ['fullScreen', 'showBlocks', 'codeView'],
            // ['preview', 'print'],
            // ['save', 'template']
          ],
          defaultTag: "div",
          minHeight: minHeight || "800px",
          maxHeight: "250px", // Set maximum height
          showPathLabel: false,
          font: sortedFontOptions,
          defaultStyle:
            "font-size: 16px; font-family: dubai-med, Arial, sans-serif;",
        }}
      />
      <style jsx>{`
        .se-wrapper .se-content {
          max-height: 400px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default TextSunEditor;
