import React from "react";
import { render, screen } from "@testing-library/react";
import PersonalDetailsCard from "@/components/view/PersonalDetailsCard";


describe("PersonalDetailsCard", () => {
  const mockData = {
    firstName: "John",
    middleName: "W.",
    surname: "Doe",
    emiratesID: "784-1984-1234567-1",
    passportNo: "A1234567",
    passportExpirationDate: "2030-01-01",
    personalEmail: "john.doe@example.com",
    dubaiPoliceEmail: "j.doe@dubaipolice.gov",
    phoneNo: "+971500000000",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "+971501111111",
    placeOfBirth: "Dubai",
    address: "123 Street",
    area: "Al Barsha",
    city: "Dubai",
    countryText: "UAE",
    nationalityText: "Emirati",
    languagesSpoken: "Arabic, English",
    height: 180,
    heightUnit: "CM",
    weight: 75,
    weightUnit: "KG",
    bloodType: "O+",
    performanceLevel: "Elite",
  };

  it("renders all fields for athlete module", () => {
    render(<PersonalDetailsCard data={mockData} module="athlete" />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Performance Level")).toBeInTheDocument();
    expect(screen.getByText("John W. Doe")).toBeInTheDocument();
    expect(screen.getByText("Elite")).toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
   // expect(screen.getByText("180 CM")).toBeInTheDocument();
   // expect(screen.getByText("75 KG")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders all fields for staff module", () => {
    render(<PersonalDetailsCard data={mockData} module="staff" />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("John W. Doe")).toBeInTheDocument();
    expect(screen.getByText("784-1984-1234567-1")).toBeInTheDocument();
    expect(screen.getByText("A1234567")).toBeInTheDocument();
    // expect(screen.getByText("180 CM")).toBeInTheDocument();
    // expect(screen.getByText("75 KG")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });
});