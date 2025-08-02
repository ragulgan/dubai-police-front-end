import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../__mocks__/store";

import * as accessCheck from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import ResultCard from "@/components/results/ResultCard";

jest.mock("../../../public/EditSVG.svg", () => () => <svg>Edit</svg>);
jest.mock("../../../public/Location.svg", () => () => <svg>Location</svg>);
jest.mock("../../../public/calendarResult.svg", () => () => <svg>Calendar</svg>);

describe("ResultCard Component", () => {
  const defaultProps = {
    eventName: "Championship Final",
    eventLocation: "Stadium XYZ",
    eventDate: "25 July 2025",
    homeTeamName: "Alpha FC",
    awayTeamName: "Beta FC",
    selectWinner: "Alpha FC",
    comments: "<p>This is a <strong>comment</strong> with HTML.</p>",
    onViewClick: jest.fn(),
    onEditClick: jest.fn(),
    module: "result",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render event details and team names", () => {
    renderWithProviders(<ResultCard {...defaultProps} />);
    expect(screen.getByText(/championship final/i)).toBeInTheDocument();
    expect(screen.getByText(/stadium xyz/i)).toBeInTheDocument();
    expect(screen.getByText(/25 july 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/alpha fc/i)).toBeInTheDocument();
    expect(screen.getByText(/beta fc/i)).toBeInTheDocument();
  });

  it("should render winner chip for selected winner", () => {
    renderWithProviders(<ResultCard {...defaultProps} />);
    expect(screen.getByText(/winner/i)).toBeInTheDocument();
  });

  it("should strip HTML tags and render plain comment text", () => {
    renderWithProviders(<ResultCard {...defaultProps} />);
    expect(screen.getByText(/comments: this is a comment with html/i)).toBeInTheDocument();
  });

  it("should call onViewClick when View button is clicked", () => {
    jest.spyOn(accessCheck, "checkAccess").mockReturnValue(true);
    renderWithProviders(<ResultCard {...defaultProps} />);
    const viewButton = screen.getByText(/view/i);
    fireEvent.click(viewButton);
    expect(defaultProps.onViewClick).toHaveBeenCalled();
  });

  it("should call onEditClick when Edit button is clicked", () => {
    jest.spyOn(accessCheck, "checkAccess").mockImplementation((perm) =>
      perm === USER_PERMISSION.ResultEdit
    );
    renderWithProviders(<ResultCard {...defaultProps} />);
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    expect(defaultProps.onEditClick).toHaveBeenCalled();
  });

  it("should not show View and Edit buttons without permission", () => {
    jest.spyOn(accessCheck, "checkAccess").mockReturnValue(false);
    renderWithProviders(<ResultCard {...defaultProps} />);
    expect(screen.queryByText(/view/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
  });

  // it("should truncate long eventName and team names", () => {
  //   const longProps = {
  //     ...defaultProps,
  //     eventName: "A very long event name that exceeds forty characters easily",
  //     homeTeamName: "Super Long Home Team Name That Exceeds Limit",
  //     awayTeamName: "Another Extremely Long Away Team Name Too",
  //   };
  //   renderWithProviders(<ResultCard {...longProps} />);
  //   expect(screen.getByText(/a very long event name that exceeds fo\.\.\./i)).toBeInTheDocument();
  //   expect(screen.getByText(/super long home team name that exceed\.\.\./i)).toBeInTheDocument();
  //   expect(screen.getByText(/another extremely long away team name\.\.\./i)).toBeInTheDocument();
  // });
});