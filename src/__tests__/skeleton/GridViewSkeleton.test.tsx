import GridViewSkeleton from "@/components/skeleton/GridViewSkeleton";
import { render,screen } from "@testing-library/react";

describe("GridViewSkeleton", () => {
  it("renders 4 skeleton rows with 8 skeletons each", () => {
    const { container } = render(<GridViewSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(32); // 4 rows × 8 columns
  });
it("renders 8 rectangular skeletons", () => {
  const { container } = render(<GridViewSkeleton />);
  const rectangularSkeletons = container.querySelectorAll(
    ".MuiSkeleton-root.MuiSkeleton-rectangular"
  );
  expect(rectangularSkeletons).toHaveLength(8);

  rectangularSkeletons.forEach((el) => {
    expect(el).toHaveStyle("height: 200px");
  });
});
it("renders 24 text skeletons", () => {
  const { container } = render(<GridViewSkeleton />);
  const textSkeletons = container.querySelectorAll(
    ".MuiSkeleton-root.MuiSkeleton-text"
  );
  expect(textSkeletons).toHaveLength(24);
});
});