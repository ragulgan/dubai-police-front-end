import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import CardListResults from "@/components/results/CardListResults";

// Mock useRouter and usePathname
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock permissions and helpers
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: () => true,
}));
jest.mock("@/utils/helper", () => ({
  getLocalStorage: () => "mockSportId",
}));

const pushMock = jest.fn();

describe("CardListResults", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (usePathname as jest.Mock).mockReturnValue("/latest-results");
    pushMock.mockClear();
  });
 it("renders loading skeletons when isLoading is true", () => {
    render(
      <CardListResults
        data={[]}
        isLoading={true}
        module="latest-result"
        isEdit={jest.fn()}
        sportId={7}
        setPage={jest.fn()}
        page={1}
        setRowsPerPage={jest.fn()}
        rowsPerPage={10}
      />
    );

     const skeletons = document.querySelectorAll(".MuiSkeleton-root");
       expect(skeletons.length).toBeGreaterThan(0);
  });
  it("renders result data and calls router.push on view", () => {
    const data = [
      {
        resultID: 123,
        eventName: "Event One",
        eventLocation: "Dubai",
        eventDate: "2025-07-25",
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        selectWinner: "Team A",
        comments: "<p>Test comment</p>",
      },
    ];

    render(
      <CardListResults
        data={data}
        isLoading={false}
        module="latest-result"
        sportId={7}
        setPage={() => {}}
        page={1}
        setRowsPerPage={() => {}}
        rowsPerPage={10}
        isEdit={jest.fn()}
      />
    );

    // View button
    const viewBtn = screen.getByRole("button", { name: /view/i });
    fireEvent.click(viewBtn);
    expect(pushMock).toHaveBeenCalledWith(
      "/latest-results/view/123?sportId=7"
    );
  });

  it("renders 'No record(s) found' when data is empty", () => {
    render(
      <CardListResults
        data={[]}
        isLoading={false}
        module="latest-result"
        sportId={7}
        setPage={() => {}}
        page={1}
        setRowsPerPage={() => {}}
        rowsPerPage={10}
      />
    );
    expect(screen.getByText(/No record\(s\) found/i)).toBeInTheDocument();
  });
});