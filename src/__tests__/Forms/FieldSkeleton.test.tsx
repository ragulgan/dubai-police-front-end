import React from "react";
import { render } from "@testing-library/react";

import '@testing-library/jest-dom';
import FieldSkeleton from "@/components/Forms/FieldSkeleton";

describe("FieldSkeleton", () => {
  it("renders 8 skeletons by default (4 label + 4 field)", () => {
    const { container } = render(<FieldSkeleton />);

    // All Skeletons have class starting with MuiSkeleton-root
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons).toHaveLength(8);
  });

  it("renders avatar skeleton when isAvatar is true", () => {
    const { container } = render(<FieldSkeleton isAvatar={true} />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // avatar + 4 label + 4 field = 9
    expect(skeletons.length).toBe(9);

    const avatar = skeletons[0];
    expect(avatar).toHaveStyle({ width: "80px", height: "80px" });
  });

  it("renders avatar with custom size", () => {
    const { container } = render(<FieldSkeleton isAvatar={true} avatarSize={120} />);
    const avatar = container.querySelector(".MuiSkeleton-circular");

    expect(avatar).toHaveStyle({ width: "120px", height: "120px" });
  });

  it("renders field skeletons with custom width/height", () => {
    const { container } = render(<FieldSkeleton width={300} height={60} />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // Every second skeleton (odd index) is the field
    const fieldSkeletons = Array.from(skeletons).filter((_, i) => i % 2 === 1);
    fieldSkeletons.forEach((skel) => {
      expect(skel).toHaveStyle({ width: "300px", height: "60px" });
    });
  });

  it("renders label skeletons with custom width", () => {
    const { container } = render(<FieldSkeleton labelWidth="40%" />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // Every first skeleton in the pair (even index) is the label
    const labelSkeletons = Array.from(skeletons).filter((_, i) => i % 2 === 0);
    labelSkeletons.forEach((skel) => {
      expect(skel).toHaveStyle({ width: "40%" });
    });
  });
});
