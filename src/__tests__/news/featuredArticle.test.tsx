import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FeaturedArticle from "@/components/news/featuredArticle";

// Mock dependencies
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../../../public/FeaturedArticle.svg", () => (props: any) => (
  <svg data-testid="featured-article-logo" {...props} />
));

jest.mock("@/components/news/cardCarousel", () => (props: any) => (
  <div data-testid="carousel-mock">carousel</div>
));

const listNewsData = [
  {
    articleTitle: "Title 1",
    newsDate: "2024-01-01",
    paragraph: "Paragraph 1",
    filePath: "/img1.jpg",
    newsID: 1,
  },
  {
    articleTitle: "Title 2",
    newsDate: "2024-01-02",
    paragraph: "Paragraph 2",
    filePath: "/img2.jpg",
    newsID: 2,
  },
];

describe("FeaturedArticle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Featured Article title and logo", () => {
    render(<FeaturedArticle listNewsData={listNewsData} />);
    expect(screen.getByText("Featured Article")).toBeInTheDocument();
    expect(screen.getByTestId("featured-article-logo")).toBeInTheDocument();
  });

  it("renders the View All button and navigates on click", () => {
    render(<FeaturedArticle listNewsData={listNewsData} />);
    const btn = screen.getByRole("button", { name: /view all/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith("/news/viewall/featuredArticle");
  });

  it("renders the SimpleSlider (cardCarousel)", () => {
    render(<FeaturedArticle listNewsData={listNewsData} />);
    expect(screen.getByTestId("carousel-mock")).toBeInTheDocument();
  });

  it("renders nothing if listNewsData is empty", () => {
    const { container } = render(<FeaturedArticle listNewsData={[]} />);
    // Should not render the title, logo, or carousel
    expect(screen.queryByText("Featured Article")).not.toBeInTheDocument();
    expect(screen.queryByTestId("featured-article-logo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("carousel-mock")).not.toBeInTheDocument();
    // Should render only the outer Box
    expect(container.firstChild).toBeInTheDocument();
  });
}); 