import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Box, Typography, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../Fields/DropDown";
import { useForm } from "react-hook-form";
import { getTotalTraining } from "@/redux/slices/dashboard/getTotalTrainingSlice";

const TotalTrainingAndAttendanceRate: React.FC<any> = () => {
  const cardGraph = useRef<HTMLImageElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const getTotalTrainingData = useSelector(
    (state: RootState) => state.getTotalTraining
  );
  const teamProgress = [
    { value: "monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ];

  const { control, watch } = useForm<any>({
    defaultValues: {
      progressType: "monthly",
    },
  });

  const progressType = watch("progressType");
  const [xchartLabels, setXchartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [innerWidth, setInnerWidth] = useState<any>("");
  const [innerHeight, setInnerHeight] = useState<any>("");

  useEffect(() => {
    if (Array.isArray(getTotalTrainingData?.data)) {
      // Extract months for x-axis
      const months: any =
        getTotalTrainingData?.data.length > 0 &&
        getTotalTrainingData.data.map((item) => item.xAxisValue);

      // Extract values for y-axis (converted to numbers)
      const values: any =
        getTotalTrainingData?.data.length > 0 &&
        getTotalTrainingData.data.map((item) => Number(item.yAxisValue));

      setXchartLabels(months);
      setChartData(values);
    }
  }, [getTotalTrainingData]);

  const dispatchGetTotalTraining = () => {
    const payload = {
      sportID: 0,

      section: progressType ? progressType : "monthly",
      year: "2024",
    };
    dispatch(getTotalTraining({ url: "/GetTotalTraining", payload: payload }));
  };

  useEffect(() => {
    dispatchGetTotalTraining();
  }, [progressType]);

  useEffect(() => {
    setInnerWidth(cardGraph.current?.clientWidth);
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  return (
    <>
      {getTotalTrainingData && getTotalTrainingData?.loading && (
        <Card
          sx={{
            p: 2,
            pb: 0,
            boxShadow: "none",
            borderRadius: "8px",
            height: innerHeight,
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={innerHeight - 80}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      {getTotalTrainingData && !getTotalTrainingData?.loading && (
        <Card
          sx={{
            height: "700px",
            background: "#FFFFFF",
            color: "black",
            borderRadius: 2,
            boxShadow: "none",
            paddingTop: "16px",
            paddingRight: "16px",
            paddingLeft: "16px",
          }}
          ref={cardGraph}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              mb={5}
            >
              <Typography
                color="#00000"
                pb={5}
                sx={{
                  fontSize: "18px",
                  fontWeight: 500,
                }}
                className="bukra"
              >
                Total Trainings
              </Typography>
              <Box>
                <form>
                  <DropDown
                    name="progressType"
                    control={control}
                    options={teamProgress}
                    multiple={false}
                    variant="outlined"
                  />
                </form>
              </Box>
            </Box>

            <Box>
              <LineChart
                sx={{
                  "& .MuiAreaElement-series-Germany": {
                    fill: "url('#lineChartGradientChart')",
                  },
                }}
                grid={{ horizontal: true }}
                xAxis={[
                  {
                    data: xchartLabels,
                    scaleType: "point",
                  },
                ]}
                yAxis={[
                  {
                    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    valueFormatter: (value) => `${value}`,
                  },
                ]}
                series={[
                  {
                    data: chartData && chartData,
                    showMark: false,
                    connectNulls: true,
                    area: true,
                    id: "Germany",
                    color: "#E4002B",
                  },
                ]}
                height={480}
                width={innerWidth && innerWidth - 50}
                margin={{ top: 10, bottom: 20 }}
                className="chart-liner-list-dashboard"
              >
                <svg height="0" width="0">
                  <defs>
                    <linearGradient
                      id="lineChartGradientChart"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="40%" stopColor="rgba(228, 0, 43, 0.2)" />
                      <stop offset="100%" stopColor="rgba(228, 0, 43, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </LineChart>
            </Box>
          </CardContent>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            mt={2}
            mb={2}
          >
            <Box
              sx={{
                width: "8px",
                height: "8px",
                bgcolor: "#E4002B",
                borderRadius: "50%",
                mr: 0.5,
              }}
            />
            <Typography
              className="dubai-regular"
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "100%",
              }}
            >
              Total Training
            </Typography>
          </Box>
        </Card>
      )}
    </>
  );
};

export default TotalTrainingAndAttendanceRate;
