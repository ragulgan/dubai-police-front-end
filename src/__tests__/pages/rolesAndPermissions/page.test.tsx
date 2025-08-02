import React from "react";
import { render, screen } from "@testing-library/react";
import RolesAndPermissionsIndexPage from "@/pages/roles-and-permissions/index";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

// ✅ Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// ✅ Mock dispatch
const mockDispatch = jest.fn();

// ✅ Mock Redux hooks
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) =>
    selector({
      userRole: {
        loading: false,
        code: 200,
        data: [],
      },
      userAccessByRole: {
        loading: false,
        code: 200,
        data: [],
      },
      updateUserAccessByRole: {
        code: 200,
      },
    })
  ),
}));

// ✅ Mock actions (lines 114–116, 122)
jest.mock("@/redux/slices/rolesAndPermissions/userRoleSlice", () => ({
  getUserRoleList: jest.fn(() => ({ type: "MOCK_GET_USER_ROLE_LIST" })),
}));
jest.mock("@/redux/slices/rolesAndPermissions/userAccessByRoleSlice", () => ({
  getUserAccessByRoleList: jest.fn(() => ({
    type: "MOCK_GET_USER_ACCESS_BY_ROLE_LIST",
  })),
}));

// ✅ Mock custom utils and components
jest.mock("@/utils/acessscheck", () => ({
  checkIsAdmin: () => true,
}));

jest.mock("@/components/settings/SettingsSideMenu", () => () => (
  <div data-testid="settings-side-menu" />
));
jest.mock("@/components/nav/BasicBreadcrumbs", () => () => (
  <div data-testid="breadcrumb" />
));

const theme = createTheme();

describe("RolesAndPermissionsIndexPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(
      <ThemeProvider theme={theme}>
        <RolesAndPermissionsIndexPage />
      </ThemeProvider>
    );

    // ✅ Assertions
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("settings-side-menu")).toBeInTheDocument();

    const headerText = screen.getByText("Roles & Permissions");
    expect(headerText).toBeInTheDocument();
  });
});
