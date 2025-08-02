import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BreadcrumbWithBack from "@/components/nav/BreadcrumbWithBack";

// Mock next/router
const mockBack = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock CustomButton to just render a button with label and onClick
jest.mock("@/components/buttons/CustomButton", () => (props: any) => (
  <button onClick={props.onClick}>{props.label}</button>
));

// Mock BasicBreadcrumbs to just render the route titles
jest.mock("@/components/nav/BasicBreadcrumbs", () => (props: any) => (
  <div data-testid="breadcrumbs-mock">{props.routes.map((r: any) => r.title).join(" > ")}</div>
));

describe("BreadcrumbWithBack", () => {
  const routes = [
    { title: "Home", route: "/", currentPage: false, disabled: false },
    { title: "Section", route: "/section", currentPage: false, disabled: false },
    { title: "Current", route: "/current", currentPage: true, disabled: false },
  ];

  it("renders breadcrumbs and back button", () => {
    render(<BreadcrumbWithBack routes={routes} />);
    expect(screen.getByTestId("breadcrumbs-mock")).toHaveTextContent(
      "Home > Section > Current"
    );
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("calls router.back when back button is clicked", () => {
    render(<BreadcrumbWithBack routes={routes} />);
    const backBtn = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backBtn);
    expect(mockBack).toHaveBeenCalled();
  });

  it("passes routes to BasicBreadcrumbs", () => {
    render(<BreadcrumbWithBack routes={routes} />);
    expect(screen.getByTestId("breadcrumbs-mock")).toHaveTextContent(
      "Home > Section > Current"
    );
  });
}); 