"use client";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import * as React from "react";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";
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

interface CustomTextFieldProps<T extends FieldValues> {
  name: Path<T>; // Updated to accept keys of T as name
  control?: Control<T>; // Use the generic type T
  label?: string;
  rules?: RegisterOptions<T, Path<T>>; // Updated to register options for T
  textarea?: boolean;
  placeholder?: string;
  disabled?: any;
  errorDisplay?: any;
  minHeight?: string;
  module?: any;
}

const FormWithSunEditor = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  textarea,
  placeholder,
  minHeight = "250px", // Provide a default minHeight
  errorDisplay,
  module,
  ...props
}: CustomTextFieldProps<T>) => {
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

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ fontSize: "14px" }}
        className="typography textfield-label bukra"
        mt={1.5}
        mb={0.5}
      >
        {label}
        {rules?.required && (
          <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
        )}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={
          rules && rules.required
            ? {
                ...rules,
                validate: (value) => {
                  const isEmpty =
                    !value ||
                    value === "<div><br></div>" ||
                    value.trim() === "";
                  return isEmpty ? `${label} is required` : true;
                },
              }
            : rules
        }
        render={({ field, fieldState: { error } }) => (
          <div className="App bg-dark p-10" style={{ position: "relative" }}>
            <SunEditor
              setContents={field.value || ""}
              onChange={(updatedData: string) => {
                const cleanedData = updatedData.trim();
                field.onChange(cleanedData);
              }}
              height="100%"
              width="100%"
              setOptions={{
                buttonList:
                  module === "news"
                    ? [
                        [
                          "undo",
                          "redo",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "formatBlock",
                        ],
                        ["list", "align", "link", "codeView"],
                      ]
                    : [["bold", "underline", "italic", "strike"], ["list"]],
                defaultTag: "div",
                minHeight: minHeight,
                maxHeight: "250px",
                showPathLabel: false,
                font: sortedFontOptions,
                defaultStyle:
                  "font-size: 16px; font-family: dubai-med, Arial, sans-serif;",
                formats: ["h1", "h2", "h3"],
              }}
            />
            <style jsx>{`
              .se-wrapper .se-content {
                max-height: 400px;
                overflow-y: auto;
              }
            `}</style>
            {error && (
              <Typography
                sx={{
                  color: "#d32f2f",
                  fontSize: "12px",
                  marginTop: "4px !important",
                }}
                className="dubai-med"
              >
                {error.message}
              </Typography>
            )}
          </div>
        )}
      />
    </>
  );
};

export default FormWithSunEditor;
