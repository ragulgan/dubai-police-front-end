import RolesAndPermissionViewSkeleton from "@/components/skeleton/RolesAndPermissionViewSkeleton";
import { render } from "@testing-library/react";

describe("RolesAndPermissionViewSkeleton",()=>{

  it("renders 3 columns with 40 rows each (240 Skeletons total)", () => {
    const { container } = render(<RolesAndPermissionViewSkeleton />);
    const gridItems = container.querySelectorAll(".MuiGrid-item");
    expect(gridItems).toHaveLength(3);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons).toHaveLength(240);

    expect(skeletons[0]).toHaveStyle("width: 280px");
    expect(skeletons[1]).toHaveStyle("width: 40px");

    // Optional: Each column should have 80 skeletons (40 rows * 2)
    gridItems.forEach((item) => {
      const columnSkeletons = item.querySelectorAll(".MuiSkeleton-root");
      expect(columnSkeletons).toHaveLength(80);
    });
  });
})