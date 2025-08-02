import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardView from "@/components/news/cardView";

// Mock dependencies
const mockReplace = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(),
}));
import { checkAccess } from "@/utils/acessscheck";

jest.mock("@/components/common/RenderHtmlContent", () => (props: any) => (
  <div data-testid="html-content-mock">{props.content}</div>
));

jest.mock("lodash", () => ({
  isEmpty: (val: any) => !val || (Array.isArray(val) && val.length === 0),
}));

jest.mock("../../../public/staticFoodImage.svg", () => (props: any) => (
  <svg className={props.className} data-testid="static-image" />
));

const defaultProps = {
  title: "Test News Title",
  date: "2024-01-01",
  paragraph: "Test paragraph content.",
  image: "",
  id: 42,
};

describe("CardView", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders title, date, and paragraph", () => {
    render(<CardView {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
    expect(screen.getByTestId("html-content-mock")).toHaveTextContent(defaultProps.paragraph);
  });

  it("renders default image if image is empty", () => {
    const { container } = render(<CardView {...defaultProps} image="" />);
    expect(screen.getByTestId("static-image")).toBeInTheDocument();
  });

  it("renders provided image if image is not empty", () => {
    render(<CardView {...defaultProps} image="/test-image.jpg" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test-image.jpg");
  });

  it("navigates on card click if user has permission", () => {
    (checkAccess as jest.Mock).mockReturnValue(true);
    render(<CardView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockReplace).toHaveBeenCalledWith("/news/view/42");
  });

  it("does not navigate on card click if user lacks permission", () => {
    (checkAccess as jest.Mock).mockReturnValue(false);
    render(<CardView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockReplace).not.toHaveBeenCalled();
  });
}); 