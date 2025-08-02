import { getRoleColor } from "@/utils/constants";
import { Chip } from "@mui/material";


interface RoleChipProps {
  role: string;
}

const RoleChip: React.FC<RoleChipProps> = ({ role }) => {
  return (
    <Chip
      label={role}
      sx={{
        padding: "0px",
        fontFamily: "Dubai, sans-serif",
        fontWeight: 400,
        fontSize: "12px",
        backgroundColor: getRoleColor(role).borderColor,
        color: "#fff",
        lineHeight: "18px",
        height: "24px",
        ".MuiChip-label": {
          padding: "8px",
        },
      }}
    />
  )
}

export default RoleChip;