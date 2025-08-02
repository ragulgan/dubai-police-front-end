
import React from "react";
import { render, screen } from "@testing-library/react";
import TableSkeleton from "@/components/skeleton/TableSkeleton"; // adjust import path

describe("TableSkeleton", () => {
  it("renders 5 skeleton rows with 6 skeletons each", () => {
    const { container } = render(<TableSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(30); // 5 rows × 6 columns
  });

});