"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import * as React from "react";
import EditSVG from "../../../../public/Edit-white.svg";
import ChampionIcon from "../../../../public/Champions.svg";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Link,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import _, { isEmpty } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import UpdateTrainingPerformanceSlider from "./updateTeamPerformance";
import { editResults } from "@/redux/slices/results/ResultEditSlice";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  clearviewTeamPerformanceState,
  viewTeamPerformance,
} from "@/redux/slices/results/TeamPerformanceList";
import Axios from "../../../utils/axiosFileInstance";
import SlideResultDialog from "@/pages/teams/[teamID]/results/edit/SlideDialog";
import SlideResultDialogs from "@/pages/latest-results/edit/SlideDialog";
import CustomButton from "@/components/buttons/CustomButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

export default function ViewTrainingCamp(props: any) {
  const resultView = props.module;
  const router = useRouter();
  const { id, teamID, sportId } = router.query;
  const resultID = id;
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  const viewResultsData = useSelector((state: RootState) => {
    return state &&
      state.getResultByID &&
      !isEmpty(state?.getResultByID?.data) &&
      !isEmpty(state?.getResultByID?.data[0])
      ? state.getResultByID.data[0]
      : null;
  });

  const viewTeamPerformanceData = useSelector((state: RootState) => {
    return state &&
      state.GetTeamPerformanceList &&
      !isEmpty(state?.GetTeamPerformanceList?.data) &&
      !isEmpty(state?.GetTeamPerformanceList?.data[0])
      ? state.GetTeamPerformanceList.data[0]
      : null;
  });

  useEffect(() => {
    if (
      (resultView !== "latest-results" &&
        checkAccess(USER_PERMISSION.ResultView)) ||
      (resultView === "latest-results" &&
        checkAccess(USER_PERMISSION.LatestResultsView))
    ) {
      if (!resultID || !teamID) return;
      const payload: any = {
        resultID: resultID,
        sportID: Number(teamID) || sportId,
      };
      dispatch(editResults(payload));
    } else {
      router.push("/access-denied");
    }
  }, [resultID, teamID]);

  useEffect(() => {
    if (!resultID) return;
    const payload: any = {
      resultID: resultID,
    };

    dispatch(viewTeamPerformance(payload));
  }, [resultID]);

  useEffect(() => {
    return () => {
      dispatch(clearviewTeamPerformanceState());
    };
  }, []);

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtmlTags(content);

    return <div>{plainText ? plainText : "--"}</div>;
  };

  const barData = [
    {
      id: 0,
      label: "Speed",
      TeamA: Number(viewTeamPerformanceData?.teamASpeed) || 0,
      TeamB: Number(viewTeamPerformanceData?.teamBSpeed) || 0,
    },
    {
      id: 1,
      label: "Endurance",
      TeamA: Number(viewTeamPerformanceData?.teamAEndurance) || 0,
      TeamB: Number(viewTeamPerformanceData?.teamBEndurance) || 0,
    },
    {
      id: 2,
      label: "Accuracy",
      TeamA: Number(viewTeamPerformanceData?.teamAAccuracy) || 0,
      TeamB: Number(viewTeamPerformanceData?.teamBAccuracy) || 0,
    },
    {
      id: 3,
      label: "Teamwork",
      TeamA: Number(viewTeamPerformanceData?.teamATeamwork) || 0,
      TeamB: Number(viewTeamPerformanceData?.teamBTeamwork) || 0,
    },
    {
      id: 4,
      label: "Strategy",
      TeamA: Number(viewTeamPerformanceData?.teamAStrategy) || 0,
      TeamB: Number(viewTeamPerformanceData?.teamBStrategy) || 0,
    },
  ];

  const teamColors = [
    { id: "TeamA", label: "Team A", color: "rgba(2, 164, 111, 1)" },
    { id: "TeamB", label: "Team B", color: "rgba(255, 165, 31, 1)" },
  ];

  useEffect(() => {
    if (id) {
      const payload: any = {
        resultID: id,
        sportID: Number(teamID) || sportId,
      };
      dispatch(editResults(payload));
    }
  }, [id]);

  const handleUpdateTrainingClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setUpdateOpen(false);
  };

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleUpdateTraining = (isEdit: any) => {
    setUpdateOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);

    if (id) {
      const payload: any = {
        resultID: id,
        sportID: Number(teamID) || sportId,
      };
      dispatch(editResults(payload));
    }
  };

  const downloadFile = async (file: any) => {
    if (file?.moduleID !== null) {
      try {
        const response = await Axios.get(file.filePath, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.fileName);
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    }
  };

  return (
    <Grid container spacing={2}>
      {isOpen &&
        isEditData &&
        (resultView === "latest-results" ? (
          <SlideResultDialogs
            open={isOpen}
            onClose={(event: any, reason: any) => handleClose(event, reason)}
            id={id}
            module={"LatestResult"}
            setisEditData={setisEditData}
          />
        ) : (
          <SlideResultDialog
            open={isOpen}
            onClose={(event: any, reason: any) => handleClose(event, reason)}
            id={id}
            module={"Result"}
            setisEditData={setisEditData}
          />
        ))}
      {updateOpen && id && (
        <UpdateTrainingPerformanceSlider
          open={updateOpen}
          onClose={(event: any, reason: any) =>
            handleUpdateTrainingClose(event, reason)
          }
          id={id}
          module={"trainingPlan"}
          TrainingPerformanceData={viewTeamPerformanceData}
        />
      )}
      <Grid item xs={12} md={12}>
        <Card sx={{ border: 0, boxShadow: "none" }}>
          <Grid container direction="column" height="100%">
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              p={3}
              container
              alignItems={"start"}
              justifyContent={"space-between"}
            >
              <Grid item md={8}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="flex-start !important"
                  mt={1}
                  mb={1}
                >
                  <ChampionIcon width={"30px"} height={"30px"} />
                  <Typography
                    sx={{
                      fontSize: "24px",
                      color: "#005844",
                      ml: 1,
                    }}
                    className="bukra-semi-bold"
                  >
                    {viewResultsData?.eventName}
                  </Typography>
                </Box>
                {/* </Tooltip> */}
                <Box mt={1.5} display={"flex"}>
                  <Typography
                    width={"auto"}
                    sx={{
                      fontWeight: 500,
                      fontSize: "15px",
                      color: "#58585B",
                    }}
                    className="bukra"
                  >
                    <span style={{ color: "#58585B" }}>Event Date: </span>
                    <span
                      className="dubai-regular text-ellipsis"
                      style={{ color: "#58585B", fontSize: "16px" }}
                    >
                      {viewResultsData?.eventDate}
                    </span>
                    &nbsp;&nbsp;{" "}
                    <span style={{ color: "#58585B" }}>Event Time: </span>
                    <span
                      className="dubai-regular text-ellipsis"
                      style={{ color: "#58585B", fontSize: "16px" }}
                    >
                      {viewResultsData?.eventTime}
                    </span>
                  </Typography>
                </Box>
                <Box mt={1.5} display={"flex"}>
                  <Typography
                    width={"auto"}
                    sx={{
                      fontFamily: "29LT Bukra",
                      fontWeight: 500,
                      fontSize: "15px",
                      color: "#58585B",
                    }}
                    className="bukra"
                  >
                    <span style={{ color: "#58585B" }}>Event Location: </span>
                    <span
                      className="dubai-regular text-ellipsis"
                      style={{ color: "#58585B", fontSize: "16px" }}
                    >
                      {viewResultsData?.eventLocation}
                    </span>
                  </Typography>
                </Box>
                <Box mt={2.5} display={"flex"} alignItems={"center"}>
                  <Box
                    px={2}
                    py={1}
                    sx={{
                      backgroundColor: "rgba(0, 135, 85, 0.03)",
                      borderRadius: "6px",
                      border: "1px solid rgba(0, 135, 85, 0.3)",
                    }}
                    width={"auto"}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Sports Category
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#000000",
                      }}
                      className="dubai-med"
                    >
                      {viewResultsData?.sportsCategory}
                    </Typography>
                  </Box>
                  <Box
                    px={2}
                    py={1}
                    sx={{
                      backgroundColor: "rgba(0, 135, 85, 0.03)",
                      borderRadius: "6px",
                      border: "1px solid rgba(0, 135, 85, 0.3)",
                    }}
                    width={"auto"}
                    ml={2}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Race Relevance
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#000000",
                      }}
                      className="dubai-med"
                    >
                      {viewResultsData?.raceRelevanceAndImportance
                        ? viewResultsData?.raceRelevanceAndImportance
                        : "--"}
                    </Typography>
                  </Box>
                  <Box
                    px={2}
                    py={1}
                    sx={{
                      backgroundColor: "rgba(0, 135, 85, 0.03)",
                      borderRadius: "6px",
                      border: "1px solid rgba(0, 135, 85, 0.3)",
                    }}
                    width={"auto"}
                    ml={2}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Discipline:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#000000",
                      }}
                      className="dubai-med"
                    >
                      {viewResultsData?.discipline
                        ? viewResultsData?.discipline
                        : "--"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={3}>
                {(checkAccess(USER_PERMISSION.ResultEdit) &&
                  resultView !== "latest-results") ||
                (checkAccess(USER_PERMISSION.LatestResultsEdit) &&
                  resultView === "latest-results") ? (
                  <Box display="flex" gap={1} justifyContent={"end"} pb={0}>
                    <CustomButton
                      sx={{
                        ml: 2,
                        backgroundColor: "#008755",
                        borderColor: "#008755",
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                      }}
                      label="Edit"
                      variant="outlined"
                      size="medium"
                      ButtonIcon={EditSVG}
                      iconPosition="start"
                      onClick={handleEditData}
                    />
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} className="card-height">
        <Card sx={{ boxShadow: "none" }}>
          <CardHeader
            avatar={<ListOutlinedIcon />}
            title="Home Team"
            className="primary-color card-header"
          />
          <CardContent sx={{ py: 0 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                sx={{
                  fontSize: "24px",
                  lineHeight: "24px",
                  color: "#005844",
                }}
                className="bukra-semi-bold"
              >
                {viewResultsData?.homeTeamName}
              </Typography>
              {viewResultsData?.selectWinner ===
              viewResultsData?.homeTeamName ? (
                <Chip
                  label={"Winner"}
                  sx={{
                    padding: "0px",
                    backgroundColor: "#FFFAE8",
                    color: "#000000",
                    height: "20px",
                    border: "1px solid #FFAF2F",
                    borderRadius: "4px",
                    ".MuiChip-label": {
                      fontSize: "14px",
                      lineHeight: "18px",
                      textAlign: "left",
                      paddingY: "7px",
                      paddingX: "10px",
                    },
                  }}
                  className="dubai-bold"
                />
              ) : null}
            </Box>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Chip
                label={
                  <Box display="flex" flexDirection="row">
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        textAlign: "left",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Score:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        textAlign: "left",
                      }}
                      className="dubai-med"
                    >
                      {viewResultsData?.homeTeamValue
                        ? `${viewResultsData?.resultType} ${viewResultsData?.homeTeamValue} ${viewResultsData?.unit}`
                        : "--"}
                    </Typography>
                  </Box>
                }
                sx={{
                  padding: "0px",
                  fontSize: "15px",
                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                  color: "#000000",
                  lineHeight: "18px",
                  height: "43px",
                  ".MuiChip-label": {
                    py: "7px",
                    px: "10px",
                  },
                  border: "1px solid rgba(0, 135, 85, 0.3)",
                  borderRadius: "6px",
                }}
                className="bukra"
              />
            </Box>
            {/* </Typography> */}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} className="card-height">
        <Card sx={{ boxShadow: "none" }}>
          <CardHeader
            avatar={<ListOutlinedIcon />}
            title="Away Team"
            className="primary-color card-header"
          />
          <CardContent sx={{ py: 0 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                sx={{
                  fontSize: "24px",
                  lineHeight: "24px",
                  color: "#005844",
                }}
                className="bukra-semi-bold"
              >
                {viewResultsData?.awayTeamName}
              </Typography>
              {viewResultsData?.selectWinner ===
              viewResultsData?.awayTeamName ? (
                <Chip
                  label={"Winner"}
                  sx={{
                    padding: "0px",
                    backgroundColor: "#FFFAE8",
                    color: "#000000",
                    height: "20px",
                    border: "1px solid #FFAF2F",
                    borderRadius: "4px",
                    ".MuiChip-label": {
                      fontSize: "12px",
                      lineHeight: "18px",
                      textAlign: "left",
                      paddingY: "7px",
                      paddingX: "10px",
                    },
                  }}
                  className="dubai-bold"
                />
              ) : null}
            </Box>

            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Chip
                label={
                  <Box display="flex" flexDirection="row">
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        textAlign: "left",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Score:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        textAlign: "left",
                      }}
                      className="dubai-med"
                    >
                      {viewResultsData?.awayTeamValue
                        ? `${viewResultsData?.resultType} ${viewResultsData?.awayTeamValue} ${viewResultsData?.unit}`
                        : "--"}
                    </Typography>
                  </Box>
                }
                sx={{
                  padding: "0px",
                  fontSize: "15px",
                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                  color: "#000000",
                  lineHeight: "18px",
                  height: "43px",
                  ".MuiChip-label": {
                    py: "7px",
                    px: "10px",
                  },
                  border: "1px solid rgba(0, 135, 85, 0.3)",
                  borderRadius: "6px",
                }}
                className="bukra"
              />
            </Box>
            {/* </Typography> */}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} className="card-height">
        <Card sx={{ boxShadow: "none" }}>
          <CardHeader
            avatar={<ListOutlinedIcon />}
            title="Home Team Details"
            className="primary-color card-header"
          />
          <CardContent sx={{ py: 0, m: 0 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={6}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      General Ranking:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.generalRanking
                        ? viewResultsData?.generalRanking
                        : "--"}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Seasonal League Ranking:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.seasonalLeagueRanking
                        ? viewResultsData?.seasonalLeagueRanking
                        : "--"}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Achievement:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.achievement
                        ? viewResultsData?.achievement
                        : "--"}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Comments:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      <RenderEditorContentHtml
                        content={viewResultsData?.comments}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Category Ranking:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.categoryRanking
                        ? viewResultsData?.categoryRanking
                        : "--"}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Performance:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.performance
                        ? viewResultsData?.performance
                        : "--"}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: "#58585B",
                      }}
                      className="bukra"
                    >
                      Upload official race ranking:
                    </Typography>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        downloadFile(viewResultsData?.fileList[0]);
                      }}
                      sx={{
                        fontFamily: "Dubai",
                        fontWeight: 500,
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#05868E",
                        textDecoration: "none",
                      }}
                      className="dubai-regular"
                    >
                      {viewResultsData?.fileList?.some((item: any) =>
                        item.filePath?.trim()
                      ) && <div>{viewResultsData.fileList[0].fileName}</div>}
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} className="card-height">
        <Card sx={{ boxShadow: "none" }}>
          <CardHeader
            avatar={<ListOutlinedIcon />}
            title="Team Performance Comparison"
            className="primary-color card-header"
            action={
              <Tooltip title="Compare team results">
                <Button
                  variant="contained"
                  sx={{
                    color: "#FFFFFF",
                    height: "33px",

                    backgroundColor: "#008755",
                  }}
                  startIcon={<SettingsOutlinedIcon />}
                  className="text-capitalize dubai-med"
                  onClick={handleUpdateTraining}
                >
                  Update
                </Button>
              </Tooltip>
            }
          />
          <CardContent sx={{ py: 0, m: 0 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: 350
                }}
              >
                <BarChart
                  sx={{
                    "& rect": {
                      rx: 3,
                    },
                  }}
                  dataset={barData}
                  xAxis={[{ scaleType: "band", dataKey: "label" }]}
                  series={[
                    {
                      dataKey: "TeamA",
                      label: "Team A",
                      color: "rgba(2, 164, 111, 1)",
                    },
                    {
                      dataKey: "TeamB",
                      label: "Team B",
                      color: "rgba(255, 165, 31, 1)",
                    },
                  ]}
                  width={850}
                  height={400}
                  yAxis={[{ min: 0, max: 100 }]}
                  grid={{ vertical: true, horizontal: true }}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                />

                {/* Custom Legend */}
                <Stack
                  direction="row"
                  spacing={4}
                  mt={2}
                  justifyContent="center"
                >
                  {teamColors.map((team) => (
                    <Stack
                      key={team.id}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          backgroundColor: team.color,
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: team.id === "TeamA" ? "green" : "navy",
                        }}
                      >
                        {team.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
