import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import LandingPageCard from "@/components/GoalandTargets/LandingPageCard";

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(),
}));

const mockOnViewClick = jest.fn();
const mockOnEditClick = jest.fn();

const defaultProps = {
  titleLabel: "Long-term Goals",
  contentText: "This is a test content for long-term goals.",
  loading: false,
  onViewClick: mockOnViewClick,
  onEditClick: mockOnEditClick,
};

describe("LandingPageCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and content correctly", () => {
    (checkAccess as jest.Mock).mockReturnValue(false);

    render(<LandingPageCard {...defaultProps} />);

    expect(screen.getByText("Long-term Goals")).toBeInTheDocument();
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it("calls onViewClick when card is clicked", async () => {
    (checkAccess as jest.Mock).mockReturnValue(false);

    render(<LandingPageCard {...defaultProps} />);
    const card = screen.getByText(/test content/i).closest("div");
    await userEvent.click(card!);
    expect(mockOnViewClick).toHaveBeenCalled();
  });

  it("renders Edit button if user has access", () => {
    (checkAccess as jest.Mock).mockReturnValue(true);

    render(<LandingPageCard {...defaultProps} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("does not render Edit button if user not have access", () => {
    (checkAccess as jest.Mock).mockReturnValue(false);

    render(<LandingPageCard {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
  });

  it("calls onEditClick when Edit button is clicked", async () => {
    (checkAccess as jest.Mock).mockReturnValue(true);

    render(<LandingPageCard {...defaultProps} />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);
    expect(mockOnEditClick).toHaveBeenCalled();
  });



  it("truncates long content to 200 characters", () => {
    (checkAccess as jest.Mock).mockReturnValue(false);

    const longContent = "a".repeat(250);
    render(<LandingPageCard {...defaultProps} contentText={longContent} />);
    expect(screen.getByText(`${"a".repeat(200)}...`)).toBeInTheDocument();
  });
});
