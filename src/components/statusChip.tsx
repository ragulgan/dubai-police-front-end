import { Chip, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FulfilledIcon from "../../public/team-requirements/drop-down-icon.svg";
import PendingIcon from "../../public/team-requirements/drop-down-loading.svg";
import CloseIcon from "../../public/team-requirements/drop-down-close.svg";
import ApprovedIcon from "../../public/ResearchAndFacilities/approved.svg";
import RejectedIcon from "../../public/ResearchAndFacilities/rejected.svg";

const statusStyles = {
  Fulfilled: {
    color: "#00426A",
    border: "1px solid #00426A",
    background: "#00426A0A",
    icon: "/team-requirements/drop-down-icon.svg",
  },
  Pending: {
    color: "#FC8A00",
    border: "1px solid #FC8A00",
    background: "#FFF8F0",
    icon: "/team-requirements/drop-down-loading.svg",
  },
  Cancelled: {
    color: "#E4002B",
    border: "1px solid #E4002B",
    background: "#E4002B0A",
    icon: "/team-requirements/drop-down-close.svg",
  },
  Approved: {
    color: "#008755",
    border: "1px solid #008755",
    background: "#E5FFF6",
    icon: "/ResearchAndFacilities/approved.svg",
  },
  Rejected: {
    color: "#E4002B",
    border: "1px solid #E4002B",
    background: "#E4002B0A",
    icon: "/ResearchAndFacilities/rejected.svg",
  },
};

const StatusChip = ({
  status,
}: {
  status: "Fulfilled" | "Pending" | "Cancelled" | "Approved" | "Rejected";
}) => {
  return (
    <Chip
      className="dubai-med status-chip text-capitalize"
      icon={
        status == "Fulfilled" ? (
          <FulfilledIcon
            sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
          />
        ) : status == "Pending" ? (
          <PendingIcon
            sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
          />
        ) : status == "Cancelled" ? (
          <CloseIcon
            sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
          />
        ) : status == "Approved" ? (
          <ApprovedIcon
            sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
          />
        ) : status == "Rejected" ? (
          <RejectedIcon
            sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
          />
        ) : (
          <Chip
            className="dubai-med status-chip text-capitalize"
            label={"---"}
          />
        )
      }
      label={status}
      sx={{
        ...statusStyles[status],
        fontWeight: 500,
        fontSize: "14px",
        padding: "4px 6px",
        borderRadius: "16px",
        width: "fit-content",
      }}
      deleteIcon={
        <KeyboardArrowDownIcon
          sx={{ color: statusStyles[status]?.color || "#000", fontSize: 18 }}
        />
      }
    />
  );
};

export default StatusChip;
