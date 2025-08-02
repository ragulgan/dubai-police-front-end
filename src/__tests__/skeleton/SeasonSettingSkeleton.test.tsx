import React from "react";
import { render, screen } from "@testing-library/react";
import SeasonSettingSkeleton from "@/components/skeleton/SeasonSettingSkeleton"; // update this path
import "@testing-library/jest-dom";

describe("SeasonSettingSkeleton", () => {
  it("renders the skeleton table structure correctly", () => {
    const { container } = render(<SeasonSettingSkeleton />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const headerSkeletons = container.querySelectorAll(
      "thead .MuiSkeleton-root"
    );
    expect(headerSkeletons.length).toBe(4);

    // 5 rows in tbody
    const rows = screen
      .getAllByRole("row")
      .filter((row) => row.parentElement?.tagName.toLowerCase() === "tbody");
    expect(rows.length).toBe(5);

    // Each row should contain 13 Skeletons (1 cell with 1, 3 cells with 4 skeletons each = 1 + 4*3 = 13)
    rows.forEach((row) => {
      const skeletonsInRow = row.querySelectorAll(".MuiSkeleton-root");
      expect(skeletonsInRow.length).toBe(13);
    });
  });

  it("applies custom sx props if provided", () => {
    const { container } = render(
      <SeasonSettingSkeleton sx={{ backgroundColor: "rgb(255, 0, 0)" }} />
    );

    const tableContainer = container.querySelector(".MuiPaper-root");
    expect(tableContainer).toHaveStyle("background-color: rgb(255, 0, 0)");
  });
});
