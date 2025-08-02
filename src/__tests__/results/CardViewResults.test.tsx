import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import CardViewResults from "@/components/results/CardViewResults";

let mockPush: jest.Mock;
let mockUsePathname: jest.Mock;

jest.mock("next/navigation", () => {
  mockPush = jest.fn();
  mockUsePathname = jest.fn();

  return {
    useRouter: () => ({ push: mockPush }),
    usePathname: () => mockUsePathname(),
  };
});
jest.mock("@/components/results/ResultCard", () => {
  const MockResultCard = (props: any) => (
    <div data-testid="result-card">
      <button onClick={props.onViewClick}>View</button>
      <button onClick={() => props.onEditClick()}>Edit</button>
      {props.eventName}
    </div>
  );
  MockResultCard.displayName = "MockResultCard";
  return MockResultCard;
});


jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn().mockReturnValue("cricket"),
}));

jest.mock("@mui/material", () => {
  const original = jest.requireActual("@mui/material");
  return {
    ...original,
    useMediaQuery: jest.fn().mockReturnValue(true),
  };
});

describe("CardViewResults", () => {
  afterEach(() => {
      jest.resetModules(); 
    jest.clearAllMocks();
  });

  const mockData = [
    {
      resultID: "123",
      eventName: "Final Match",
      eventLocation: "Stadium A",
      eventDate: "2025-07-20",
      eventTime: "18:00",
      comments: "Great match",
      homeTeamName: "Team A",
      awayTeamName: "Team B",
      selectWinner: "Team A",
    },
    {
      resultID: "456",
      eventName: "Semi Final",
      eventLocation: "Stadium B",
      eventDate: "2025-07-18",
      eventTime: "15:00",
      comments: "Close game",
      homeTeamName: "Team C",
      awayTeamName: "Team D",
      selectWinner: "Team D",
    },
  ];

  it("renders no data alert when data is empty", () => {
    render(<CardViewResults data={[]} isLoading={false} />);
    expect(screen.getByText("No record(s) found")).toBeInTheDocument();
  });

  it("renders multiple ResultCard components when data is available", () => {
    render(<CardViewResults data={mockData} isLoading={false} />);
    const cards = screen.getAllByTestId("result-card");
    expect(cards.length).toBe(2);
    expect(screen.getByText("Final Match")).toBeInTheDocument();
    expect(screen.getByText("Semi Final")).toBeInTheDocument();
  });


it("calls router.push on View click for other path", () => {
    mockUsePathname.mockReturnValue("/teams");
  render(
    <CardViewResults
      data={mockData}
      isEdit={jest.fn()}
      isLoading={false}
      sportId="7"
    />
  );

  const viewButtons = screen.getAllByText("View");
  fireEvent.click(viewButtons[0]);

  expect(mockPush).toHaveBeenCalledWith("/teams/cricket/results/view/123");
});
 it("calls router.push on View click for /latest-results path", () => {
  mockUsePathname.mockReturnValue("/latest-results");

  render(
    <CardViewResults
      data={mockData}
      isEdit={jest.fn()}
      isLoading={false}
      sportId="7"
    />
  );

  const viewButtons = screen.getAllByText("View");
  fireEvent.click(viewButtons[0]);

  expect(mockPush).toHaveBeenCalledWith("/latest-results/view/123?sportId=7");
});
  it("calls isEdit with resultID and sportId on Edit click", () => {
    const isEditMock = jest.fn();
    render(
      <CardViewResults
        data={mockData}
        isLoading={false}
        sportId="5"
        isEdit={isEditMock}
      />
    );
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[1]);

    expect(isEditMock).toHaveBeenCalledWith("456", "5");
  });
});