import React from "react";
import { Controller } from "react-hook-form";
import Select, { StylesConfig, ThemeConfig } from "react-select";

interface OptionType {
 label: string;
 value: string | number;
}

interface ReactSelectProps {
 options: OptionType[];
 handleChangeReactSelect: (selectedOption: OptionType | null) => void;
 value: OptionType | null;
 isMulti?: boolean;
 isDisabled?: boolean;
 isClearable?: boolean;
}
const customStyles = (isError: boolean): StylesConfig<OptionType, boolean> => ({
 control: (base: any, state: any) => ({
  ...base,
  borderRadius: "4px",
  backgroundColor: "#00875508",
  borderColor: state.isFocused
   ? "#40a377"
   : isError || state.hasError
    ? "red"
    : "#40a377",
  boxShadow: state.isFocused ? "0 0 0 1px #40a377" : base.boxShadow,
  "&:hover": {
   borderColor: isError || state.hasError ? "red" : "#40a377", // Red on hover if error exists
  },
  cursor: "pointer",
 }),
 input: (base: any) => ({
  ...base,
  fontFamily: "Roboto",
  paddingLeft: "10px",
  color: "#000000",
  caretColor: "#40a377",
  "&::placeholder": {
   color: "#58585B",
   opacity: 1,
  },
 }),
 singleValue: (base: any) => ({
  ...base,
  color: "#000000",
 }),
 menu: (base: any) => ({
  ...base,
  borderRadius: "0 0 4px 4px",
 }),
 indicatorSeparator: () => ({
  display: "none",
 }),
 valueContainer: (base: any) => ({
  ...base,
  padding: "0 8px",
 }),
 multiValue: (base: any) => ({
  ...base,
  backgroundColor: "#008755",
  color: "#fff",
  borderRadius: "15px",
 }),
 multiValueLabel: (base: any) => ({
  ...base,
  color: "#fff",
 }),
 multiValueRemove: (base: any) => ({
  ...base,
  color: "#fff",
  ":hover": {
   backgroundColor: "#008755",
   color: "#fff",
  },
 }),
 option: (base, { isFocused, isSelected }) => ({
  ...base,
  backgroundColor: isFocused ? "#008755" : "#00875508",
  borderColor: "#008755",
  color: isSelected ? "#000" : "#000",
  boxShadow: isFocused ? "0 0 0 1px #008755" : base.boxShadow,
  cursor: "pointer",
  "&:hover": {
   backgroundColor: "#26D07C1A",
   borderColor: "#26D07C1A",
   color: "black",
  },
 }),
});

function ReactSelect(props: any) {
 const {
  options,
  handleChangeReactSelect,
  value,
  isMulti,
  isDisabled,
  isClearable,
  placeholder,
  defaultValue,
  className,
  id,
  control,
  name,
  readonly,
  isError
 } = props;
 console.log("isError", isError)
 return (
  <Controller
   name={name}
   control={control}
   render={({
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
   }) => (
    <>
     <Select
      styles={customStyles(isError)}
      value={value}
      onChange={(selectedOption: any) => {
       onChange(selectedOption);
       handleChangeReactSelect &&
        handleChangeReactSelect(selectedOption);
      }}
      options={options}
      theme={(theme: any) => ({
       ...theme,
       borderRadius: 0,
       borderWidth: 1,
       colors: {
        ...theme.colors,
        primary: "#40a377",
        primary25: "#40a37733",
        primary50: "#40a37766",
        primary75: "#40a37799",
       },
      })}
      isMulti={isMulti}
      isClearable={isClearable}
      isDisabled={isDisabled || false}
      className={`${className} position-relative Text-field-customise`}
      placeholder={placeholder}
      closeMenuOnSelect={isMulti ? false : true}
      defaultValue={defaultValue}
      inputId={id}
     />
    </>
   )}
  />
 );
}

export default ReactSelect;
