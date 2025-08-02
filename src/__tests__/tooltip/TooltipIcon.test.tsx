import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomTooltip, TooltipIcon } from "@/components/tooltip/TooltipIcon";
import "@testing-library/jest-dom";
import { Typography } from "@mui/material";

describe("TooltipIcon", () => {
  it("renders the Info icon button", () => {
    render(<TooltipIcon tooltipMsg="This is a tooltip" />);

    // Expect InfoIcon's button to be in the document
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays the tooltip message on hover", async () => {
    render(<TooltipIcon tooltipMsg="Hover message here" />);

    // Hover over the icon button
    const button = screen.getByRole("button");
    await userEvent.hover(button);

    // Tooltip should appear
    const tooltip = await screen.findByText("Hover message here");
    expect(tooltip).toBeInTheDocument();

    // Unhover and expect it to disappear
    await userEvent.unhover(button);
  });

  it("has primary color styling and border", () => {
    render(<TooltipIcon tooltipMsg="Style check" />);
    const button = screen.getByRole("button");

    expect(button).toHaveStyle({
      borderBottom: "1px solid #DEE2ED",
      borderRadius: "0px",
    });
  });
  it("shows the tooltip content on hover", async () => {
    render(
      <CustomTooltip title="Custom Tooltip Text">
        <Typography>Hover over me</Typography>
      </CustomTooltip>
    );

    const target = screen.getByText("Hover over me");
    await userEvent.hover(target);

    const tooltip = await screen.findByText("Custom Tooltip Text");
    expect(tooltip).toBeInTheDocument();

    await userEvent.unhover(target);
  });

  
});
