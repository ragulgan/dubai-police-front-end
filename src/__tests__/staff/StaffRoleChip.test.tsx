import StaffRoleChip from "@/components/staff/StaffRoleChip";
import { fireEvent, render, screen } from "@testing-library/react";
jest.mock("../../../public/staffroles/Supervisor.svg", () => () => (
  <svg data-testid="SupervisorIcon" />
));


describe("StaffRoleChip component", () => {
  it("renders Supervisor chip with correct label and icon", () => {
    render(<StaffRoleChip roleValue="Supervisor" roleShortText="Sup" />);
    expect(screen.getByText("Sup")).toBeInTheDocument();
    expect(screen.getByTestId("SupervisorIcon")).toBeInTheDocument();
  });
 
  const roles = [
    { role: "Supervisor", shortText: "Sup", expectedColor: "#00776A" },
    { role: "team_manager", shortText: "TM", expectedColor: "#630524" },
    { role: "head_coach", shortText: "HC", expectedColor: "#005133" },
    {
      role: "strength_and_conditioning_coach",
      shortText: "SCC",
      expectedColor: "#00273F",
    },
    { role: "assistant_coach", shortText: "AC", expectedColor: "#167C4A" },
    { role: "team_admin_staff", shortText: "TAS", expectedColor: "#035055" },
    { role: "nutritionist", shortText: "Nutri", expectedColor: "#B15D15" },
    { role: "volunteer", shortText: "Vol", expectedColor: "#001336" },
    { role: "athlete", shortText: "Ath", expectedColor: "#005844" },
    { role: "higher_management", shortText: "HM", expectedColor: "#8B3D00" },
    {
      role: "director_sport_excellence_centre",
      shortText: "D-SEC",
      expectedColor: "#7A1B1B",
    },
    {
      role: "admin_sports_excellence_centre",
      shortText: "A-SEC",
      expectedColor: "#4B3C00",
    },
    {
      role: "dubai_police_employee",
      shortText: "DPE",
      expectedColor: "#2C5E1A",
    },
    { role: "other_staff", shortText: "Other", expectedColor: "#26618B" },
  ];

  it.each(roles)(
    "renders correct style and label for role %s",
    ({ role, shortText, expectedColor }) => {
      render(<StaffRoleChip roleValue={role} roleShortText={shortText} />);
      expect(screen.getByText(shortText)).toBeInTheDocument();
      const chip = screen.getByText(shortText);
      expect(chip).toHaveStyle(`color: ${expectedColor}`);
    }
  );
  it("shows tooltip on hover for Supervisor Role", async () => {
    render(<StaffRoleChip roleValue="Supervisor" roleShortText="Sup" />);
    const chip = screen.getByText("Sup");
    fireEvent.mouseOver(chip);
    expect(await screen.findByText("Role in Team")).toBeDefined();
  });
  it("returns otherStaff when role is 'other_staff' and otherStaff is provided", () => {
    render(
      <StaffRoleChip roleValue="other_staff" otherStaff="Medical Consultant" />
    );
    expect(screen.getByText("Medical Consultant")).toBeInTheDocument();
  });

  it("returns roleShortText when provided and not 'other_staff'", () => {
    render(<StaffRoleChip roleValue="custom_role" roleShortText="Custom" />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("returns 'Other Staff' when neither otherStaff nor roleShortText is provided", () => {
    render(<StaffRoleChip roleValue="other_staff" />);
    expect(screen.getByText("Other Staff")).toBeInTheDocument();
  });
});
