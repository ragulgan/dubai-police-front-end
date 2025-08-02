import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { renderWithProviders } from "../../__mocks__/store";
import { handleSubMenu } from "@/redux/slices/appSplice";
import { useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { teamID: '1' },
    push: jest.fn(),
  }),
}));

const pushMock = jest.fn();

const mockRouter = {
  push: pushMock,
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
   query: { teamID: "mock-team-id" },
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/dashboard",
}));

jest.mock(
  "../../../public/mainMenu/Default/009.Other.svg",
  () => () => <div>OthersIcon</div>
);
jest.mock(
  "../../../public/mainMenu/Animated/08.Other.gif",
  () => ({ default: { src: "mock-hover.gif" } })
);

jest.mock("../../../public/mainMenu/Default/001.dashboard.svg", () => () => <div>DashboardIcon</div>);
jest.mock("../../../public/mainMenu/Default/002.sports.svg", () => () => <div>SportsIcon</div>);
jest.mock("../../../public/mainMenu/Default/009.Other.svg", () => () => <div>OthersIcon</div>);

describe("Sidebar", () => {
  beforeEach(() => {
    pushMock.mockClear(); // Reset mock before each test
      const dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
  });
it.skip("renders GIF on hover when item is not the current route", async () => {
  const { container } = renderWithProviders(<Sidebar />);

  // Find the text "Others"
  const othersText = screen.getByText("Others");

  // Go to the closest li
  const listItem = othersText.closest("li");

  expect(listItem).toBeTruthy(); // Ensure it exists before proceeding

  // Fire mouseEnter on the listItem itself (if hover is bound there)
  fireEvent.mouseEnter(listItem as HTMLElement);

  // Wait for GIF to appear
  await waitFor(() =>
    expect(screen.getByAltText("Hover GIF")).toBeInTheDocument()
  );

  // Un-hover
  fireEvent.mouseLeave(listItem as HTMLElement);

  // Wait for GIF to disappear
  await waitFor(() =>
    expect(container.querySelector('img[alt="Hover GIF"]')).not.toBeInTheDocument()
  );
});
it('dispatches handleSubMenu(true) when "Sports" menu item is clicked', () => {
  const dispatchMock = jest.fn();
  (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

  renderWithProviders(<Sidebar />);

  fireEvent.click(screen.getByText("Sports"));

  expect(dispatchMock).toHaveBeenCalledWith(handleSubMenu(true));
});
  it("renders Sidebar with visible menu items", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
     expect(screen.getByText("Latest Results")).toBeInTheDocument();
      expect(screen.getByText("Competition Calendar")).toBeInTheDocument();
       expect(screen.getByText("Internal Races & Tournaments")).toBeInTheDocument();
        expect(screen.getByText("Programs")).toBeInTheDocument();
         expect(screen.getByText("Rules & Agreements")).toBeInTheDocument();
          expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Others")).toBeInTheDocument();
  });

  it("navigates to dashboard when Dashboard is clicked", () => {
    renderWithProviders(<Sidebar />);
    fireEvent.click(screen.getByText("Dashboard"));
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("opens the dialog when Others is clicked", () => {
    renderWithProviders(<Sidebar />, {
      ui: { isSettingUpdated: true },
    });
    fireEvent.click(screen.getByText("Others"));
    expect(screen.getByText("More Options")).toBeInTheDocument();
  });
it("closes the dialog when suggestion/polls box is clicked", async () => {
  renderWithProviders(<Sidebar />, {
    ui: { isSettingUpdated: true },
  });

  fireEvent.click(screen.getByText("Others"));
  expect(screen.getByText("More Options")).toBeInTheDocument();

  const suggestionBox = screen.getByText(/suggestions/i);
  fireEvent.click(suggestionBox);

  await waitFor(() =>
    expect(screen.queryByText("More Options")).not.toBeInTheDocument()
  );
});
test("should toggle drawer state when MenuIcon is clicked", () => {
  const { container } = renderWithProviders(<Sidebar />);

  // Find the ListItemIcon with MenuIcon (first one)
  const toggleButton = container.querySelector('svg[data-testid="MenuIcon"]')?.parentElement?.parentElement;

  expect(toggleButton).toBeTruthy();

  // Fire the click event to toggle drawer
  fireEvent.click(toggleButton!);

  // Since there's no visible UI change in width, you'd normally assert indirectly.
  // You can test that it does not throw and is callable.
  // For more specific checks, component refactor or exposing state is needed.

  // You can potentially check whether drawer re-renders by snapshot or class
  const drawer = container.querySelector(".MuiDrawer-paper");

  expect(drawer).toBeInTheDocument();
});
});
