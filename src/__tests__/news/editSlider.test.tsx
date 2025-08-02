const mockCreateNewsForm = jest.fn();

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditSlider from "@/components/news/editSlider";

// Mocks
const mockOnClose = jest.fn();
const mockSetIsUpdated = jest.fn();

jest.mock("@/components/news/createNewsForm", () => (props: any) => {
    mockCreateNewsForm(props);
    return <div data-testid="create-news-form-mock" />;
});

jest.mock("react-redux", () => ({
    useSelector: jest.fn((fn: any) => fn({ editNews: { data: [{ articleTitle: "Test Article" }] } })),
}));

jest.mock("@mui/material", () => {
    const actual = jest.requireActual("@mui/material");
    return {
        ...actual,
        Drawer: ({ open, onClose, children, ...rest }: any) =>
            open ? (
                <div data-testid="drawer-mock" {...rest}>
                    <button data-testid="drawer-close" onClick={onClose} />
                    {children}
                </div>
            ) : null,
    };
});

jest.mock("@mui/icons-material/Close", () => () => <span data-testid="close-icon-mock" />);

const defaultProps = {
    open: true,
    onClose: mockOnClose,
    isEditData: 123,
    setIsUpdated: mockSetIsUpdated,
};

describe("EditSlider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders Drawer and CreateNewsForm with correct props", () => {
        render(<EditSlider {...defaultProps} />);
        expect(screen.getByTestId("drawer-mock")).toBeInTheDocument();
        expect(screen.getByText("Edit News")).toBeInTheDocument();
        expect(screen.getByTestId("create-news-form-mock")).toBeInTheDocument();
        // Check CreateNewsForm props via the mock function
        expect(mockCreateNewsForm).toHaveBeenCalledWith(
            expect.objectContaining({
                edit: true,
                editNewsData: { data: [{ articleTitle: "Test Article" }] },
                id: 123,
                onClose: mockOnClose,
                setIsUpdated: mockSetIsUpdated,
            })
        );
    });

    it("calls onClose when close button is clicked", () => {
        render(<EditSlider {...defaultProps} />);
        fireEvent.click(screen.getByTestId("drawer-close"));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("does not render Drawer when open is false", () => {
        render(<EditSlider {...defaultProps} open={false} />);
        expect(screen.queryByTestId("drawer-mock")).not.toBeInTheDocument();
    });
}); 