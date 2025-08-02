import { render, screen } from "@testing-library/react";
import ProgressBar from "@/components/Progressbar";
import "@testing-library/jest-dom";

const mockData = [
  { shipmentStatus: 0 }, // pending
  { shipmentStatus: 1 }, // fulfilled
  { shipmentStatus: 2 }, // cancelled

];

const mockGetTeamRequirementLists = {
  loading: false,
};
describe("ProgressBar Component ",()=>{
    it("renders total count and status legends correctly", () => {
  render(
    <ProgressBar
      total={4}
      getTeamRequirementLists={mockGetTeamRequirementLists}
      data={mockData}
    />
  );

  expect(screen.getByText("4")).toBeInTheDocument();
  expect(screen.getByText("Total")).toBeInTheDocument();

  expect(screen.getByText("Fulfilled")).toBeInTheDocument();
  expect(screen.getByText("Pending")).toBeInTheDocument();
  expect(screen.getByText("Cancelled")).toBeInTheDocument();
});
   it("renders circular and text Skeletons when loading", () => {
    render(
      <ProgressBar
        total={0}
        getTeamRequirementLists={{ loading: true }}
        data={[]}
      />
    );

    // Query all circular skeletons by class
    const circularSkeletons = document.querySelectorAll(".MuiSkeleton-circular");
    const textSkeletons = document.querySelectorAll(".MuiSkeleton-text");

    // Expect 3 circular + 3 text skeletons (per loading legend items)
    expect(circularSkeletons).toHaveLength(3);
    expect(textSkeletons.length).toBeGreaterThanOrEqual(3); // others exist too
  });
  it("should fallback to empty array when data is null", () => {
  render(
    <ProgressBar
      total={0}
      getTeamRequirementLists={{ loading: false }}
      data={null}
    />
  );

  // No bars should render (they’re zero-width), but the Total should still show
  expect(screen.getByText("0")).toBeInTheDocument();
});

})