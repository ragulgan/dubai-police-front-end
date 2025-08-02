import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MedicalHistoryCard from "@/components/view/MedicalHistoryCard"; 

describe("MedicalHistoryCard", () => {
  const mockProps = {
    label: "Medical History",
    expanded: true,
    onClick: jest.fn(),
  };

  it("renders the label", () => {
    render(<MedicalHistoryCard {...mockProps} />);
    expect(screen.getByText("Medical History")).toBeInTheDocument();
  });

  it("calls onClick when header is clicked", () => {
    render(<MedicalHistoryCard {...mockProps} />);
    const header = screen.getByText("Medical History");
    fireEvent.click(header);
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it("renders all injury rows", () => {
    render(<MedicalHistoryCard {...mockProps} />);
    const rows = screen.getAllByRole("row");
    // +1 because of header row
    expect(rows.length).toBe(6); // 5 injuries + 1 header
  });

  it("renders correct injury content", () => {
    render(<MedicalHistoryCard {...mockProps} />);
    expect(screen.getByText("Sprained Ankle")).toBeInTheDocument();
    expect(screen.getByText("Torn ACL")).toBeInTheDocument();
    expect(screen.getByText("Dislocated Shoulder")).toBeInTheDocument();
   expect(screen.getAllByText("Recovered").length).toBeGreaterThanOrEqual(1);
   expect(screen.getAllByText("Ongoing").length).toBeGreaterThanOrEqual(1);
    
  });

  it("renders ExpandMoreIcon when expanded", () => {
    render(<MedicalHistoryCard {...mockProps} />);
    expect(screen.getByTestId("ExpandMoreIcon")).toBeInTheDocument();
  });
});