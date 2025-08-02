import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AthleteProfileCard from "@/components/athlete/AthleteProfileCard";

// ✅ Mock checkAccess
jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(() => true),
}));

// ✅ Optional: Mock router if used
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const onViewClick = jest.fn();
const onEditClick = jest.fn();

const defaultProps = {
  profileImage: "/Uploads/Athlete/218/ProfileImage/Profile image.png",
  role: "12",
  name: "test",
  personalEmail: "testtest@gmail.com",
  onViewClick,
  onEditClick,
  label: ["Age", "Disciple Practiced"],
  dob: "37",
  performanceLevel: "Advanced",
  disciplePracticed: "Yes",
};

describe("AthleteProfileCard", () => {
  beforeEach(() => {
    onViewClick.mockClear();
    onEditClick.mockClear();
  });

  it("renders the name, role, email, performance level and discipline", () => {
    render(<AthleteProfileCard {...defaultProps} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("testtest@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders the labels correctly", () => {
    render(<AthleteProfileCard {...defaultProps} />);
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Disciple Practiced")).toBeInTheDocument();
  });

  it("renders view and edit buttons", () => {
    render(<AthleteProfileCard {...defaultProps} />);
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("calls onViewClick when View is clicked", () => {
    render(<AthleteProfileCard {...defaultProps} />);
    fireEvent.click(screen.getByText("View"));
    expect(onViewClick).toHaveBeenCalled();
  });

  it("calls onEditClick when Edit is clicked", () => {
    render(<AthleteProfileCard {...defaultProps} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(onEditClick).toHaveBeenCalled();
  });
});

describe("AthleteProfileCard - Tooltip display", () => {
  it("shows tooltip with name on hover", async () => {
    render(<AthleteProfileCard {...defaultProps} />);
    const nameElement = screen.getByText("test");
    fireEvent.mouseOver(nameElement);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("shows tooltip for disciplePracticed on hover", async () => {
    render(<AthleteProfileCard {...defaultProps} />);
    const disciplineElement = screen.getByText("Yes");
    fireEvent.mouseOver(disciplineElement);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});

describe("AthleteProfileCard - performanceLevel display", () => {
  it.each(["Advanced", "Intermediate", "Beginner"])(
    'renders "%s" chip when performanceLevel is "%s"',
    (level) => {
      render(
        <AthleteProfileCard {...defaultProps} performanceLevel={level} />
      );
      expect(screen.getByText(level)).toBeInTheDocument();
    }
  );

  it('renders "Beginner" chip when performanceLevel is empty string', () => {
    render(<AthleteProfileCard {...defaultProps} performanceLevel="" />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it('renders "Beginner" chip when performanceLevel is undefined', () => {
    render(
      <AthleteProfileCard {...defaultProps} performanceLevel={undefined} />
    );
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });
});

describe("AthleteProfileCard - Role display", () => {
  it("displays the role when provided", () => {
    render(<AthleteProfileCard {...defaultProps} role="Admin" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it('displays "-" when role is an empty string', () => {
    render(<AthleteProfileCard {...defaultProps} role="" />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});

describe("AthleteProfileCard - Name display", () => {
  it("displays the name when provided", () => {
    render(<AthleteProfileCard {...defaultProps} name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it('displays "-" when name is an empty string', () => {
    render(<AthleteProfileCard {...defaultProps} name="" />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});

describe("AthleteProfileCard - Personal Email display", () => {
  it("displays the email when provided", () => {
    render(
      <AthleteProfileCard
        {...defaultProps}
        personalEmail="john.doe@example.com"
      />
    );
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it('displays "-" when email is an empty string', () => {
    render(<AthleteProfileCard {...defaultProps} personalEmail="" />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
