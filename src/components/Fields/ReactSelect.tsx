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
const customStyles: StylesConfig<OptionType, boolean> = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "4px",
    backgroundColor: state.isDisabled ? 'rgba(241, 235, 156, 0.2)' : "#00875508",
    borderColor: state.isDisabled
      ? '#58585B33'
      : state.isFocused
        ? '#40a377'
        : '#40a377',
    boxShadow: state.isFocused ? "0 0 0 1px #40a377" : base.boxShadow,
    "&:hover": {
      borderColor: "#40a377",
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
      fontWeight: 500,
    },
  }),
  singleValue: (base: any, state: any) => ({
    ...base,
    color: state.isDisabled ? '#58585B' : "#000000",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0 0 4px 4px",
    zIndex: 9,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9,
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
    textAlign: "start",
    "&:hover": {
      backgroundColor: "#26D07C1A",
      borderColor: "#26D07C1A",
      color: "black",
    },
  }),
};

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
  } = props;

  return (
    <Select
      styles={customStyles}
      value={value}
      onChange={(selectedOption: any) => {
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
      className={`position-relative Text-field-customise ${className}`}
      placeholder={placeholder}
      closeMenuOnSelect={!isMulti}
      defaultValue={defaultValue}
      inputId={id}
    />
  );
}

export default ReactSelect;