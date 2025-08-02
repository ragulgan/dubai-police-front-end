import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "@/components/Loading";
import "@testing-library/jest-dom";

describe("LoadingOverlay", () => {
  it("renders nothing when loading is false", () => {
    const { container } = render(<Loading loading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overlay and spinner when loading is true", () => {
    render(<Loading loading={true} />);

    // Check for the progress spinner using its role
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Check that two elements with class 'MuiBox-root' exist
    const boxDivs = document.querySelectorAll(".MuiBox-root");
    expect(boxDivs.length).toBe(2);
  });
});