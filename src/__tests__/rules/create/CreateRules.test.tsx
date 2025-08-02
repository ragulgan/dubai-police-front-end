import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";
import CreateRulesForm from "@/components/rules/create/createRules";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import { renderWithProviders } from "../../../../__mocks__/store";
import { updateRules, clearRulesUpdateState } from '@/redux/slices/rules/RulesUpdateSlice';
import userEvent from "@testing-library/user-event";
import { clearRulesAddState } from "@/redux/slices/rules/RulesAddSlice";
// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockRouterPush,
  back: mockRouterBack,
});

const defaultProps = {
  edit: false,
  editRulesData: { code: 200, data: [{}] },
  id: 1,
  onClose: jest.fn(),
  setIsUpdated: jest.fn(),
};

const customState = {
  ui: {
    singleUploadData: { loading: false, message: "", code: 0 },
    fileDelete: {
      status: "succeeded", 
    },
  },
  rules: {
    rulesAddData: { loading: false },
    rulesUpdateData: { loading: false },
  },
};
jest.mock('@/components/trainingCamp/skeleton/editSkeletont', () => {
  const EditFieldSkeleton = ({ isAvatar }: { isAvatar: boolean }) => (
    <div data-testid="edit-skeleton">Loading Skeleton...</div>
  );
  EditFieldSkeleton.displayName = 'EditFieldSkeleton'; 
  return EditFieldSkeleton;
});
jest.mock("@/components/Fields/DropDown", () => {
  const MockDropDown = (props: any) => (
    <select data-testid="assigned-sports" {...props}>
      <option value="1">Football</option>
      <option value="2">Basketball</option>
    </select>
  );
  MockDropDown.displayName = "MockDropDown";
  return MockDropDown;
});

// Mock CustomSnackbar to control its visibility and message
jest.mock('@/components/CustomSnackbar', () => {
  const CustomSnackbar = ({ message, severity, open, onClose }: any) => {
    if (!open) return null;
    return (
      <div data-testid="custom-snackbar" className={`${severity}-snackbar`}>
        {message}
        <button onClick={() => onClose({}, 'timeout')}>Close</button>
      </div>
    );
  };
  CustomSnackbar.displayName = 'CustomSnackbar';
  return CustomSnackbar;
});


jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
   useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockClearDeleteAction = { type: "CLEAR_DELETE_FILE" };

jest.mock("@/redux/slices/fileupload/deleteFile", () => ({
  clearDeletFileState: jest.fn(() => mockClearDeleteAction),
}));
describe("CreateRulesForm", () => {
     let mockDispatch: jest.Mock;
  let mockCurrentState: any;
 
  const baseInitialState = {
    rulesAdd: { loading: false, code: null, message: null, data: null },
    rulesUpdate: { loading: false, code: null, message: null, data: null },
    singleUpload: { loading: false, code: null, message: null },
    fileDelete: { loading: false, status: null },
    getSportList: {
      data: [
        { sportID: 1, sportName: 'Football', sportProfile: 'football.png' },
        { sportID: 2, sportName: 'Basketball', sportProfile: 'basketball.png' },
      ],
    },
  };
  
  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Initialize mockCurrentState for each test
    mockCurrentState = { ...baseInitialState };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector(mockCurrentState));
  });
 
