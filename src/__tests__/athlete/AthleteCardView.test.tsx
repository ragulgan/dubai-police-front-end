// __tests__/AthletesCardView.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import AthletesCardView from "@/components/athlete/AthletesCardView";
import React from "react";

import { useMediaQuery } from "@mui/material";
import "@testing-library/jest-dom";


// jest.mock("@/utils/helper", () => ({
//   safeJSONParse: jest.fn((data) => data),
// }));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "cricket"),
  safeJSONParse: jest.fn((data) => data),
}));

jest.mock("@/utils/datetime", () => ({
  getAge: jest.fn((dob) => {
    if (dob === "01/01/2000") return "20";
    if (dob === "01/01/2001") return "21";
    return "0";
  }),
}));

jest.mock("@/components/athlete/AthleteProfileCard", () => {
  const MockCard = ({
    name,
    dob,
    role,
    personalEmail,
    profileImage,
    onViewClick,
    onEditClick,
  }: any) => (
    <div data-testid="mock-card">
      <p data-testid="name">{name}</p>
      <p data-testid="dob">{dob}</p>
      <p data-testid="role">{role}</p>
      <p data-testid="email">{personalEmail}</p>
      <p data-testid="profileImage">{profileImage}</p>
      <button onClick={onViewClick}>View</button>
      <button onClick={onEditClick}>Edit</button>
    </div>
  );
  MockCard.displayName = "MockAthleteProfileCard";
  return MockCard;
});
jest.mock("@mui/material", () => {
  const original = jest.requireActual("@mui/material");
  return {
    ...original,
    useMediaQuery: jest.fn(),
  };
});

const baseProps = {
  data: [],
  isEdit: jest.fn(),
  isLoading: false,
  label: [],
};

const mockData = [
  {
    athleteID: "1",
    firstName: "John Doe",
    role: "Athlete",
    personalEmail: "john@example.com",
    profileImage: "image.png",
    dob: "01/01/2000",
    performanceLevel: "Elite",
    disciplinePracticed: "Basketball",
  },
];

describe("AthletesCardView - getPageContentHeight", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 66vh for 4K", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:2560px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 66vh");
  });

  it("returns 66vh for FullHD", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:1920px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 66vh");
  });

  it("returns 66vh for 3K", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:1700px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 66vh");
  });

  it("returns 59vh for 2K", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:1535px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 59vh");
  });

  it("returns 66vh for LaptopL", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:1440px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 66vh");
  });

  it("returns 66vh for Laptop", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:1024px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 66vh");
  });

  it("returns 62vh for Tab", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "(min-width:768px)"
    );
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 62vh");
  });

  it("returns 62vh for default", () => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
    const { container } = render(<AthletesCardView {...baseProps} />);
    expect(container.firstChild).toHaveStyle("height: 62vh");
  });
});
describe("AthletesCardView", () => {
  const mockEditHandler = jest.fn();
  const labels = ["Age", "Disciple Practiced"];
  it("shows formatted age if dob is present", () => {
    render(
      <AthletesCardView {...baseProps} data={mockData} isLoading={false} />
    );
    expect(screen.getByTestId("dob")).toHaveTextContent("20");
  });
  it('shows "---" if dob is missing', () => {
    render(
      <AthletesCardView
        {...baseProps}
        data={[{ ...mockData[0], dob: "" }]}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("dob")).toHaveTextContent("---");
  });


  it("renders skeletons when loading", () => {
    const { container } = render(
      <AthletesCardView {...baseProps} isLoading={true} label={labels} />
    );
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders athlete card when data is available", () => {
    render(
      <AthletesCardView
        {...baseProps}
        data={mockData}
        isLoading={false}
        label={labels}
      />
    );
    expect(screen.getByText(/John Doe/i)).toBeDefined();
  });
  it("calls router.push on View click", () => {
    render(
      <AthletesCardView
        {...baseProps}
        data={mockData}
        label={labels}
        isEdit={mockEditHandler}
      />
    );

    const viewButton = screen.getByText(/View/i);
    fireEvent.click(viewButton);
    expect(mockPush).toHaveBeenCalledWith("/teams/cricket/athletes/view/1");
  });
  it("calls isEdit on Edit click", () => {
    render(
      <AthletesCardView
        {...baseProps}
        data={mockData}
        label={labels}
        isEdit={mockEditHandler}
      />
    );

    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);
    expect(mockEditHandler).toHaveBeenCalledWith("1");
  });
});
