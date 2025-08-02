import { Chip } from "@mui/material";

type SportChipProps = {
  sportName: string;
  sportImageUrl: string;
};

const SportChip: React.FC<SportChipProps> = ({ sportName, sportImageUrl }) => {
  return (
    <Chip
      key={sportName}
      label={sportName}
      icon={
        <img
          src={sportImageUrl}
          style={{
            width: "20px",
            height: "16px",
            objectFit: "cover",
          }}
          alt={sportName}
        />
      }
      sx={{
        padding: "0px",
        fontWeight: 500,
        fontSize: "16px",
        backgroundColor: "rgba(0, 135, 85, 0.03)",
        color: "#008755",
        lineHeight: "18px",
        height: "24px",
        ".MuiChip-label": {
          padding: "8px",
        },
        border: "1px solid #008755",
        mr: 1,
      }}
      className="dubai-med"
    />
  );
};

export default SportChip;
