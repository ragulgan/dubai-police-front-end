import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardCarousel from "@/components/news/cardCarousel";
import { checkAccess } from "@/utils/acessscheck";

// Mock dependencies
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("react-material-ui-carousel", () => (props: any) => (
  <div data-testid="carousel-mock">{props.children}</div>
));

jest.mock("@/utils/acessscheck", () => ({
  checkAccess: jest.fn(),
}));

jest.mock("@/components/common/RenderHtmlContent", () => (props: any) => (
  <div data-testid="html-content-mock">{props.content}</div>
));

const listNewsData = Array.from({ length: 10 }, (_, i) => ({
  newsID: i,
  filePath: `path/to/image${i}.jpg`,
  articleTitle: `Article ${i}`,
  newsDate: `2024-01-0${i + 1}`,
  paragraph: `Paragraph ${i}`,
}));

describe("CardCarousel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default module", () => {
    (checkAccess as jest.Mock).mockReturnValue(true);
    render(<CardCarousel listNewsData={listNewsData} module="default" />);
    // Should render first 4 items
    expect(screen.getByText("Article 0")).toBeInTheDocument();
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.queryByText("Article 4")).not.toBeInTheDocument();
  });

  it("renders correctly with 'clubNews' module", () => {
    (checkAccess as jest.Mock).mockReturnValue(true);
    render(<CardCarousel listNewsData={listNewsData} module="clubNews" />);
    // Should render items 4 to 8
    expect(screen.queryByText("Article 3")).not.toBeInTheDocument();
    expect(screen.getByText("Article 4")).toBeInTheDocument();
    expect(screen.getByText("Article 8")).toBeInTheDocument();
    expect(screen.queryByText("Article 9")).not.toBeInTheDocument();
  });

  it("navigates on card click if user has permission", () => {
    (checkAccess as jest.Mock).mockReturnValue(true);
    render(<CardCarousel listNewsData={listNewsData} module="default" />);
    fireEvent.click(screen.getByText("Article 0"));
    expect(mockPush).toHaveBeenCalledWith("news/view/0");
  });

  it("does not navigate on card click if user lacks permission", () => {
    (checkAccess as jest.Mock).mockReturnValue(false);
    render(<CardCarousel listNewsData={listNewsData} module="default" />);
    fireEvent.click(screen.getByText("Article 0"));
    expect(mockPush).not.toHaveBeenCalled();
  });
}); 