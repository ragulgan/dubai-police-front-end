import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "../../../pages/news/index";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as accessCheck from "@/utils/acessscheck";

jest.mock("@/components/news/latestNews", () => () => <div>LatestNews</div>);
jest.mock("@/components/news/featuredArticle", () => () => (
  <div>FeaturedArticle</div>
));
jest.mock("@/components/news/clubNews", () => () => <div>ClubNews</div>);
jest.mock("@/components/news/news", () => () => <div>News</div>);
jest.mock(
  "@/components/buttons/AppAddButton",
  () =>
    ({ label, onClick }: any) =>
      <button onClick={onClick}>{label}</button>
);
jest.mock(
  "@/components/search/ModuleSearchInput",
  () =>
    ({ searchText, setSearchText }: any) =>
      (
        <input
          placeholder="Search by News, Title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )
);

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.useFakeTimers();

describe("News Page", () => {
  const mockPush = jest.fn();

  const createMockStore = (preloadedState = {}) =>
    configureStore({
      reducer: (state = preloadedState, action) => {
        if (action.type === "LIST_NEWS") {
          return {
            ...state,
            listNews: {
              loading: false,
              data: {
                "Latest News": [{ id: 1 }],
                "Featured Article": [{ id: 2 }],
                "Club's News": [{ id: 3 }],
                News: [{ id: 4 }],
              },
            },
          };
        }
        return state;
      },
      preloadedState: {
        listNews: {
          loading: false,
          data: {},
        },
        ...preloadedState,
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: "/news",
    });
  });

  const renderPage = (preloadedState = {}) => {
    return render(
      <Provider store={createMockStore(preloadedState)}>
        <Page />
      </Provider>
    );
  };

  it("renders skeleton when loading", () => {
    renderPage({
      listNews: {
        loading: true,
        data: {},
      },
    });
  });

  it("shows no records alert when no news found", () => {
    renderPage({
      listNews: {
        loading: false,
        data: {},
      },
    });
  });

  it("renders all news blocks when data is present", () => {
    renderPage({
      listNews: {
        loading: false,
        data: {
          "Latest News": [{}],
          "Featured Article": [{}],
          "Club's News": [{}],
          News: [{}],
        },
      },
    });

    expect(screen.getByText("LatestNews")).toBeInTheDocument();
    expect(screen.getByText("FeaturedArticle")).toBeInTheDocument();
    expect(screen.getByText("ClubNews")).toBeInTheDocument();
  });

  it("renders search input and allows typing", async () => {
    renderPage();

    const input = screen.getByPlaceholderText(/Search by News, Title/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Dubai" } });
    expect(input).toHaveValue("Dubai");

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(input).toHaveValue("Dubai");
    });
  });

  it("shows Create News button when access is granted", () => {
    jest.spyOn(accessCheck, "checkAccess").mockReturnValue(true);

    renderPage();

    const btn = screen.getByText("Create News");
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith("/news/createNews");
  });

  it("hides Create News button when access is denied", () => {
    jest.spyOn(accessCheck, "checkAccess").mockReturnValue(false);

    renderPage();
    expect(screen.queryByText("Create News")).not.toBeInTheDocument();
  });
});
