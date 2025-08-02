import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Image from "next/image";
import leftCurve from "../../../../../../public/leftCurve.png";
import goalsView from "../../../../../../public/goalsView.png";
import upperCurve from "../../../../../../public/upperCurve.png";
import PersonEdit from "../../../../../../public/personEdit.svg";
import TournamentImage from "../../../../../../public/teamImage.png";
import { LineChart } from "@mui/x-charts";
import CircleIcon from "@mui/icons-material/Circle";
import { useRouter } from "next/router";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import Edit from "../[id]/edit";
import { usePathname } from "next/navigation";
import { dateSorting } from "@/utils/helper";
import moment from "moment";
import { listChart } from "@/redux/slices/goalsTargets/chartListSlice";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

export default function ViewCard() {
  const [chartHeight, setChartHeight] = React.useState<any>(0);
  const yData: any = [100, 80, 60, 40, 20, 10, 0];
  type ViewBox = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMilestoneOpen, setIsMilestoneOpen] = React.useState(false);
  const [isMilestoneId, setIsMilestoneId] = React.useState<any>(null);
  const [isEditData, setisEditData] = React.useState(null);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleMilestone = (id: any) => {
    if (_.isNumber(id?.individualMileStoneID)) {
      setIsMilestoneOpen(true);
      setIsMilestoneId(id);
    } else {
      setIsMilestoneOpen(true);
    }
  };

  const viewBox: ViewBox = {
    x: 0,
    y: 0,
    height: chartHeight + 20,
  };
  const router = useRouter();
  const { id } = router.query;
  const { seasonID } = router.query;
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const dispatch: AppDispatch = useDispatch();
  const GoalsEditList = useSelector((state: RootState) =>
    state.editGoalsTargets.code === 200 &&
    !isEmpty(state.editGoalsTargets?.data[0])
      ? state.editGoalsTargets?.data[0]
      : null
  );
  const GoalsEditListLoading = useSelector(
    (state: RootState) => state.editGoalsTargets
  );
  const ListeChartData = useSelector((state: RootState) => state.ListeChart);

  const sortedMilestoneData: any = dateSorting(GoalsEditList?.mileStoneList);

  let data =
    sortedMilestoneData &&
    sortedMilestoneData.map((item: any) => {
      return item.status === "completed" ? +item?.milestonePercentage : 0;
    });
  data?.unshift(0);
  data?.push(0);

  let xData =
    sortedMilestoneData &&
    sortedMilestoneData.map((item: any) =>
      moment(item?.milestoneEndDate, "DD/MM/YYYY").format("DD MMM")
    );
  xData?.unshift("Start");
  xData?.push("End");

  let completedMilestoneIndex = -1;
  let mileStonePercentage = 0;

  if (sortedMilestoneData && sortedMilestoneData.length) {
    completedMilestoneIndex =
      sortedMilestoneData &&
      sortedMilestoneData.findLastIndex(
        (item: any) => item.status === "completed"
      );

    if (completedMilestoneIndex > -1) {
      mileStonePercentage =
        sortedMilestoneData[completedMilestoneIndex].milestonePercentage;
    }
  }

  React.useEffect(() => {
    const height: any = document?.getElementById("chartHeight")?.clientHeight;
    setChartHeight(height);
  }, []);

  React.useEffect(() => {
    if (checkAccess(USER_PERMISSION.GoalsTargetsView)) {
      if (id && seasonID) {
        const payload: any = {
          goalsAndTargetsID: id,
          sportID: teamId,
          seasonID: seasonID,
        };
        const dataPayload: any = {
          goalsAndTargetsID: id,
          sportID: teamId,
        };
        dispatch(editGoalsTargets(payload));
        dispatch(listChart(dataPayload));
      }
    } else {
      router.push("/access-denied");
    }
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    setisEditData(null);
    // dispatch(clearEditState());
  };

  const handleMilestoneClose = () => {
    setIsMilestoneOpen(false);
    setIsMilestoneId(null);
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
        className="dubai-regular"
      />
    );
  };

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtmlTags(content);

    return <div>{plainText}</div>;
  };

  const getCoachName = (coachData: any) => {
    return `${coachData.firstName} ${coachData.middleName} ${coachData.surname}`;
  };

  return (
    <>
      {GoalsEditListLoading.loading && !isOpen && !isMilestoneOpen ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: { lg: "70vh", xl: "78.5vh" },
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {isOpen && isEditData && (
            <Edit
              open={isOpen}
              onClose={handleClose}
              id={isEditData}
              module="edit"
              seasonID={seasonID}
            />
          )}
          {isMilestoneOpen && (
            <Edit
              open={isMilestoneOpen}
              onClose={handleMilestoneClose}
              id={isMilestoneId}
              module="milestone"
              seasonID={seasonID}
            />
          )}
          <Grid item xs={12}>
            <Box
              borderRadius={"8px"}
              // height={"384px"}
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
                height:{xs: "650px", sm:"750px", md: "384px"}
              }}
              p={2}
              position={"relative"}
            >
              <Image
                src={leftCurve}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  objectFit: "cover",
                  opacity: "0.25",
                }}
              />
              {/* <Image
                src={goalsView}
                alt="Logo"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: "20%",
                  objectFit: "cover",
                }}
              /> */}
              <Image
                src={upperCurve}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: 0,
                  right: "20%",
                  objectFit: "cover",
                  opacity: "0.25",
                }}
              />
              <Grid
                container
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Grid item md={7} p={3}>
                  <Typography className="bukra goal-target-view-head">
                    Improve Possession by <>{mileStonePercentage}%</>
                  </Typography>
                  <Tooltip
                    title={
                      <RenderEditorContentHtml
                        content={GoalsEditList?.description}
                      />
                    }
                  >
                    <Typography
                      mt={2}
                      className="dubai-regular goal-target-view-list webkit-line-clamp"
                    >
                      <RenderEditorContentHtml
                        content={GoalsEditList?.description}
                      />
                    </Typography>
                  </Tooltip>
                  <Box mt={1.5} display={"flex"}>
                    <Typography
                      px={2}
                      py={1}
                      sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      borderRadius={"8px"}
                      width={"auto"}
                      className="dubai-regular goal-target-view-list"
                    >
                      Start Date:{" "}
                      <span className="dubai-bold">
                        {GoalsEditList?.startDate}
                      </span>
                      &nbsp;&nbsp; End Date:{" "}
                      <span className="dubai-bold">
                        {GoalsEditList?.endDate}
                      </span>
                    </Typography>
                  </Box>
                  <Box mt={4} display={"flex"} alignItems={"center"}>
                    {GoalsEditList?.goalType === "team" ? (
                      <Image
                        alt="Profile Image"
                        src={TournamentImage}
                        style={{
                          width: 72,
                          height: 72,
                          border: "1px solid #FFFFFF",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <Avatar
                        alt="Profile Image"
                        src={GoalsEditList?.athleteProfileImage}
                        sx={{
                          width: 72,
                          height: 72,
                          margin: "1px solid #FFFFFF",
                        }}
                      />
                    )}
                    <Box ml={3}>
                      <Typography className="bukra goal-target-view-role">
                        {GoalsEditList?.rank}
                      </Typography>
                      {/* <Typography className="bukra goal-target-view-role">
                        {GoalsEditList?.goalName}
                      </Typography> */}
                      <Typography className="bukra goal-target-view-name">
                        {`${
                          GoalsEditList?.goalType === "team"
                            ? GoalsEditList?.sportName
                            : GoalsEditList?.athleteFirstName
                        } ${
                          GoalsEditList?.goalType === "team"
                            ? ""
                            : GoalsEditList?.athleteMiddleName
                        } ${
                          GoalsEditList?.goalType === "team"
                            ? ""
                            : GoalsEditList?.athleteSurName
                        }`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={3}>
                  <Box
                    display="flex"
                    gap={1}
                    justifyContent={"end"}
                    p={3}
                    pb={0}
                  >
                    {/* <Button
                      variant="contained"
                      sx={{
                        color: "#008755",
                        height: "48px",
                        backgroundColor: "#FFFFFF",
                      }}
                      startIcon={<SettingsOutlinedIcon />}
                      className="text-capitalize"
                    >
                      Update
                    </Button> */}
                    {checkAccess(USER_PERMISSION.GoalsTargetsEdit) ? (
                      <Button
                        variant="outlined"
                        sx={{
                          color: "#FFFFFF",
                          borderColor: "#FFFFFF",
                          width: "120px",
                          height: "48px",
                        }}
                        startIcon={<PersonEdit />}
                        className="text-capitalize dubai-regular season-goal-btn"
                        onClick={() =>
                          handleEditData(GoalsEditList?.goalsAndTargetsID)
                        }
                      >
                        Edit Goal
                      </Button>
                    ) : null}
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={5}
                  >
                    <Typography className="goal-target-view-status bukra">
                      Status:
                      <span
                        style={{ marginLeft: "8px" }}
                        className="dubai-regular goal-target-view-status-list"
                      >
                        {GoalsEditList?.status}
                      </span>
                    </Typography>
                    <Typography className="dubai-bold goal-target-view-status-list">
                      {mileStonePercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      mileStonePercentage != null &&
                      mileStonePercentage >= 0 &&
                      mileStonePercentage <= 100
                        ? mileStonePercentage
                        : 0 // Default to 0 if invalid or missing
                    }
                    sx={{
                      mb: 5,
                      mt: 1,
                      height: "8px",
                      borderRadius: "8px",
                      opacity: 1, // Always visible
                      backgroundColor: "rgba(255, 255, 255, 0.2)", // Background for the bar container
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          mileStonePercentage != null &&
                          mileStonePercentage >= 0 &&
                          mileStonePercentage <= 100
                            ? "rgba(241, 235, 156, 1)" // Yellow for valid values
                            : "rgba(255, 255, 255, 0.2)", // Green for invalid or missing values
                      },
                    }}
                  />
                  <Box
                    mt={1.5}
                    px={2}
                    py={1}
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    borderRadius={"8px"}
                  >
                    <Typography className="dubai-regular goal-target-view-list">
                      Create by
                      <br />{" "}
                      <span className="dubai-bold">Dubai police team</span>{" "}
                      (Admin)
                      <br /> {GoalsEditList?.createdOn}
                    </Typography>
                  </Box>

                  <Box mt={1.5} px={2} py={1} borderRadius={"8px"}>
                    <Tooltip
                      title={
                        GoalsEditList &&
                        GoalsEditList.coachResponsibleList &&
                        GoalsEditList.coachResponsibleList.length
                          ? GoalsEditList.coachResponsibleList
                              .map(
                                (item: any) =>
                                  `${item.firstName} ${item.middleName} ${item.surname}`
                              )
                              .join(", ")
                          : null
                      }
                    >
                      <Typography className="dubai-regular goal-target-view-list">
                        <span className="dubai-bold">Coach Responsible</span>{" "}
                        <br />
                        {GoalsEditList &&
                        GoalsEditList.coachResponsibleList &&
                        GoalsEditList.coachResponsibleList.length ? (
                          <span className="dubai-regular goal-target-view-list">
                            {getCoachName(
                              GoalsEditList.coachResponsibleList[0]
                            )}
                          </span>
                        ) : (
                          "--"
                        )}
                        {GoalsEditList &&
                        GoalsEditList.coachResponsibleList &&
                        GoalsEditList.coachResponsibleList.length > 1 ? (
                          <span className="dubai-regular">
                            {" "}
                            +{GoalsEditList.coachResponsibleList.length - 1}
                          </span>
                        ) : null}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} id="chartHeight">
            <Card sx={{ height: "560px", overflow: "scroll" }}>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Individual Milestones"
                className="primary-color card-header"
                action={
                  checkAccess(USER_PERMISSION.AddIndividualMilestones) ? (
                    <Tooltip title="Add milestones">
                      <Button
                        variant="contained"
                        size="small"
                        className="dubai-med text-capitalize"
                        startIcon={<SettingsOutlinedIcon />}
                        onClick={handleMilestone}
                        disabled={
                          sortedMilestoneData &&
                          sortedMilestoneData.length &&
                          sortedMilestoneData[sortedMilestoneData.length - 1]
                            .milestonePercentage >= 100
                        }
                      >
                        Add
                      </Button>
                    </Tooltip>
                  ) : null
                }
                sx={{ pr: 0 }}
              />
              <CardContent sx={{ py: 0 }}>
                <Stepper orientation="vertical" className="goal-vertical-line">
                  {sortedMilestoneData && sortedMilestoneData.length > 0 ? (
                    sortedMilestoneData.map((step: any, index: any) => (
                      <Step
                        key={index}
                        sx={{
                          display: "flex",
                          my: 1,
                          minHeight: "61px",
                        }}
                      >
                        <StepLabel
                          icon={
                            <CircleIcon
                              style={{
                                color: `${
                                  step.status === "completed"
                                    ? "#00426A"
                                    : "#A2173A"
                                }`,
                                width: 20,
                                height: 20,
                                border: `2px solid ${
                                  step.status === "completed"
                                    ? "#00426A"
                                    : "#A2173A"
                                }`,
                                borderRadius: "50%",
                              }}
                            />
                          }
                          sx={{ width: "100%", p: 0, mt: 0.25 }}
                        >
                          <Typography
                            display={"flex"}
                            className="bukra stepper-label-view secondary-color"
                            justifyContent={"space-between"}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleMilestone(step)}
                          >
                            {step.goal}
                            <span className="dubai-med secondary-color">
                              {step.completedDate}
                            </span>
                          </Typography>
                          <Typography
                            className="dubai-regular stepper-description-view secondary-color"
                            my={1}
                          >
                            {step.milestonePercentage
                              ? step.milestonePercentage
                              : 0}
                            %
                          </Typography>
                          <Typography className="dubai-regular stepper-description-view secondary-color webkit-line-clamp webkit-1">
                            {step.description ? step.description : <>&nbsp;</>}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))
                  ) : (
                    <Box p={3}>
                      <Alert
                        className="dubai-med"
                        severity="info"
                      >{`No record(s) found.`}</Alert>
                    </Box>
                  )}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className="card-height"
            sx={{ height: chartHeight }}
          >
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Athlete Progress Towards Goal"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                {sortedMilestoneData &&
                sortedMilestoneData.length > 0 &&
                data.length > 0 ? (
                  <LineChart
                    sx={{
                      "& .MuiAreaElement-series-Germany": {
                        fill: "url('#lineChartGradient')",
                      },
                    }}
                    grid={{ horizontal: true }}
                    xAxis={[
                      {
                        data: xData?.length
                          ? xData
                          : [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sept",
                              "Oct",
                              "Nov",
                              "Dec",
                            ],
                        scaleType: "point",
                      },
                    ]}
                    yAxis={[
                      {
                        data: yData?.length ? yData : [0],
                        valueFormatter: (value) => `${value}%`,
                      },
                    ]}
                    series={[
                      {
                        data: data?.length ? data : [0],
                        showMark: true,
                        connectNulls: true,
                        area: true,
                        id: "Germany",
                      },
                    ]}
                    height={chartHeight - 50}
                    viewBox={viewBox}
                    margin={{ top: 10, bottom: 20 }}
                    className="chart-liner-list-goals"
                  >
                    <svg height="0" width="0">
                      <defs>
                        <linearGradient
                          id="lineChartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="40%"
                            stopColor="rgba(228, 0, 43, 0.2)"
                          />
                          <stop offset="100%" stopColor="rgba(228, 0, 43, 0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </LineChart>
                ) : (
                  <Box p={3}>
                    <Alert
                      className="dubai-med"
                      severity="info"
                    >{`No Milestone(s) has been completed/added.`}</Alert>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Goal Strategy"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent content={GoalsEditList?.goalStrategy} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Challenges"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent content={GoalsEditList?.challenges} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Action Steps"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent content={GoalsEditList?.actionSteps} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Description"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent content={GoalsEditList?.description} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Notes"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent content={GoalsEditList?.note} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
