import React from "react";
import { render, screen } from "@testing-library/react";

import { Checkbox } from "@mui/material";
import CustomFormControlLabel from "@/components/Forms/CustomFormControlLabel";

describe("CustomFormControlLabel", () => {
  it("renders with label and control", () => {
    render(
      <CustomFormControlLabel
        label="Accept Terms"
        control={<Checkbox />}
        data-testid="custom-label"
      />
    );

    // Check if the label text is rendered
    expect(screen.getByText("Accept Terms")).toBeInTheDocument();

    // Check if the checkbox control is present
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
