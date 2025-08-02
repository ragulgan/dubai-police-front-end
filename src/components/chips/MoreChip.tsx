import { Avatar, Chip } from "@mui/material"

type MoreChipProps = {
  value: number;
}

const MoreChip: React.FC<MoreChipProps> = ({ value }) => {
  return (
    <Chip label={`+ ${value}`} sx={{
      padding: "0px",
      fontWeight: 500,
      fontSize: "16px",
      backgroundColor: "#e0f7ec",
      color: "#008755",
      lineHeight: "18px",
      height: "24px",
      ".MuiChip-label": {
        padding: "8px",
      },
      mr: 1,
    }} className="dubai-med" />
  )
}

export default MoreChip;