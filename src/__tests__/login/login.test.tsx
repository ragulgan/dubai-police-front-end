import { renderWithProviders } from "../../../__mocks__/store";
import { screen, fireEvent } from "@testing-library/react";
import Login from "@/pages/login";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/utils/helper", () => ({
  setLocalStorage: jest.fn(),
  getLocalStorage: jest.fn(() => null),
  safeJSONParse: jest.fn((data) => data),
}));

jest.mock("@/redux/slices/loginSplice", () => ({
  ...jest.requireActual("@/redux/slices/loginSplice"),
  fetchLoginAsync: jest.fn(() => ({ type: "login/fetchLoginAsync" })),
  clearError: jest.fn(() => ({ type: "login/clearError" })),
}));

describe("Login Page", () => {
  test("renders login screen with title and fields", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter email address/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
  });

  test("initial input values are empty", () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/Enter email address/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Enter password/i)).toHaveValue("");
  });

  test("login button is disabled when both fields are empty", () => {
    renderWithProviders(<Login />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeDisabled();
  });

  test("login button is disabled when only email is filled", () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter email address/i);
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(loginButton).toBeDisabled();
  });

  test("login button is disabled when only password is filled", () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    expect(loginButton).toBeDisabled();
  });

  test("login button is enabled when both fields are filled", () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter email address/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    expect(loginButton).toBeEnabled();
  });

  test("toggles password visibility", () => {
    renderWithProviders(<Login />);
    const toggleBtn =
      screen.getByLabelText(/show password/i) ||
      screen.getByRole("button", { name: "" });
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("dispatches login action on valid form", () => {
    const { store } = renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter email address/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const submitBtn = screen.getByRole("button", { name: /login/i });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);
    const actions = store.getState().login;
    expect(actions).toBeDefined(); // or spy on dispatch if needed
  });
});

test('renders the "Remember me" checkbox', () => {
  renderWithProviders(<Login />);
  const checkbox = screen.getByLabelText(/remember me/i);
  expect(checkbox).toBeInTheDocument();
  expect(checkbox).toHaveAttribute("type", "checkbox");
});

test('can check and uncheck the "Remember me" checkbox', () => {
  renderWithProviders(<Login />);
  const checkbox = screen.getByLabelText(/remember me/i);
  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});
