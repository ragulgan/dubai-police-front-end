import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import News from "@/components/news/news";
import * as nextRouter from "next/router";

// Mock next/router to mock useRouter hook
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
  events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  isFallback: false,
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
}));

// Mock useMediaQuery to always return false for simplicity
jest.mock("@mui/material", () => {
  const actualMui = jest.requireActual("@mui/material");
  return {
    ...actualMui,
    useMediaQuery: jest.fn(() => false),
  };
});

// Mock RenderHtmlContent component to simply render text content
// jest.mock("../common/RenderHtmlContent", () => (props: { content: string }) => (
//   <div data-testid="render-html-content">{props.content}</div>
// ));

describe("News Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when listNewsData is missing or empty array", () => {
    const { container } = render(<News listNewsData={[]} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.childNodes.length).toBe(0);
  });
  

  it("renders the News header and View All button", () => {
    const data = [
      {
        newsID: "1",
        articleTitle: "Main Story",
        newsDate: "2023-07-23",
        paragraph: "<p>Main story paragraph</p>",
        filePath: "/main.png",
      },
    ];

    render(<News listNewsData={data} />);

    expect(screen.getByText(/News/i)).toBeInTheDocument();

    const viewAllBtn = screen.getByRole("button", { name: /View All/i });
    expect(viewAllBtn).toBeInTheDocument();

    fireEvent.click(viewAllBtn);
    expect(pushMock).toHaveBeenCalledWith("/news/viewall/news");
  });

  it("renders the main news card and navigates on click", () => {
    const data = [
      {
        newsID: "1",
        articleTitle: "Main Story",
        newsDate: "2023-07-23",
        paragraph: "<p>Main story paragraph</p>",
        filePath: "/main.png",
      },
    ];

    render(<News listNewsData={data} />);

    const mainTitle = screen.getByText("Main Story");
    expect(mainTitle).toBeInTheDocument();

    // Clicking card should navigate to detail page
    // The Card has an onClick attached on parent Box wrapping mainTitle
    const mainCard = mainTitle.closest("div[role='button']") || mainTitle.parentElement?.parentElement;
    expect(mainCard).toBeDefined();

    if (mainCard) {
      fireEvent.click(mainCard);
      expect(pushMock).toHaveBeenCalledWith("news/view/1");
    }
  });

  it("renders second news card when listNewsData has more than 1 item and navigates", () => {
    const data = [
      {
        newsID: "1",
        articleTitle: "Main Story",
        newsDate: "2023-07-23",
        paragraph: "<p>Main story paragraph</p>",
        filePath: "/main.png",
      },
      {
        newsID: "2",
        articleTitle: "Second Story",
        newsDate: "2023-07-22",
        paragraph: "<p>Second story paragraph</p>",
        filePath: "/second.png",
      },
    ];

    render(<News listNewsData={data} />);

    expect(screen.getByText("Second Story")).toBeInTheDocument();

    const secondTitle = screen.getByText("Second Story");
    const secondCard = secondTitle.closest("div[role='button']") || secondTitle.parentElement?.parentElement;
    expect(secondCard).toBeDefined();

    if (secondCard) {
      fireEvent.click(secondCard);
      expect(pushMock).toHaveBeenCalledWith("news/view/2");
    }
  });

  it("renders additional cards sliced from the listNewsData", () => {
    const data = [
      {
        newsID: "1",
        articleTitle: "Main Story",
        newsDate: "2023-07-23",
        paragraph: "<p>Main story paragraph</p>",
        filePath: "/main.png",
      },
      {
        newsID: "2",
        articleTitle: "Second Story",
        newsDate: "2023-07-22",
        paragraph: "<p>Second story paragraph</p>",
        filePath: "/second.png",
      },
      {
        newsID: "3",
        articleTitle: "Third Story",
        newsDate: "2023-07-21",
        paragraph: "<p>Third story paragraph</p>",
        filePath: "/third.png",
      },
      {
        newsID: "4",
        articleTitle: "Fourth Story",
        newsDate: "2023-07-20",
        paragraph: "<p>Fourth story paragraph</p>",
        filePath: "/fourth.png",
      },
      {
        newsID: "5",
        articleTitle: "Fifth Story",
        newsDate: "2023-07-19",
        paragraph: "<p>Fifth story paragraph</p>",
        filePath: "/fifth.png",
      },
    ];

    render(<News listNewsData={data} />);

    expect(screen.getByText("Third Story")).toBeInTheDocument();
    expect(screen.getByText("Fourth Story")).toBeInTheDocument();

    // Fifth Story is not rendered because slice(2, 4) limits to indexes 2 and 3
    expect(screen.queryByText("Fifth Story")).not.toBeInTheDocument();
  });
});
