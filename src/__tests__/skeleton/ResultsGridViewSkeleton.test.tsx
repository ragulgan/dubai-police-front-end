import ResultsGridViewSkeleton from "@/components/skeleton/ResultsGridViewSkeleton";
import { render,screen } from "@testing-library/react";

describe("ResultsGridViewSkeleton", () => {
  it("renders 5 skeleton rows with 6 skeletons each", () => {
    const { container } = render(<ResultsGridViewSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(32); // 4 rows × 8 columns
  });
it("renders 8 rectangular skeletons", () => {
  const { container } = render(<ResultsGridViewSkeleton />);
  const rectangularSkeletons = container.querySelectorAll(
    ".MuiSkeleton-root.MuiSkeleton-rectangular"
  );
  expect(rectangularSkeletons).toHaveLength(8);

  rectangularSkeletons.forEach((el) => {
    expect(el).toHaveStyle("height: 431px");
  });
});
it("renders 24 text skeletons", () => {
  const { container } = render(<ResultsGridViewSkeleton />);
  const textSkeletons = container.querySelectorAll(
    ".MuiSkeleton-root.MuiSkeleton-text"
  );
  expect(textSkeletons).toHaveLength(24);
});
});