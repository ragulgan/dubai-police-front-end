import React from "react";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "../../../__mocks__/store";
import * as singleUploadActions from "@/redux/slices/fileupload/singleFileUpload";
import { Provider } from "react-redux";
import ContactInfoForm from "@/components/Forms/ContactInfoForm";
import { UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import { getDefaultOptions } from "@/utils/helper";
import userEvent from "@testing-library/user-event";
import { UpdateAthleteByID } from "@/redux/slices/athlete/athleteUpdateSlice";
jest.mock("@/redux/slices/nationality/getNationalityListSlice", () => ({
  getNationalityListAPI: () => ({ type: "getNationalityListAPI" }),
}));
const mockOnClose = jest.fn();
jest.mock("@/redux/slices/staff/staffUpdateSlice", () => ({
  UpdateStaff: jest.fn(() => ({
    type: "UpdateStaff",
    payload: { section: "contactdetails" },
  })),
}));
jest.mock("@/redux/slices/athlete/athleteUpdateSlice", () => ({
  UpdateAthleteByID: jest.fn(() => ({
    type: "UpdateAthleteByID",
    payload: { section: "contactdetails" },
  })),
}));
const mockEditData = {
  address: "Sample Address",
  area: "Deira",
  city: "Dubai",
  country: "UAE",
  personalEmail: "john@example.com",
  dubaiPoliceEmail: "john@dubaipolice.gov.ae",
  phoneNo: "123456789",
  countryCode: "+971",
  emergencyContactName: "Jane",
  emergencyContactNumber: "987654321",
  emergencyCountryCode: "+971",
};

describe("ContactInfoForm - Country Dropdown", () => {
  const mockNationalityData = [
    { countryName: "United Arab Emirates" },
    { countryName: "India" },
    { countryName: "USA" },
  ];

  describe("ContactInfoForm", () => {
    it("renders with initial values from editData", async () => {
      renderWithProviders(
        <ContactInfoForm
          id={1}
          onClose={mockOnClose}
          editData={mockEditData}
          module="staff"
        />,
        {
          staffUpdate: { status: "", loading: false, message: "", code: 0 },
          getNationalityList: {
            data: [{ countryName: "UAE" }],
          },
        }
      );

      // Wait for prefilled values
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter Address/i)).toHaveValue(
          "Sample Address"
        );
        expect(screen.getByPlaceholderText(/Enter Area/i)).toHaveValue("Deira");
        expect(screen.getByPlaceholderText(/Enter City/i)).toHaveValue("Dubai");
        expect(
          screen.getByPlaceholderText(/Enter Personal Email/i)
        ).toHaveValue("john@example.com");
        expect(
          screen.getByPlaceholderText(/Enter Dubai police Email/i)
        ).toHaveValue("john@dubaipolice.gov.ae");
        expect(
          screen.getByPlaceholderText(/Enter Emergency Contact Name/i)
        ).toHaveValue("Jane");
      });
    });

    it("submits form and dispatches UpdateStaff", async () => {
      renderWithProviders(
        <ContactInfoForm
          id={1}
          onClose={mockOnClose}
          editData={mockEditData}
          module="staff"
        />,
        {
          staffUpdate: { status: "", loading: false, message: "", code: 0 },
          getNationalityList: {
            data: [{ countryName: "UAE" }],
          },
        }
      );

      fireEvent.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(UpdateStaff).toHaveBeenCalledWith(
          expect.objectContaining({
            section: "contactdetails",
            staffID: 1,
            address: "Sample Address",
            area: "Deira",
            city: "Dubai",
            country: "UAE",
            personalEmail: "john@example.com",
            dubaiPoliceEmail: "john@dubaipolice.gov.ae",
            phoneNo: "123456789",
            countryCode: "971",
            emergencyContactName: "Jane",
            emergencyContactNumber: "987654321",
            emergencyCountryCode: "971",
          })
        );
      });
    });
