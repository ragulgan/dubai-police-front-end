import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import * as router from "next/router";
import * as accessCheck from "@/utils/acessscheck";
import * as rewardsSlice from "@/redux/slices/rewards/rewardsEditSlice";
import { renderWithProviders } from "../../../__mocks__/store";
import RewardsView from "@/components/rewards/view/rewardsView";
import { useRouter } from "next/router";
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.spyOn(accessCheck, "checkAccess").mockImplementation((perm) => {
  // Allow everything
  return true;
});
// Mock editRewards action
const mockEditRewards = jest.spyOn(rewardsSlice, "editRewards");

describe("RewardsView Component", () => {
    beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    query: { id: "1", teamID: "123" },
    pathname: "/training",
    push: jest.fn(), 
  });
});
  it("dispatches editRewards on mount when access is allowed", async () => {
    renderWithProviders(<RewardsView />);
    await waitFor(() => {
      expect(mockEditRewards).toHaveBeenCalledWith({
        url: "/GetRewardsByID",
        payload: { rewardsID: 1, sportID: 123 },
      });
    });
  });
// it("renders reward data when loaded", () => {
//   const preloadedState = {
//   rewardsEdit: {
//     loading: false,
//     data: {
//       rewardName: "Best Athlete",
//       rewardType: "Individual",
//       athleteRank: "1st",
//       athleteFirstName: "John",
//       athleteMiddleName: "K.",
//       athleteSurName: "Doe",
//       dateOfAward: "2024-01-01",
//       totalRewards: 2,
//       raceOrEventSection: "event",
//       raceOrEventText: "100m Dash",
//       result: "Gold",
//       rewardsText: "Trophy, Medal",
//       prizeMoney: "5000",
//       otherOption: "Certificate",
//       remarks: "<p>Excellent performance</p>",
//     },
//   },
// };
//   renderWithProviders(<RewardsView />, { preloadedState });

//   expect(screen.getByText("Best Athlete")).toBeInTheDocument();
//   expect(screen.getByText("1st")).toBeInTheDocument();
//   expect(screen.getByText("John K. Doe")).toBeInTheDocument();
//   expect(screen.getByText("100m Dash")).toBeInTheDocument();
//   expect(screen.getByText("Trophy : Trophy, Medal")).toBeInTheDocument();
//   expect(screen.getByText("Prize Money : 5000")).toBeInTheDocument();
//   expect(screen.getByText("Other : Certificate")).toBeInTheDocument();
//   expect(screen.getByText("Remarks")).toBeInTheDocument();
// });

  it("redirects to / if checkAccess fails", async () => {
    const pushMock = jest.fn();
    (router.useRouter as jest.Mock).mockReturnValue({
      query: { id: "1", teamID: "123" },
      push: pushMock,
    });

    jest.spyOn(accessCheck, "checkAccess").mockReturnValue(false);
    renderWithProviders(<RewardsView />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
it("does not render Edit button if access is denied", () => {
  jest.spyOn(accessCheck, "checkAccess").mockImplementation((perm) => {
    if (perm === 1058) return false;
    return true;
  });

  const preloadedState = {
    rewardsEdit: {
      loading: false,
      data: [
        {
          rewardName: "Sample Reward",
          rewardType: "Team",
          sportName: "Football",
          dateOfAward: "2023-12-12",
          totalRewards: 1,
        },
      ],
    },
  };

  renderWithProviders(<RewardsView />, { preloadedState });

  const editBtns = screen.queryByRole("button", { name: /Edit/i });
  expect(editBtns).not.toBeInTheDocument();
});
it("closes the edit drawer if reason is not 'backdropClick'", async () => {
  jest.spyOn(accessCheck, "checkAccess").mockImplementation((perm) => {
    if (perm === 1058) return true; // 👈 Allow it here
    return true;
  });

  const preloadedState = {
    rewardsEdit: {
      loading: false,
      data: [
        {
          rewardName: "Sample Reward",
          rewardType: "Team",
          sportName: "Football",
          dateOfAward: "2023-12-12",
          totalRewards: 1,
        },
      ],
    },
    rewardsAdd: {
      loading: false, // 👈 Add this slice to avoid crash
      error: null,
      data: null,
    },
    rewardsUpdate: {
      loading: false, // 👈 If your component also uses update loading
      error: null,
      data: null,
    },
  };

  renderWithProviders(<RewardsView />, { preloadedState });

  const editBtn = await screen.findByRole("button", { name: /Edit/i });
  fireEvent.click(editBtn);

  // Simulate click outside drawer (not backdropClick)
  const event = new MouseEvent("click", { bubbles: true });
  document.dispatchEvent(event);

  await waitFor(() => {
    expect(screen.queryByText("Edit Reward")).not.toBeInTheDocument();
  });
});

});