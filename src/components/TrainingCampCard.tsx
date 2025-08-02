import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import StaticFoodImage from "../../public/staticFoodImage.svg";
import CalendarGrey from "../../public/CalendarGrey.svg";
import Location from "../../public/Location.svg";
import ReusableDeleteDialog from "./Fields/ReusableDeleteDialog";
import { getTraningCampListAPI } from "@/redux/slices/trainingCamp/getTrainingCampListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTrainingCamp,
  clearDeleteState,
} from "@/redux/slices/trainingCamp/trainingCampDeleteSlice";
import { isEmpty } from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

// Define the props interface
interface ProfileCardProps {
  campName?: string;
  campStartDate?: string;
  campEndDate?: string;
  campCity?: string;
  statusText: string;
  onViewClick: () => void;
  onEditClick: () => void;
  label?: any;
  timeline?: any;
  trainingCampID?: any;
  teamID?: any;
  campProfile?: any;
}

const TrainingCampCard: React.FC<ProfileCardProps> = ({
  campName,
  campStartDate,
  campEndDate,
  campCity,
  statusText,
  timeline,
  trainingCampID,
  onViewClick,
  onEditClick,
  teamID,
  campProfile,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const TrainingCampsDelete = useSelector(
    (state: RootState) => state.deleteTraningCamps
  );

  const hasAccess = checkAccess(USER_PERMISSION.TrainingCampView) &&
    checkAccess(USER_PERMISSION.TrainingCampEdit) &&
    checkAccess(USER_PERMISSION.TrainingCampDelete);

  return (
    <Card
      sx={{
        bgcolor: "#fff",
        minHeight: "180px",
        border: `1px solid #00875580`,
        overflow: "visible",
        borderRadius: "8px",
        textAlign: "center",
        boxShadow: "none",
        width: "258px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isEmpty(campProfile) ? (
          <Box p={0.5}>
            <StaticFoodImage
              style={{
                width: "100%",
                height: 172,
                borderRadius: 8,
              }}
              className="static-image"
            />
          </Box>
        ) : (
          <img
            src={campProfile}
            alt="Profile Image"
            style={{
              width: "100%",
              height: 179,
              borderRadius: 8,
              padding: "4px",
            }}
          />
        )}
        <CardContent className="pb-2" sx={{ p: 1 }}>
          <Tooltip title={campName}>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000",
                textAlign: "left",
              }}
              className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
            >
              {campName}
            </Typography>
          </Tooltip>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignContent={"flex-start"}
            mt={1}
            mb={1}
          >
            <CalendarGrey width={"20px"} height={"20px"} />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                color: "#58585B",
                textAlign: "left",
                marginRight: "3px",
                marginLeft: "5px",
              }}
              className="dubai-regular"
            >
              {campStartDate}
            </Typography>
            -
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                color: "#58585B",
                textAlign: "left",
                marginLeft: "5px",
              }}
              className="dubai-regular"
            >
              {campEndDate}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignContent={"flex-start"}
            mt={1}
            mb={1}
          >
            <Location width={"20px"} height={"20px"} />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                color: "#58585B",
                textAlign: "left",
                marginRight: "3px",
                marginLeft: "5px",
              }}
              className="dubai-regular"
            >
              {campCity}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignContent={"flex-start"}
            mt={1}
            mb={1}
          >
            <Box
              sx={{
                background: "#FFF7E1",
                width: "100%",
                borderStyle: "dashed",
                borderColor: "#FF9E15",
                borderWidth: "1px",
                borderRadius: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#58585B",
                  textAlign: "left",
                  marginRight: "3px",
                  marginLeft: "5px",
                }}
                className="dubai-regular"
              >
                {statusText}
              </Typography>
            </Box>
          </Box>
          <Stack
            direction="row"
            justifyContent={hasAccess ? "space-between" : "flex-start"}
            spacing={1}
          // px={1}
          >
            {checkAccess(USER_PERMISSION.TrainingCampView) && (
              <Tooltip title={"View"}>
                <IconButton
                  sx={{
                    backgroundColor: "#008755",
                    color: "white",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                    width: "75px",
                    padding: "4px 4px", // Adjust padding top/bottom and left/right
                    minHeight: "39px", // Reduce the height of the button
                  }}
                  onClick={onViewClick} // Use prop for click action
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
            {checkAccess(USER_PERMISSION.TrainingCampEdit) && (
              <Tooltip title={"Edit"}>
                <IconButton
                  sx={{
                    backgroundColor: "transparent",
                    color: "#008755",
                    border: "1px solid #008755",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#fff",
                    },
                    width: "75px",
                    padding: "4px 4px", // Adjust padding top/bottom and left/right
                    minHeight: "39px", // Reduce the height of the button
                  }}
                  className="dubai-med"
                  onClick={onEditClick} // Use prop for click action
                >
                  <EditIcon width={"18px"} height={"18px"} />
                </IconButton>
              </Tooltip>
            )}
            {checkAccess(USER_PERMISSION.TrainingCampDelete) && (
              <ReusableDeleteDialog
                css={true}
                title={`Training Camp`}
                confirmationMessage="Are you sure, Do you want to delete?"
                successMessage="Training Camp Deleted Successfully"
                name={campName}
                width="18px"
                height="18px"
                icon={<DeleteIcon />}
                revertMessage={`Once the Training Camp is deleted, you cannot not revert.`}
                deleteAction={(payload: any) =>
                  dispatch(
                    deleteTrainingCamp({
                      url: "/DeleteTrainingCampByID",
                      payload,
                    })
                  )
                }
                fetchAfterDelete={() => {
                  const payload: any = {
                    trainingCampType: timeline,
                    sportID: Number(teamID),
                    searchText: "",
                    filteredBy: "",
                    paginationCount: 10,
                    paginationIndex: 1,
                  };
                  dispatch(
                    getTraningCampListAPI({
                      url: "/GetTrainingCampList",
                      payload,
                    })
                  );
                }}
                deleteResponse={TrainingCampsDelete}
                clearDeleteState={() => dispatch(clearDeleteState())}
                payload={{
                  trainingCampID: trainingCampID,
                }}
              />
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default TrainingCampCard;
