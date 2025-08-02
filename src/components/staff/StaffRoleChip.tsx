import { Chip, Tooltip } from "@mui/material";
import Supervisor from "../../../public/staffroles/Supervisor.svg";
import TeamManager from "../../../public/staffroles/TeamManager.svg";
import HeadCoach from "../../../public/staffroles/HeadCoach.svg";
import StrCondCoach from "../../../public/staffroles/StrCondCoach.svg";
import AssistantCoach from "../../../public/staffroles/AssistantCoach.svg";
import AdminStaff from "../../../public/staffroles/AdminStaff.svg";
import Nutritionist from "../../../public/staffroles/Nutritionist.svg";
import Volunteer from "../../../public/staffroles/Volunteer.svg";
import Athlete from "../../../public/staffroles/Athlete.svg";
import OtherStaff from "../../../public/staffroles/OtherStaff.svg";
import HigherManagement from "../../../public/staffroles/higher_management.svg";
import DSportsEC from "../../../public/staffroles/d_sports_ec.svg";
import ASportsEC from "../../../public/staffroles/a_sports_ec.svg";
import DPEmployee from "../../../public/staffroles/dp_employee.svg";

interface StaffRoleChipProps {
  roleValue: string;
  roleShortText?: string;
  otherStaff?: string;
}

const StaffRoleChip: React.FC<StaffRoleChipProps> = ({ roleValue, otherStaff, roleShortText }) => {

  const roleLowerCase = roleValue ? roleValue.toLowerCase() : "";
  // Supervisor
  if (roleLowerCase === "supervisor" || roleLowerCase === "Team Supervisor")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#00776A",
            borderColor: "#00776A",
            backgroundColor: "#F9FFFE",
          }}
          icon={<Supervisor />}
        />
      </Tooltip>
    );

  // Team Manager
  if (roleLowerCase === "team_manager")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#630524",
            borderColor: "#630524",
            backgroundColor: "#FEF5F8",
          }}
          icon={<TeamManager />}
        />
      </Tooltip>
    );

  // Head Coach
  if (roleLowerCase === "head_coach")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#005133",
            borderColor: "#005133",
            backgroundColor: "#F5FDFA",
          }}
          icon={<HeadCoach />}
        />
      </Tooltip>
    );

  // Strength And Conditioning Coach
  if (roleLowerCase === "strength_and_conditioning_coach")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#00273F",
            borderColor: "#00273F",
            backgroundColor: "#F7FCFF",
          }}
          icon={<StrCondCoach />}
        />
      </Tooltip>
    );

  // Assistant Coach
  if (roleLowerCase === "assistant_coach")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#167C4A",
            borderColor: "#167C4A",
            backgroundColor: "#F5FDFA",
          }}
          icon={<AssistantCoach />}
        />
      </Tooltip>
    );

  //Admin Staff
  if (roleLowerCase === "team_admin_staff")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#035055",
            borderColor: "#035055",
            backgroundColor: "#F5FDFA",
          }}
          icon={<AdminStaff />}
        />
      </Tooltip>
    );

  //Nutritionist
  if (roleLowerCase === "nutritionist")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#B15D15",
            borderColor: "#B15D15",
            backgroundColor: "#FFFDFB",
          }}
          icon={<Nutritionist />}
        />
      </Tooltip>
    );

  //Volunteer
  if (roleLowerCase === "volunteer")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#001336",
            borderColor: "#001336",
            backgroundColor: "#F6F8FE",
          }}
          icon={<Volunteer />}
        />
      </Tooltip>
    );

  //Athlete
  if (roleLowerCase === "athlete")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#005844",
            borderColor: "#005844",
            backgroundColor: "#FCFFFE",
          }}
          icon={<Athlete />}
        />
      </Tooltip>
    );

  //higher_management
  if (roleLowerCase === "higher_management")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#8B3D00",
            borderColor: "#8B3D00",
            backgroundColor: "#FFF9F1",
          }}
          icon={<HigherManagement />}
        />
      </Tooltip>
    );

  //director_sport_excellence_centre
  if (roleLowerCase === "director_sport_excellence_centre")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#7A1B1B",
            borderColor: "#7A1B1B",
            backgroundColor: "#FFF7F7",
          }}
          icon={<DSportsEC />}
        />
      </Tooltip>
    );

  //admin_sports_excellence_centre
  if (roleLowerCase === "admin_sports_excellence_centre")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#4B3C00",
            borderColor: "#4B3C00",
            backgroundColor: "#FCFAF4",
          }}
          icon={<ASportsEC />}
        />
      </Tooltip>
    );

  //dubai_police_employees
  if (roleLowerCase === "dubai_police_employee")
    return (
      <Tooltip title="Role in Team">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label={roleShortText}
          variant="outlined"
          sx={{
            padding: 1,
            color: "#2C5E1A",
            borderColor: "#2C5E1A",
            backgroundColor: "#F9FBF5",
          }}
          icon={<DPEmployee />}
        />
      </Tooltip>
    );

  const getOtherStaffRoleName = () => {
    if (roleLowerCase === "other_staff" && otherStaff) return otherStaff;
    if (roleShortText) return roleShortText;
    return "Other Staff";
  };

  //Other Staff
  return (
    <Tooltip title="Role in Team">
      <Chip
        className="dubai-regular text-capitalize status-chip"
        label={getOtherStaffRoleName()}
        variant="outlined"
        sx={{
          padding: 1,
          color: "#26618B",
          borderColor: "#26618B",
          backgroundColor: "#F5FBFF",
        }}
        icon={<OtherStaff />}
      />
    </Tooltip>
  );
};

export default StaffRoleChip;
