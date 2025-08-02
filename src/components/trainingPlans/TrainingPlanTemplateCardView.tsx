import {
  Box,
  Grid,
  Alert,
  Grow,
  IconButton,
  Button,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDeleteState,
  deleteTrainingPlansById,
} from "@/redux/slices/trainingPlans/TrainingPlansDeleteSlice";
import { viewTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansListSlice";
import CreatedSvg from "../../../public/createdSvg.svg";
import CalendarSVG from "../../../public/calendarGreyTraining.svg";
import Clock from "../../../public/ClockGrey.svg";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import GridViewSkeleton from "../skeleton/GridViewSkeleton";

const TrainingPlanTemplateCardView: React.FC<any> = ({ data, isEdit, isLoading, teamId }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const TrainingPlansDelete = useSelector(
    (state: RootState) => state.deleteTrainingPlans
  );

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtmlTags(content);

    return (
      <div className="dubai-regular" style={{ fontSize: "14px" }}>
        {plainText}
      </div>
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {isLoading ? (
          <GridViewSkeleton />
        ) : data && data.length && data.length > 0 ? (
          data.map((profile: any, index: any) => {
            return (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 500 + index * 200 } : {})}
                key={index}
              >
                <Grid item>
                  <Box
                    width={"258px"}
                    height={checkAccess(USER_PERMISSION.TrainingPlanAdd) ? "340px" : "300px"}
                    border={"1px solid rgba(0, 135, 85, 0.3)"}
                    borderRadius={"4px"}
                  >
                    <Box
                      height={"82px"}
                      sx={{
                        backgroundColor: "rgba(38, 208, 124, 0.1)",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                      }}
                      border={"1px solid rgba(0, 135, 85, 0.3)"}
                      px={1.5}
                      py={1}
                    >
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Chip
                          className="text-capitalize badge-text dubai-regular"
                          sx={{
                            backgroundColor: "#F1EB9C",
                            px: 1,
                            height: "24px",
                          }}
                          icon={
                            profile?.trainingType === "athlete" ? (
                              <PersonOutlineOutlinedIcon
                                sx={{ width: "16px", height: "16px" }}
                              />
                            ) : (
                              <GroupsOutlinedIcon
                                sx={{ width: "16px", height: "16px" }}
                              />
                            )
                          }
                          label={profile?.trainingType}
                        />
                        <Box width={"50%"} textAlign={"end"}>
                          {checkAccess(USER_PERMISSION.TrainingPlanEdit) ? <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => isEdit(profile.trainingPlanID)}
                            sx={{
                              width: "16px",
                              height: "16px",
                              mr: 2,
                              color: "#05868E",
                            }}
                          >
                            <EditIcon />
                          </IconButton> : null}
                          {checkAccess(USER_PERMISSION.TrainingPlanDelete) ?
                            <ReusableDeleteDialog
                              title={`Training Plan`}
                              confirmationMessage="Are you sure, Do you want to delete?"
                              successMessage="Training Plan Deleted Successfully"
                              name={profile.trainingPlan}
                              icon={<DeleteIcon />}
                              revertMessage={`Once the Training Plan is deleted, you cannot not revert.`}
                              deleteAction={(payload: any) =>
                                dispatch(deleteTrainingPlansById(payload))
                              }
                              fetchAfterDelete={() => {
                                const payload: any = {
                                  sportID: Number(teamId),
                                  searchText: "",
                                  filteredBy: "",
                                  paginationCount: 0,
                                  paginationIndex: 0,

                                };
                                dispatch(
                                  viewTrainingPlans({
                                    url: "/GetTrainingPlanDraftList",
                                    payload,
                                  })
                                );
                              }}
                              deleteResponse={TrainingPlansDelete}
                              clearDeleteState={() =>
                                dispatch(clearDeleteState())
                              }
                              payload={{
                                trainingPlanID: profile.trainingPlanID,

                              }}
                            /> : null}
                        </Box>
                      </Box>
                      <Tooltip title={profile?.trainingPlan}>
                        <Typography
                          className="bukra-semi-bold text-ellipsis primary-color training-plan-head"
                          mt={2}
                        >
                          {profile?.trainingPlan}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Box px={1.5} py={2}>
                      <Box display={"flex"} alignContent={"center"}>
                        <CreatedSvg />
                        <Typography
                          className="dubai-med created-label"
                          sx={{ ml: 1, color: "#58585B" }}
                        >
                          Created By
                        </Typography>
                      </Box>
                      <Typography
                        className="dubai-med created-label text-ellipsis"
                        sx={{ my: 1, color: "black" }}
                      >
                        {profile?.assignedCoach ? (
                          profile?.assignedCoach
                        ) : (
                          <>&nbsp;</>
                        )}
                      </Typography>
                      <Box display={"flex"} alignContent={"center"}>
                        <Box py={1} width={"50%"}>
                          <Box display={"flex"} alignContent={"center"}>
                            <CalendarSVG />
                            <Typography
                              className="dubai-med created-label"
                              sx={{ ml: 1, color: "#58585B" }}
                            >
                              Date Created
                            </Typography>
                          </Box>
                          <Typography
                            className="dubai-med created-label text-ellipsis"
                            sx={{ my: 1, color: "black" }}
                          >
                            {profile?.trainingStartDate}
                          </Typography>
                        </Box>
                        <Box py={1} width={"50%"}>
                          <Box display={"flex"} alignContent={"center"}>
                            <Clock />
                            <Typography
                              className="dubai-med created-label"
                              sx={{ ml: 1, color: "#58585B" }}
                            >
                              Duration
                            </Typography>
                          </Box>
                          <Typography
                            className="dubai-med created-label text-ellipsis"
                            sx={{ my: 1, color: "black" }}
                          >
                            {profile?.trainingFrequency}
                          </Typography>
                        </Box>
                      </Box>
                      {/* <RenderHtmlContent content={profile?.trainingObjective || "-----"} /> */}
                      <div
                        style={{ height: "55px", color: "#58585B" }}
                        className="dubai-med created-label webkit-line-clamp"
                      >
                        <RenderEditorContentHtml
                          content={profile?.trainingObjective || "-----"}
                        />
                      </div>
                      {checkAccess(USER_PERMISSION.TrainingPlanAdd) ? <Button
                        variant="contained"
                        sx={{ mt: 1, width: "100%", fontSize: "18px" }}
                        className="text-capitalize dubai-med"
                        onClick={() =>
                          router.push(
                            `/teams/${teamId}/trainingPlans/add?id=${profile?.trainingPlanID}`
                          )
                        }
                      >
                        Assign
                      </Button> : null}
                    </Box>
                  </Box>
                </Grid>
              </Grow>
            );
          })
        ) : (
          <Box px={3}>
            <Alert className="dubai-med" severity="info">
              No Training Templates found.
            </Alert>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default TrainingPlanTemplateCardView;
