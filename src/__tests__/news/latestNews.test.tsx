import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LatestNews from "@/components/news/latestNews";
import * as nextRouter from "next/router";

// Mock Next.js useRouter hook
const pushMock = jest.fn();
jest.spyOn(nextRouter, "useRouter").mockImplementation(() => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    basePath: "",
    push: pushMock,
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
  }));

describe("LatestNews Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when listNewsData is empty array", () => {
    const { container } = render(<LatestNews listNewsData={[]} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.childNodes.length).toBe(0);
  });

  it("renders Latest News header and View All button", () => {
    const mockData = [
      {
        newsID: "1",
        articleTitle: "Test News Title",
        newsDate: "2023-07-23",
        paragraph: "<p>Test paragraph content</p>",
        filePath: "/test-image.png",
      },
      {
        newsID: "2",
        articleTitle: "Second News",
        newsDate: "2023-07-22",
        paragraph: "<p>Other news content</p>",
        filePath: "/second-image.png",
      },
    ];

    render(<LatestNews listNewsData={mockData} />);

    expect(screen.getByText(/Latest News/i)).toBeInTheDocument();

    const viewAllButton = screen.getByRole("button", { name: /View All/i });
    expect(viewAllButton).toBeInTheDocument();

    // Clicking View All navigates correctly
    fireEvent.click(viewAllButton);
    expect(pushMock).toHaveBeenCalledWith("/news/viewall/latestNews");
  });

  it("renders main news card with correct data", () => {
    const mockData = [
      {
        newsID: "1",
        articleTitle: "Test Main News",
        newsDate: "2023-07-23",
        paragraph: "<p>Some main paragraph</p>",
        filePath: "/main-image.png",
      },
    ];

    render(<LatestNews listNewsData={mockData} />);

    const mainCardTitle = screen.getByText("Test Main News");
    expect(mainCardTitle).toBeInTheDocument();

    const mainCardDate = screen.getByText("2023-07-23");
    expect(mainCardDate).toBeInTheDocument();

    // Clicking main card triggers router push to news detail page
    const mainCard = mainCardTitle.closest("div[role='button']") || mainCardTitle.parentElement?.parentElement;
    expect(mainCard).toBeDefined();

    if (mainCard) {
      fireEvent.click(mainCard);
      expect(pushMock).toHaveBeenCalledWith("news/view/1");
    }
  });

  it("renders multiple additional news cards", () => {
    const mockData = [
      {
        newsID: "1",
        articleTitle: "Main News",
        newsDate: "2023-07-23",
        paragraph: "<p>Main news paragraph</p>",
        filePath: "/image1.png",
      },
      {
        newsID: "2",
        articleTitle: "News 2",
        newsDate: "2023-07-22",
        paragraph: "<p>Second news paragraph</p>",
        filePath: "/image2.png",
      },
      {
        newsID: "3",
        articleTitle: "News 3",
        newsDate: "2023-07-21",
        paragraph: "<p>Third news paragraph</p>",
        filePath: "/image3.png",
      },
    ];

    render(<LatestNews listNewsData={mockData} />);

    // The first news is the main card, so additional cards start from the second item
    expect(screen.getByText("News 2")).toBeInTheDocument();
    expect(screen.getByText("News 3")).toBeInTheDocument();
  });
});
