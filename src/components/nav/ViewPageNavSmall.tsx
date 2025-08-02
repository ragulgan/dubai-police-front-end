import { Box, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ViewPageNavSmallProps {
  expanded: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  module: any;
}

const ViewPageNavSmall: React.FC<ViewPageNavSmallProps> = ({
  label,
  expanded,
  onClick,
  module,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#008755",
          padding: 1,
          borderTopLeftRadius:
            label === "Personal & Contact Details" ? "20px" : "0px",
          borderBottomLeftRadius:
            label === "Professional Information" && module === "staff"
              ? "20px"
              : label === "Sport Information" && module === "athlete"
              ? "20px"
              : "0px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: 100,
          minWidth: "85%",
          borderBottom: "1px solid #FFFFFF",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            fontSize: 14,
            fontFamily: "bukra",
            color: "#FFFFFF",
          }}
        >
          {label}
        </Typography>
      </Box>
      {!expanded && <NavigateNextIcon />}
      {expanded && <ExpandMoreIcon />}
    </Box>
  );
};

export default ViewPageNavSmall;
