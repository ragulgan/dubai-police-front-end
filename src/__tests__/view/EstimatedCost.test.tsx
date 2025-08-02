import React from "react";
import { render, screen } from "@testing-library/react";
import EstimatedCost from "@/components/view/EstimatedCost";



describe("EstimatedCost", () => {
  const mockData = {
    totalCost: "10000",
    ticketsCost: "2000",
    accommodationCost: "3000",
    transportationCost: "1500",
    registrationFees: "1000",
    shippingFees: "500",
    otherExpenses: "1000",
  };

  const emptyData = {
    totalCost: "",
    ticketsCost: " ",
    accommodationCost: null,
    transportationCost: undefined,
    registrationFees: "",
    shippingFees: null,
    otherExpenses: " ",
  };

  it("renders all cost labels", () => {
    render(<EstimatedCost data={mockData} module="trainingCamp" />);

    const labels = [
      "Total Cost",
      "Ticket Cost",
      "Accommodation Cost",
      "Transportation Cost",
      "Registration Fees",
      "Shipping Fees",
      "Other Fees",
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders correct AED values", () => {
    render(<EstimatedCost data={mockData} module="trainingCamp" />);

    expect(screen.getByText("10000 AED")).toBeInTheDocument();
    expect(screen.getByText("2000 AED")).toBeInTheDocument();
    expect(screen.getByText("3000 AED")).toBeInTheDocument();
    expect(screen.getByText("1500 AED")).toBeInTheDocument();
    expect(screen.getAllByText("1000 AED")).toHaveLength(2);
    expect(screen.getByText("500 AED")).toBeInTheDocument();
  
  });

  it("renders editor content", () => {
    render(<EstimatedCost data={mockData} module="trainingCamp" />);

    expect(
      screen.getByText("Includes Meals and Transportation to Event")
    ).toBeInTheDocument();
  });
  
});
