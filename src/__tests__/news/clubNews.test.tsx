import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClubNews from "@/components/news/clubNews";

// Mock dependencies
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("../../../public/ClubNews.svg", () => (props: any) => (
  <svg data-testid="club-news-logo" {...props} />
));

jest.mock("@/components/news/cardView", () => (props: any) => (
  <div data-testid="card-view-mock">{props.title}</div>
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

describe("ClubNews", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Club's News title and logo", () => {
    render(<ClubNews listNewsData={listNewsData} />);
    expect(screen.getByText("Club's News")).toBeInTheDocument();
    expect(screen.getByTestId("club-news-logo")).toBeInTheDocument();
  });

  it("renders the View All button and navigates on click", () => {
    render(<ClubNews listNewsData={listNewsData} />);
    const btn = screen.getByRole("button", { name: /view all/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith("/news/viewall/clubNews");
  });

  it("renders CardView for each news item", () => {
    render(<ClubNews listNewsData={listNewsData} />);
    expect(screen.getAllByTestId("card-view-mock")).toHaveLength(listNewsData.length);
    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("renders the SimpleSlider (cardCarousel)", () => {
    render(<ClubNews listNewsData={listNewsData} />);
    expect(screen.getByTestId("carousel-mock")).toBeInTheDocument();
  });

  it("renders nothing if listNewsData is empty", () => {
    render(<ClubNews listNewsData={[]} />);
    expect(screen.queryByText("Club's News")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-view-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("carousel-mock")).not.toBeInTheDocument();
  });
}); 