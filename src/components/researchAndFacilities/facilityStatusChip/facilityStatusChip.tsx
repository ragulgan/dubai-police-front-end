import { Chip, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PendingIcon from "../../../../public/team-requirements/drop-down-loading.svg";
import CancelledIcon from "../../../../public/facility-cancel.svg";
import ApprovedIcon from "../../../../public/ResearchAndFacilities/approved.svg";
import RejectedIcon from "../../../../public/ResearchAndFacilities/rejected.svg";

const statusStyles = {
 Pending: {
  color: "#FC8A00",
  border: "1px solid #FC8A00",
  background: "#FFF8F0",
  icon: "/team-requirements/drop-down-loading.svg",
 },
 Cancelled: {
  color: "#58585B",
  border: "1px solid #58585B",
  background: "#F8F8F9",
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
  background: "#FEF5F7",
  icon: "/ResearchAndFacilities/rejected.svg",
 },
};

const FacilityStatusChip = ({
 status,
}: {
 status: "Pending" | "Cancelled" | "Approved" | "Rejected";
}) => {
 return (
  <Chip
   className="dubai-med status-chip text-capitalize"
   icon={
    status == "Pending" ? (
     <PendingIcon
      data-testid="PendingIcon"
      sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
     />
    ) : status == "Cancelled" ? (
     <CancelledIcon
      data-testid="CancelledIcon"
      sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
     />
    ) : status == "Approved" ? (
     <ApprovedIcon
      data-testid="ApprovedIcon"
      sx={{ fontSize: 16, color: "#FFAF2F", marginLeft: "-4px" }}
     />
    ) : status == "Rejected" ? (
     <RejectedIcon
      data-testid="RejectedIcon"
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

export default FacilityStatusChip;
