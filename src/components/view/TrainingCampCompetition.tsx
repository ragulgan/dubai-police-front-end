import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import _, { isEmpty } from "lodash";
import EventIcon from "@mui/icons-material/Event";

interface TrainingCampCompetitionProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  data: any;
}

const TrainingCampCompetition: React.FC<TrainingCampCompetitionProps> = ({
  label,
  expanded,
  onClick,
  data,
}) => {
  const sectionContainerStyle = {
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    padding: 1,
    borderRadius: "8px",
    borderBottomLeftRadius: expanded ? "8px" : "8px",
    borderBottomRightRadius: expanded ? "8px" : "8px",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const topBarButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <Box sx={sectionContainerStyle}>
      <Box sx={topBarStyle} onClick={onClick}>
        <Typography
          variant="subtitle1"
          className="bukra-semi-bold"
          sx={{
            padding: 1,
            fontSize: 18,
            color: "#008755",
          }}
        >
          {label}
        </Typography>
        <Box sx={topBarButtonContainerStyle}>
          {expanded && (
            <span onClick={onClick}>
              <ExpandMoreIcon sx={{ cursor: "pointer" }} />
            </span>
          )}
        </Box>
      </Box>
      <Box px={1}>
        <Grid container spacing={2}>
          {data?.competitionList?.map((comp: any, index: any) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Box
                sx={{
                  border: "1px solid rgba(0, 135, 85, 0.3)",
                  borderLeft: "5px solid orange",
                  p: 2,
                  bgcolor: "white",
                  borderRadius: "8px",
                  height: "147px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                  className="bukra-semi-bold"
                >
                  {comp?.competitionName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: "#58585B",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className="dubai-regular"
                >
                  <EventIcon fontSize="small" sx={{ mr: 1 }} />
                  {comp?.competitionStartDate.split(" ")[0]} -{" "}
                  {comp?.competitionEndDate.split(" ")[0]}
                </Typography>
                <Typography variant="body2" mt={1} className="dubai-regular">
                  {comp.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        m={1}
        mt={2}
        sx={{ border: "1px solid rgba(0, 135, 85, 0.3)", borderRadius: "4px" }}
        p={2}
      >
        <Typography
          sx={{
            fontSize: "16px",
          }}
          className="burkra-semi-bold"
        >
          Other activities planned for training camp
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            color: "#58585B",
            display: "inline-flex",
            alignItems: "center",
          }}
          className="dubai-regular"
        >
          Team-building exercises, strategy workshops, and public relations
          training.
        </Typography>
      </Box>
    </Box>
  );
};

export default TrainingCampCompetition;
