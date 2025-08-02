import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";

const routes = [
  { title: "Home", route: "/", currentPage: false, disabled: false },
  { title: "Section", route: "/section", currentPage: false, disabled: true },
  { title: "Current", route: "/current", currentPage: true, disabled: false },
];

describe("BasicBreadcrumbs", () => {
  it("renders all breadcrumb items", () => {
    render(<BasicBreadcrumbs routes={routes} setOpen={jest.fn()} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders current page as Typography, not Link", () => {
    render(<BasicBreadcrumbs routes={routes} setOpen={jest.fn()} />);
    const current = screen.getByText("Current");
    expect(current.tagName).toBe("P"); // Typography renders as span
  });

  it("renders link for non-current, non-disabled items", () => {
    render(<BasicBreadcrumbs routes={routes} setOpen={jest.fn()} />);
    const link = screen.getByText("Home");
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });

  it("calls setOpen when disabled item is clicked", () => {
    const setOpen = jest.fn();
    render(<BasicBreadcrumbs routes={routes} setOpen={setOpen} />);
    const disabled = screen.getByText("Section");
    fireEvent.click(disabled);
    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it("does not crash with empty routes", () => {
    render(<BasicBreadcrumbs routes={[]} setOpen={jest.fn()} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
}); 