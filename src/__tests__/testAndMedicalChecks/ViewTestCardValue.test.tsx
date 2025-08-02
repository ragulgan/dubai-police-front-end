import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewTestCardValue from "@/components/testAndMedicalChecks/ViewTestCardValue";


describe("ViewTestCardValue Component", () => {
  it("renders label and formatted value correctly", () => {
    render(<ViewTestCardValue label="Status" value="fitToPlay" />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Fit To Play")).toBeInTheDocument();
  });

  it("shows '--' when value is falsy", () => {
    render(<ViewTestCardValue label="Status" value="" />);
    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("renders raw value when no match in formattedValues", () => {
    render(<ViewTestCardValue label="Status" value="unknownStatus" />);
    expect(screen.getByText("unknownStatus")).toBeInTheDocument();
  });

  it("applies link styles and handles click when isLink is true", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    render(
      <ViewTestCardValue
        label="Document"
        value="Click Here"
        isLink
        isLinkData="https://example.com"
      />
    );

    const valueElement = screen.getByText("Click Here");
    expect(valueElement).toHaveStyle("color: #05868E");
    expect(valueElement).toHaveStyle("cursor: pointer");

    fireEvent.click(valueElement);
    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank");

    openSpy.mockRestore();
  });

  it("applies non-link styles when isLink is false", () => {
    render(<ViewTestCardValue label="Info" value="Some value" isLink={false} />);
    const valueElement = screen.getByText("Some value");
    expect(valueElement).toHaveStyle("color: #69696C");
    expect(valueElement).toHaveStyle("cursor: auto");
  });

 it("applies multiline styles for 'Comments' label", () => {
  render(<ViewTestCardValue label="Comments" value={"Line1\nLine2"} />);

  const valueElement = screen.getByText((content) =>
    content.includes("Line1") && content.includes("Line2")
  );

  expect(valueElement).toHaveStyle("white-space: pre-line");
  expect(valueElement).toHaveStyle("word-break: break-word");
});

it("applies multiline styles for 'Final Comments' label", () => {
  render(<ViewTestCardValue label="Final Comments" value={"Good\nLuck"} />);

  const valueElement = screen.getByText((content) =>
    content.includes("Good") && content.includes("Luck")
  );

  expect(valueElement).toHaveStyle("white-space: pre-line");
});
});