import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import * as axiosUtils from "@/utils/AxiosInterceptor";
import MedicalCheckCard from "@/components/view/MedicalCheckCard";

jest.mock("@/components/buttons/CustomButton", () => {
  const MockButton = (props: any) => (
    <button onClick={props.onClick}>{props.label}</button>
  );
  MockButton.displayName = "MockCustomButton";
  return MockButton;
});
jest.mock("../../../public/SettingsSVG.svg", () => "SettingsSVG");
jest.mock("../../../public/XlsSVG.svg", () => "XlsSVG");

jest.mock("@/components/widgets/FitnessTest", () => () => <div>FitnessTest</div>);
jest.mock("@/components/widgets/FieldTest", () => () => <div>FieldTest</div>);
jest.mock("@/components/widgets/MedicalTest", () => () => <div>MedicalTest</div>);
jest.mock("@/components/widgets/PerformaceTest", () => () => <div>PerformanceTest</div>);

describe("MedicalCheckCard", () => {
  const mockData = {
    militaryReadiness: [{ id: 1 }],
    performance: [{ id: 2 }],
    field: [{ id: 3 }],
    medical: [{ id: 4 }],
  };
  beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:fake-url');
});

afterAll(() => {
  jest.restoreAllMocks();
});

  it("renders with label and children widgets", () => {
    render(
      <MedicalCheckCard
        label="Medical Test"
        expanded={true}
        onClick={jest.fn()}
        TestAndMedicalByIdAthelete={mockData}
        sportID={1}
        athleteId={123}
      />
    );

    expect(screen.getByText("Medical Test")).toBeInTheDocument();
    expect(screen.getByText("Export to Excel")).toBeInTheDocument();
    expect(screen.getByText("FitnessTest")).toBeInTheDocument();
    expect(screen.getByText("PerformanceTest")).toBeInTheDocument();
    expect(screen.getByText("FieldTest")).toBeInTheDocument();
    expect(screen.getByText("MedicalTest")).toBeInTheDocument();
  });

  it("calls downloadExcel when 'Export to Excel' is clicked", async () => {
    const postMock = jest.fn().mockResolvedValue({
      data: new Blob(["Excel content"]),
    });
    axiosUtils.axiosCallBlob = { post: postMock };

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const createObjectURLMock = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:fake-url");

    render(
      <MedicalCheckCard
        label="Test"
        expanded={true}
        onClick={jest.fn()}
        TestAndMedicalByIdAthelete={{}}
        sportID={1}
        athleteId={123}
      />
    );

    fireEvent.click(screen.getByText("Export to Excel"));
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining("ExportTestAndMedicalsByAthletID"),
      expect.objectContaining({ sportID: 1, athleteID: 123 })
    );

    // Clean up mocks
    alertMock.mockRestore();
    createObjectURLMock.mockRestore();
  });
});
