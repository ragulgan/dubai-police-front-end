import StaffProfileCard from "@/components/staff/StaffProfileCard";
import { fireEvent, render ,screen, waitFor} from "@testing-library/react";

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
const onViewClick = jest.fn();
const onEditClick = jest.fn();


  const defaultProps = {
    profileImage: "https://via.placeholder.com/100",
    rank: "Head Coach",
    name: "John Doe",
    personalEmail: "john@example.com",
    roleValue: "coach",
    roleShortText: "Coach",
    contractStart: "2023-01-01",
    contractEnd: "2024-01-01",
    onViewClick: onViewClick,
    onEditClick: onEditClick,
    label: ["Start Date", "End Date"],
    otherStaff: null,
  };
  describe("StaffProfileCard component ",()=>{
    it("renders profile details and buttons", () => {
    render(<StaffProfileCard {...defaultProps} />);

    expect(screen.getByText("Head Coach")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();

    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  
  });
   it("calls onViewClick and onEditClick when buttons are clicked", () => {
    render(<StaffProfileCard {...defaultProps} />);

    fireEvent.click(screen.getByText("View"));
    fireEvent.click(screen.getByText("Edit"));

    expect(onViewClick).toHaveBeenCalledTimes(1);
    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
    it("shows tooltip with name on hover", async () => {
    render(<StaffProfileCard {...defaultProps} />);
    const nameElement = screen.getByText("John Doe");
    fireEvent.mouseOver(nameElement);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
   it("shows tooltip with contractEnd on hover", async () => {
    render(<StaffProfileCard {...defaultProps} />);
    const nameElement = screen.getByText("2024-01-01");
    fireEvent.mouseOver(nameElement);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
  it("displays the Rank when provided", () => {
    render(<StaffProfileCard {...defaultProps} rank="Head Coach"  />);
    expect(screen.getByText("Head Coach")).toBeInTheDocument();

  });

  it('displays "-" when Rank is an empty string', () => {
    render(<StaffProfileCard {...defaultProps} rank=""/>);
    expect(screen.getByText("-")).toBeInTheDocument();
    
  });
    it('displays "-" when name is an empty string', () => {
    render(<StaffProfileCard {...defaultProps} name=""/>);
    expect(screen.getByText("-")).toBeInTheDocument();
    
  });
   it("displays the name when provided", () => {
    render(<StaffProfileCard {...defaultProps} />);
     expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
   it("displays the personalEmail when provided", () => {
    render(<StaffProfileCard {...defaultProps} />);
     expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
  it('displays "---" when personalEmail is an empty string', () => {
    render(<StaffProfileCard {...defaultProps} personalEmail=""/>);
    expect(screen.getByText("---")).toBeInTheDocument();
    
  });

});