const renderComponent = (props = {}) => {
    return renderWithProviders(
      <CreateRulesForm {...props} />,
      mockCurrentState 
    );
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with required fields", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Enter New Title")).toBeInTheDocument();
expect(screen.getByTestId("assigned-sports")).toBeInTheDocument();
    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  it("shows error when submitting empty form", async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("fills and submits form successfully", async () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText("Enter New Title");
    fireEvent.change(titleInput, { target: { value: "Test Rule" } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(titleInput).toHaveValue("Test Rule");
    });
  });

  it("clears form on 'Clear form' button click", async () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText("Enter New Title");
    fireEvent.change(titleInput, { target: { value: "Test Rule" } });

    fireEvent.click(screen.getByText("Clear form"));

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
    });
  });

  it("calls cancel logic on Cancel button click", async () => {
    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockRouterBack).toHaveBeenCalled();
    });
  });
  it('should display loading skeleton when editRulesData is loading', () => {
    const editRulesDataLoading = { loading: true };
    renderComponent({ edit: true, editRulesData: editRulesDataLoading, id: 1 });
    expect(screen.getByTestId('edit-skeleton')).toBeInTheDocument();
  });
  it('should call onClose and setIsUpdated in edit mode on success', async () => {
    const mockOnClose = jest.fn();
    const mockSetIsUpdated = jest.fn();
    mockCurrentState = { ...baseInitialState, rulesUpdate: { loading: false, code: null } };
    const { rerender } = renderComponent({
      edit: true,
      id: 1,
      onClose: mockOnClose,
      setIsUpdated: mockSetIsUpdated,
      editRulesData: { code: 200, data: [{ title: 'Initial' }], loading: false },
    });
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Enter New Title/i), 'Test');
    await user.click(screen.getByRole('button', { name: /update/i }));
    mockCurrentState = {
      ...baseInitialState,
      rulesUpdate: { loading: false, code: 200, message: 'Success', data: { rulesAndAgreementsID: 1 } },
    };

    rerender(
      <CreateRulesForm
        edit={true}
        id={1}
        onClose={mockOnClose}
        setIsUpdated={mockSetIsUpdated}
        editRulesData={{ code: 200, data: [{ title: 'Initial' }], loading: false }}
      />
    );

    await waitFor(() => {
      expect(mockSetIsUpdated).toHaveBeenCalledWith(true);
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(clearRulesUpdateState());
    }, { timeout: 1500 }); 

    await waitFor(() => {
      expect(mockSetIsUpdated).toHaveBeenCalledWith(false);
    }, { timeout: 2500 }); 
  });
  
  it('should call router.back in add mode on success', async () => {
    const mockRouterBack = jest.fn();

    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
      back: mockRouterBack,
      push: jest.fn(),
    });
    mockCurrentState = { ...baseInitialState, rulesAdd: { loading: false, code: null } };
    const { rerender } = renderComponent(); 

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Enter New Title/i), 'New Rule');
    await user.click(screen.getByRole('button', { name: /save/i }));
     mockCurrentState = {
      ...baseInitialState,
      rulesAdd: { loading: false, code: 200, message: 'Success', data: { rulesAndAgreementsID: 1 } },
    };
    rerender(<CreateRulesForm />);

    await waitFor(() => {
      expect(mockRouterBack).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(clearRulesAddState());
    }, { timeout: 1500 }); // Adjust timeout if necessary
  });

  it('should display error snackbar on add/update failure (code 500)', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Enter New Title/i), 'Fail Test');
    await user.click(screen.getByRole('button', { name: /save/i }));
     mockCurrentState = {
      ...baseInitialState,
      rulesAdd: { loading: false, code: 500, message: 'Internal Server Error', data: null },
    };

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('custom-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('custom-snackbar')).toHaveTextContent('Internal Server Error');
      expect(screen.getByTestId('custom-snackbar')).toHaveClass('error-snackbar');
      expect(mockDispatch).toHaveBeenCalledWith(clearRulesAddState());
    });
  });

  it('should display error snackbar on add/update conflict (code 409)', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Enter New Title/i), 'Conflict Test');
    await user.click(screen.getByRole('button', { name: /save/i }));
    mockCurrentState = {
      ...baseInitialState,
      rulesAdd: { loading: false, code: 409, message: 'Conflict Detected', data: null },
    };
  
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('custom-snackbar')).toBeInTheDocument();
      expect(screen.getByTestId('custom-snackbar')).toHaveTextContent('Conflict Detected');
      expect(screen.getByTestId('custom-snackbar')).toHaveClass('error-snackbar');
     
    });

    await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(clearRulesAddState());
    }, { timeout: 2500 }); 
  });
 it('should call onClose when "Cancel" button is clicked in edit mode', async () => {
    const mockOnClose = jest.fn();
    renderComponent({ edit: true, onClose: mockOnClose, id: 1 });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
