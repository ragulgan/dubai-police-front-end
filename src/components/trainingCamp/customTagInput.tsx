import React from "react";
import { useForm, Controller } from "react-hook-form";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const CustomTagInput = (props: any) => {
  const { control, name, placeholder } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="tagsinput-container">
          <TagsInput
            value={field.value}
            onChange={field.onChange}
            inputProps={{
              placeholder: placeholder,
            }}
          />
        </div>
      )}
    />
  );
};

export default CustomTagInput;
