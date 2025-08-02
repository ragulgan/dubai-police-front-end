import RolesAndPermissionListSkeleton from "@/components/skeleton/RolesAndpermissionListSkeletion";
import { render } from "@testing-library/react";

describe("RolesAndPermissionListSkeleton", () => {
  it("renders 7 accordion skeletons with rectangular and text variants", () => {
    const { container } = render(<RolesAndPermissionListSkeleton />);

    // Find all rectangular skeletons (expand icons)
    const rectangularSkeletons = container.querySelectorAll(
      ".MuiSkeleton-root.MuiSkeleton-rectangular"
    );
    expect(rectangularSkeletons).toHaveLength(7);

    // Find all text skeletons (accordion headers)
    const textSkeletons = container.querySelectorAll(
      ".MuiSkeleton-root.MuiSkeleton-text"
    );
    expect(textSkeletons).toHaveLength(7);

    // Ensure 7 accordions rendered
    const accordions = container.querySelectorAll(".MuiAccordion-root");
    expect(accordions).toHaveLength(7);

    // Optional: test one height
    expect(rectangularSkeletons[0]).toHaveStyle("width: 32px");
    expect(rectangularSkeletons[0]).toHaveStyle("height: 32px");
    expect(textSkeletons[0]).toHaveStyle("height: 30px");
  });
});