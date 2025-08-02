import {
  Box,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Tooltip,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Vector from "../../../public/svg/Vector.svg";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ResultAchivedCampSlider from "../trainingCamp/view/resultAchived";
import moment from "moment";
import { isEmpty } from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface ResultsAchievedProps {
  label?: string;
  expanded?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  id: any;
  trainingCampData: any;
}
const ResultsAchieved: React.FC<ResultsAchievedProps> = ({
  label,
  expanded,
  onClick,
  id,
  trainingCampData,
}) => {
  const color = [
    "#1BC5BD",
    "#663259",
    "#F64E60",
    "#3699FF",
    "#EF6327",
    "#8950FC",
  ];
  const [chartHeight, setChartHeight] = useState<any>(0);
  const [resultId, setResultId] = useState<any>(0);
  const sortedData =
    trainingCampData &&
    trainingCampData.resultAchivedList &&
    [...trainingCampData.resultAchivedList].sort((a: any, b: any) => {
      const dateA: any = new Date(
        a.achievementDate.split("/").reverse().join("-")
      );
      const dateB: any = new Date(
        b.achievementDate.split("/").reverse().join("-")
      );
      return dateB - dateA;
    });
  const data =
    sortedData && sortedData.map((item: any) => item?.scorePoints).reverse();
  data?.unshift(0);
  data?.push(0);
  const xData =
    sortedData &&
    sortedData
      .map((item: any) =>
        moment(item?.achievementDate, "DD/MM/YYYY").format("DD MMM")
      )
      .reverse();
  xData?.unshift("Start");
  xData?.push("End");
  const yData: any = [100, 80, 60, 40, 20, 0];
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
  const [resultOpen, setResultOpen] = React.useState(false);

  useEffect(() => {
    const height: any = document?.getElementById("chartHeight")?.clientHeight;
    setChartHeight(height);
  }, []);

  const handleResultTrainingCamp = () => {
    setResultOpen(true);
  };

  const handleUpdateTrainingClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setResultOpen(false);
    setResultId("");
  };

  const handleEditOpen = (id: any) => {
    setResultOpen(true);
    setResultId(id);
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px dashed #26D07C",
          borderRadius: "4px",
          backgroundColor: "rgba(38, 208, 124, 0.1)",
          fontSize: "16px",
          fontWeight: 500,
          color: "#58585B",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxHeight: "60px",
        }}
        className="dubai-med"
      />
    );
  };

  return (
    <>
      {resultOpen && id && (
        <ResultAchivedCampSlider
          open={resultOpen}
          onClose={(event: any, reason: any) =>
            handleUpdateTrainingClose(event, reason)
          }
          id={id}
          module={"trainingPlan"}
          TrainingCampData={trainingCampData}
          resultId={resultId}
        />
      )}
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
                  fontSize: "18px",
                  textAlign: "left",
                  color: "#008755",
                  marginLeft: "15px",
                }}
                className="bukra-semi-bold"
              >
                Performance in Training Camp
              </Typography>
              {checkAccess(USER_PERMISSION.TrainingCampAdd) && (
                <Tooltip title="Add camp achievements">
                  <Button
                    variant="outlined"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "29px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      border: "1px solid rgba(0, 135, 85, 1)",
                      backgroundColor: "#008755",
                      color: "#FFFFFF",
                      fontFamily: "Dubai",
                      fontSize: "13px",
                      fontWeight: 500,
                      lineHeight: "21.94px",
                      textAlign: "left",
                      textTransform: "none",
                      marginLeft: "auto",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResultTrainingCamp();
                    }}
                    className="dubai-med"
                    startIcon={
                      <Vector
                        alt="xls"
                        style={{
                          width: "14.4px",
                          height: "15.30px",
                          color: "#FFFFFF",
                          marginLeft: "6px",
                        }}
                      />
                    }
                  >
                    Add
                  </Button>
                </Tooltip>
              )}
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
        <Grid container spacing={1} height={"500px"} overflow={"scroll"}>
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
                {sortedData && sortedData.length > 0 ? (
                  sortedData
                    .map((step: any, index: any) => (
                      <Step
                        key={index}
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
                            {moment(step.achievementDate, "DD/MM/YYYY").format(
                              "DD MMM YYYY"
                            )}
                          </Typography>
                        </Box>
                        <StepLabel
                          icon={
                            <RadioButtonUncheckedIcon
                              style={{
                                color: color[index],
                                width: 12,
                                height: 12,
                              }}
                            />
                          }
                          sx={{ width: "85%", p: 0 }}
                          onClick={() => handleEditOpen(step)}
                        >
                          <Typography
                            className="dubai-med stepper-label-view primary-color text-capitalize"
                            sx={{ cursor: "pointer" }}
                          >
                            {step.achievementType}
                          </Typography>
                          <Typography className="dubai-regular stepper-description-view secondary-color text-capitalize">
                            {isEmpty(step.achievementDetails) ? null : (
                              <RenderEditorContent
                                content={step.achievementDetails}
                              />
                            )}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))
                    .reverse()
                ) : (
                  <Box p={3}>
                    <Alert
                      className="dubai-med"
                      severity="info"
                    >{`No Result(s) has been added.`}</Alert>
                  </Box>
                )}
              </Stepper>
            </Box>
          </Grid>
          <Grid item sm={6} md={6.5} lg={7} xl={8} p={2} className="dubai-med">
            <LineChart
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
                },
              ]}
              series={[
                {
                  data: data?.length ? data : [0],
                  showMark: true,
                  area: true,
                  connectNulls: true,
                  color: "#26D07C",
                },
              ]}
              height={chartHeight - 30}
              viewBox={viewBox}
              margin={{ top: 10, bottom: 20 }}
              className="chart-liner-list"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default ResultsAchieved;
