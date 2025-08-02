import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
} from "@mui/material";
import XLS from "../../../public/svg/xls.svg";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LineChart } from "@mui/x-charts";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { useRouter } from "next/router";
import AppAlert from "../alert/AppAlert";
import { RenderEditorContentHtml } from "@/utils/helper";

interface ViewPageNavProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  type?: any;
  sportID?: any;
  athleteID?: any;
  athleteData?: any;
  staffData?: any;
}
const ResultsAndAchievements: React.FC<ViewPageNavProps> = ({
  label,
  expanded,
  onClick,
  type,
  sportID,
  athleteID,
  athleteData,
  staffData,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (type === "athlete" && athleteData?.length > 0) {
      const updatedDetatils = athleteData.map((item: any) => item.points);
      setChartData(updatedDetatils);
    }
    if (type === "staff" && staffData?.length > 0) {
      const updatedDetatils = staffData.map((item: any) => item.points);
      setChartData(updatedDetatils);
    }
  }, [type, athleteData, staffData]);

  const [chartHeight, setChartHeight] = useState<any>(0);

  const data = [2, 4, 6, 8, 6];
  const xData = ["12 Sep", "15 Sep", "25 Sep", "1 Oct", "15 Oct"];
  const yData = [8, 6, 4, 2, 0];
  const router = useRouter();
  const { teamID } = router.query;

  type ViewBox = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };

  const viewBox: ViewBox = {
    x: 0,
    y: 0,
    height: chartHeight + 20,
  };

  useEffect(() => {
    const height: any = document?.getElementById("chartHeight")?.clientHeight;
    setChartHeight(height);
  }, []);

  // Export to Excel
  const downloadExcel = async () => {
    try {
      if (type === "staff") {
        const response = await axiosCallBlob.post(
          `${process.env.API_BASE_URL}/Sports/ExportAchievementListForStaff`,
          {
            sportID: sportID,
            loggedUserID: 1,
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "staffList.xlsx");
        document.body.appendChild(link);
        link.click();

        // Clean up
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }
      if (type === "athlete") {
        const response = await axiosCallBlob.post(
          `${process.env.API_BASE_URL}/Sports/ExportAchievementList`,
          {
            sportID: sportID,
            athleteID: athleteID,
            loggedUserID: 1,
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "athleteList.xlsx");
        document.body.appendChild(link);
        link.click();

        // Clean up
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  const showNoRecordsFound = () => {
    if (type === "staff") {
      if (!staffData) return true;
      if (staffData.length < 1) return true;
    }
    if (type === "athlete") {
      if (!athleteData) return true;
      if (athleteData.length < 1) return true;
    }
    return false;
  };

  return (
    <>
      <Box
        className="bg-white"
        sx={{
          marginTop: 1,
          marginBottom: 1,
          padding: 1,
          borderRadius: "8px",
        }}
        pt={2}
      >
        <Grid
          container
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
          onClick={onClick}
        >
          <Grid item xs={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="subtitle1"
                sx={{
                  padding: 1,
                  fontSize: "18px",
                  color: "#008755",
                  textAlign: "left",
                }}
                className="bukra-semi-bold"
              >
                {label}
              </Typography>
              {/* <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "30.38px",
                  textAlign: "right",
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#58585B",
                }}
                className="dubai-med"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                More
              </Typography> */}
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ gap: 1, height: 36 }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 500,
                  lineHeight: "21.6px",
                  textAlign: "left",
                  color: "#008755",
                  mr: 2,
                }}
                className="bukra"
              >
                Team Performance in Latest Matches
              </Typography>
              <Button
                disabled={showNoRecordsFound()}
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "29px",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0, 135, 85, 1)",
                  backgroundColor: "rgba(0, 135, 85, 0.1)",
                  color: "#008755",
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: "21.94px",
                  textAlign: "left",
                  textTransform: "none",
                }}
                className="dubai-med"
                startIcon={
                  <XLS
                    alt="xls"
                    style={{
                      width: "19.48px",
                      height: "20.22px",
                      color: "#008755",
                      marginLeft: "6px",
                    }}
                  />
                }
                onClick={(e: any) => {
                  e.stopPropagation();
                  downloadExcel();
                }}
              >
                Export to Excel
              </Button>
              {!expanded ? (
                <Box>
                  <NavigateNextIcon sx={{ cursor: "pointer" }} />
                </Box>
              ) : (
                <Box>
                  <ExpandMoreIcon sx={{ cursor: "pointer" }} />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {!showNoRecordsFound() ? (
          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              sm={6}
              md={5.5}
              lg={5}
              xl={4}
              justifyContent={"center"}
              id="chartHeight"
            >
              <Box px={1}>
                <Stepper orientation="vertical" className="vertical-line">
                  {type === "athlete" &&
                    athleteData &&
                    athleteData?.length > 0 &&
                    athleteData.map((step: any, index: any) => (
                      <Step
                        key={step.rewardName}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: 1,
                          minHeight: "61px",
                        }}
                      >
                        <Box width={"15%"}>
                          <Typography
                            className="dubai-bold stepper-description-view secondary-color"
                            px={1}
                            textAlign={"center"}
                          >
                            {step.dateofAward ? step.dateofAward : "---"}
                          </Typography>
                        </Box>
                        <StepLabel
                          icon={
                            <RadioButtonUncheckedIcon
                              style={{
                                color: `${step.color}`,
                                width: 12,
                                height: 12,
                              }}
                            />
                          }
                          sx={{ width: "85%", p: 0 }}
                        >
                          <Tooltip title={step && step.rewardName}>
                            <Typography
                              className="dubai-med stepper-label-view primary-color webkit-line-clamp webkit-1"
                              sx={{ width: "100%" }}
                            >
                              {step.rewardName ? step.rewardName : "---"}
                            </Typography>
                          </Tooltip>
                          <Typography
                            className="dubai-regular stepper-description-view secondary-color webkit-line-clamp webkit-1"
                            sx={{ width: "100%" }}
                          >
                            {RenderEditorContentHtml(step.description ? step.description : "---")}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  {type === "staff" &&
                    staffData &&
                    staffData?.length > 0 &&
                    staffData.map((step: any, index: any) => (
                      <Step
                        key={step.rewardName}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: 1,
                          minHeight: "61px",
                        }}
                      >
                        <Box width={"15%"}>
                          <Typography
                            className="dubai-bold stepper-description-view secondary-color"
                            px={1}
                            textAlign={"center"}
                          >
                            {step.dateofAward ? step.dateofAward : "---"}
                          </Typography>
                        </Box>
                        <StepLabel
                          icon={
                            <RadioButtonUncheckedIcon
                              style={{
                                color: `${step.color}`,
                                width: 12,
                                height: 12,
                              }}
                            />
                          }
                          sx={{ width: "85%", p: 0 }}
                        >
                          <Tooltip title={step && step.rewardName}>
                            <Typography
                              className="dubai-med stepper-label-view primary-color webkit-line-clamp webkit-1"
                              sx={{ width: "100%" }}
                            >
                              {step.rewardName ? step.rewardName : "---"}
                            </Typography>
                          </Tooltip>
                          <Typography
                            className="dubai-regular stepper-description-view secondary-color webkit-line-clamp webkit-1"
                            sx={{ width: "100%" }}
                          >
                            {step.description ? step.description : "---"}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                </Stepper>
              </Box>
            </Grid>
            <Grid
              item
              sm={6}
              md={6.5}
              lg={7}
              xl={8}
              p={2}
              className="dubai-med"
            >
              {type === "athlete" || type === "staff" ? (
                <LineChart
                  xAxis={[
                    {
                      data: xData,
                      scaleType: "point",
                      label: "Latest Matches",
                    },
                  ]}
                  yAxis={[
                    { data: yData, scaleType: "point", label: "Score Points" },
                  ]}
                  series={[
                    {
                      data: chartData,
                      showMark: false,
                      area: true,
                      connectNulls: true,
                      color: "#26D07C",
                    },
                  ]}
                  height={chartHeight}
                  viewBox={viewBox}
                  margin={{ top: 10, bottom: 20 }}
                  className="chart-liner-list"
                />
              ) : (
                <LineChart
                  xAxis={[
                    {
                      data: xData,
                      scaleType: "point",
                      label: "Latest Matches",
                    },
                  ]}
                  yAxis={[
                    { data: yData, scaleType: "point", label: "Score Points" },
                  ]}
                  series={[
                    {
                      data,
                      showMark: false,
                      area: true,
                      connectNulls: true,
                      color: "#26D07C",
                    },
                  ]}
                  height={chartHeight}
                  viewBox={viewBox}
                  margin={{ top: 10, bottom: 20 }}
                  className="chart-liner-list"
                />
              )}
            </Grid>
          </Grid>
        ) : null}

        {showNoRecordsFound() ? (
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12}>
              <AppAlert type="info" message="No record(s) found." />
            </Grid>
          </Grid>
        ) : null}
      </Box>
    </>
  );
};

export default ResultsAndAchievements;