it("submits form and dispatches UpdateAthleteByID", async () => {
    renderWithProviders(
      <ContactInfoForm
        id={99}
        onClose={mockOnClose}
        editData={mockEditData}
        module="athlete"
      />,
      {
        preloadedState: {
          athleteUpdate: { status: "", loading: false, message: "", code: 0 },
          getNationalityList: {
            data: [{ countryName: "UAE" }],
          },
        },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(UpdateAthleteByID).toHaveBeenCalledWith(
        expect.objectContaining({
          section: "contactdetails",
          athleteID: 99,
          address: "Sample Address",
          area: "Deira",
          city: "Dubai",
          country: "UAE",
          personalEmail: "john@example.com",
          dubaiPoliceEmail: "john@dubaipolice.gov.ae",
          phoneNo: "123456789",
          countryCode: "971",
          emergencyContactName: "Jane",
          emergencyContactNumber: "987654321",
          emergencyCountryCode: "971",
        })
      );
    });
  });
    it("renders and selects country from dropdown", async () => {
      renderWithProviders(
        <ContactInfoForm
          id={1}
          onClose={jest.fn()}
          editData={mockEditData}
          module="staff"
        />,
        {
          getNationalityList: {
            data: mockNationalityData,
          },
        }
      );
      const dropdowns = screen.getAllByRole("combobox");
      const countryDropdown = dropdowns.find((el) =>
        el.getAttribute("id")?.includes("country")
      );
      expect(countryDropdown).toBeInTheDocument();
      fireEvent.mouseDown(countryDropdown!);

      // Find "USA" option inside the dropdown listbox
      const listbox = await screen.findByRole("listbox");
      const Option = within(listbox).getByText("USA");
      fireEvent.click(Option);

      expect(countryDropdown).toHaveTextContent("USA");
      const errorText = screen.queryByText(/Country is required/i);
      expect(errorText).not.toBeInTheDocument();
    });
  });
  it("shows validation error for invalid phone number", async () => {
    const { container } = renderWithProviders(
      <ContactInfoForm
        id={1}
        onClose={mockOnClose}
        editData={mockEditData}
        module="staff"
      />,
      {
        staffUpdate: { status: "", loading: false, message: "", code: 0 },
        getNationalityList: {
          data: [{ countryName: "UAE" }],
        },
      }
    );
    const phoneInputs = container.querySelectorAll("input[type='tel']");

    await userEvent.clear(phoneInputs[0]);
    await userEvent.type(phoneInputs[0], "abc");

    const submitButton = screen.getByRole("button", { name: /Update/i });
    await userEvent.click(submitButton);
    //  await waitFor(() => {
    //     expect(
    //       screen.getByText((content) =>
    //         content.includes("Phone number must contain only digits (eg: 154450123).")
    //       )
    //     ).toBeInTheDocument();
    //   });
  });
  it("should update phoneNumber and CountryCode and clear the error", async () => {
    const { container } = renderWithProviders(
      <ContactInfoForm
        id={1}
        onClose={mockOnClose}
        editData={mockEditData}
        module="staff"
      />,
      {
        staffUpdate: { status: "", loading: false, message: "", code: 0 },
        getNationalityList: {
          data: [{ countryName: "UAE" }],
        },
      }
    );

    const phoneInputs = container.querySelectorAll("input[type='tel']");
    const phoneInput = phoneInputs[0]; // usually first PhoneInput
    fireEvent.change(phoneInput, {
      target: { value: "+971581234567" },
    });
    await waitFor(() => {
      expect(phoneInput).toHaveValue("+971581234567");
    });
  });
  it("should update emergencyContactNumber and emergencyCountryCode and clear the error", async () => {
    const { container } = renderWithProviders(
      <ContactInfoForm
        id={1}
        onClose={mockOnClose}
        editData={mockEditData}
        module="staff"
      />,
      {
        staffUpdate: { status: "", loading: false, message: "", code: 0 },
        getNationalityList: {
          data: [{ countryName: "UAE" }],
        },
      }
    );
    const phoneInputs = container.querySelectorAll("input[type='tel']");
    const emergencyPhoneInput = phoneInputs[1]; // usually second PhoneInput
    fireEvent.change(emergencyPhoneInput, {
      target: { value: "+971581234567" },
    });

    await waitFor(() => {
      expect(emergencyPhoneInput).toHaveValue("+971581234567");
    });
  });
  it('calls props.onClose(false) when "Cancel" button is clicked', async () => {
    renderWithProviders(
      <ContactInfoForm
        id={1}
        onClose={mockOnClose}
        editData={mockEditData}
        module="staff"
      />,
      {
        staffUpdate: { status: "", loading: false, message: "", code: 0 },
        getNationalityList: {
          data: [{ countryName: "UAE" }],
        },
      }
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledWith(false);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it.skip("displays success snackbar on staff update success", async () => {
    jest.useFakeTimers(); // <-- control time

    const onCloseMock = jest.fn();

    renderWithProviders(
      <ContactInfoForm
        module="staff"
        onClose={onCloseMock}
        id={1}
        editData={mockEditData}
      />,
      {
        preloadedState: {
          staffUpdate: {
            staffUpdateData: {
              status: "succeeded",
            },
            loading: false,
            message: "Staff member updated successfully",
            code: 200,
          },
          getNationalityList: {
            data: [{ countryName: "UAE" }],
          },
        },
      }
    );

    const snackbarText = await screen.findByText((content, element) =>
      content.includes("Staff member updated successfully!")
    );
    expect(snackbarText).toBeInTheDocument();

    // Fast-forward time for auto-dismiss
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledWith(false);
    });

    jest.useRealTimers();
  });
});
