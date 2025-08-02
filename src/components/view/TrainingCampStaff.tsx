import {
  Avatar,
  Box,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getRoleColor } from "@/utils/constants";
import _ from "lodash";

interface TrainingCampStaffProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  data?: any;
}

const TrainingCampStaff: React.FC<TrainingCampStaffProps> = ({
  label,
  expanded,
  onClick,
  data,
}) => {
  const is2K = useMediaQuery("(min-width:1535px)");
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const isEmptyOrWhitespace = (str: any) => _.isEmpty(_.trim(str));

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
            data.staffList &&
            data.staffList.map((item: any, index: any) => (
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
                    bgcolor: getRoleColor(item && item?.role).backgroundColor,
                    border: `0.5px solid ${getRoleColor(item && item?.role).borderColor
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
                      {item?.rankOrGrade ? item?.rankOrGrade : <>&nbsp;</>}
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
                    {isEmptyOrWhitespace(item?.role) ? null : (
                      <Box
                        mt={1}
                        px={1}
                        bgcolor={getRoleColor(item && item?.role).borderColor}
                        borderRadius={"24px"}
                        component={"span"}
                        sx={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#FFFFFF",
                        }}
                        className={
                          item &&
                            item?.role === "Strength And Conditioning Coach"
                            ? "dubai-regular webkit-line-clamp webkit-1"
                            : "dubai-regular"
                        }
                      >
                        {item?.role}
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

export default TrainingCampStaff;
