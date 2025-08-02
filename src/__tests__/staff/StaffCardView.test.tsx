import StaffCardView from "@/components/staff/StaffCardView";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/helper", () => ({
  getLocalStorage: jest.fn(() => "cricket"),
  safeJSONParse: jest.fn(() => [
    {
      moduleID: "STAFF_PROFILE",
      accessable: 1,
    },
  ]),
}));

jest.mock("@/components/staff/StaffProfileCard", () => {
  const MockCard = ({
    name,
    personalEmail,
    onViewClick,
    onEditClick,
  }: any) => (
    <div data-testid="mock-card">
      <p>{name}</p>
      <p>{personalEmail}</p>
      <button onClick={onViewClick}>View</button>
      <button onClick={onEditClick}>Edit</button>
    </div>
  );
  return { __esModule: true, default: MockCard };
});
const mockProfile = {
  staffID: "123",
  profileImage: "profile.jpg",
  rank: "Captain",
  firstName: "John",
  personalEmail: "john@example.com",
  roleValue: "coach",
  roleShortText: "HC",
  otherStaff: null,
  contractStartDate: "2022-01-01",
  contractEndDate: "2023-01-01",
};


describe("StaffCardView Component", () => {
  const push = jest.fn();
  const editHandler = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders staff card when data is available", () => {
    render(<StaffCardView data={[mockProfile]}  isEdit={editHandler}  isLoading={false}  label="Staff"  /> );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
it("calls isEdit on Edit click", () => {
  render( <StaffCardView  data={[mockProfile]}  isEdit={editHandler} isLoading={false} label="Staff" /> );

  const editButton = screen.getByText(/Edit/i);
  fireEvent.click(editButton);
  expect(editHandler).toHaveBeenCalledWith("123");
});
 it("calls router.push on View click", () => {
    render( <StaffCardView  data={[mockProfile]}  isEdit={editHandler} isLoading={false} label="Staff" /> );


    const viewButton = screen.getByText(/View/i);
    fireEvent.click(viewButton);
    expect(push).toHaveBeenCalledWith("/teams/cricket/staffs/view/123");
  });
});
