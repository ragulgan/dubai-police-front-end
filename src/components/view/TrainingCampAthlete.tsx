import {
  Avatar,
  Box,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getPerformanceLevel } from "@/utils/constants";
import _ from "lodash";

interface TrainingCampAthleteProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  data?: any;
}

const TrainingCampAthlete: React.FC<TrainingCampAthleteProps> = ({
  label,
  expanded,
  onClick,
  data,
}) => {
  const is2K = useMediaQuery("(min-width:1535px)");
  const isEmptyOrWhitespace = (str: any) => _.isEmpty(_.trim(str));
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
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
      <Box p={2}>
        <Grid container spacing={2}>
          {data &&
            data.athleteList &&
            data.athleteList.map((item: any, index: any) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={is8K ? 2 : is4K ? 2.4 : is2K ? 3 : 4}
                key={index}
              >
                <Box
                  sx={{
                    height: "92px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    bgcolor: getPerformanceLevel(item && item?.performanceLevel)
                      .backgroundColor,
                    border: `0.5px solid ${getPerformanceLevel(item && item?.performanceLevel).borderColor
                      }`,
                  }}
                >
                  <Avatar
                    alt={item?.firstName}
                    src={item?.profileImage}
                    sx={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <Box pl={2}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#000",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                      }}
                      className="bukra"
                    >
                      {item?.rank ? item?.rank : <>&nbsp;</>}
                    </Typography>
                    <Tooltip
                      title={`${item?.firstName} ${item?.middleName} ${item?.surname}`}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          color: "#000",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "1",
                          WebkitBoxOrient: "vertical",
                        }}
                        className="bukra-semi-bold"
                      >
                        {`${item?.firstName} ${item?.middleName} ${item?.surname}`}
                      </Typography>
                    </Tooltip>
                    {isEmptyOrWhitespace(item?.performanceLevel) ? null : (
                      <Box
                        mt={1}
                        px={1}
                        bgcolor={
                          getPerformanceLevel(item && item?.performanceLevel)
                            .borderColor
                        }
                        borderRadius={"24px"}
                        component={"span"}
                        sx={{
                          fontSize: "12px",
                          color: "#FFFFFF",
                          whiteSpace: "nowrap",
                        }}
                        className="dubai-regular text-capitalize"
                      >
                        {item?.performanceLevel}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TrainingCampAthlete;
