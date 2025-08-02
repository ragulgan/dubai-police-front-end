import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getRaceTrends } from "@/redux/slices/dashboard/getRaceTrendsSlice";
import { isNull } from "lodash";
import { useRouter } from "next/router";
import { getCurrentDateObject } from "@/utils/datetime";

const RaceTrends: React.FC<any> = () => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const cardGraph = useRef<HTMLImageElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const getRaceTrendsData = useSelector(
    (state: RootState) => state.getRaceTrends
  );
  const currentYear = getCurrentDateObject().year();

  const [timeframe, setTimeframe] = useState(
    `${currentYear - 1}-${currentYear}`
  );
  const [year, setYear] = useState<any>("");

  const trendsYear = [
    {
      value: `${currentYear - 1}-${currentYear}`,
      label: `${currentYear - 1} - ${currentYear}`,
    },
    {
      value: `${currentYear}-${currentYear + 1}`,
      label: `${currentYear} - ${currentYear + 1}`,
    },
  ];
  const [innerHeight, setInnerHeight] = useState<any>("");

  const getRaceTrendsList =
    getRaceTrendsData.code === 200 ? getRaceTrendsData?.data[0] : null;
  const xLabels =
    !isNull(getRaceTrendsList) &&
    Array.isArray(getRaceTrendsList?.startYearList)
      ? getRaceTrendsList?.startYearList.map((item: any) => item.month)
      : [];

  const startYearCompetitions =
    !isNull(getRaceTrendsList) &&
    Array.isArray(getRaceTrendsList?.startYearList)
      ? getRaceTrendsList?.startYearList.map((item: any) =>
          Number(item.competitions)
        )
      : [];

  const endYearCompetitions =
    !isNull(getRaceTrendsList) && Array.isArray(getRaceTrendsList?.endYearList)
      ? getRaceTrendsList?.endYearList.map((item: any) =>
          Number(item.competitions)
        )
      : [];

  useEffect(() => {
    if (timeframe) {
      const Year = timeframe.split("-");
      setYear(Year);
    }
  }, [timeframe]);

  const dispatchGetRaceTrends = (Year: any, teamID: any, seasonID: any) => {
    const payload = {
      sportID: teamID ? teamID : 0,

      startYear: Year && Year[0],
      endYear: Year && Year[1],
      seasonID: seasonID ? Number(seasonID) : 0,
    };
    dispatch(getRaceTrends({ url: "/GetRaceTrends", payload: payload }));
  };

  useEffect(() => {
    if (teamID && year && seasonID) {
      dispatchGetRaceTrends(year, teamID, seasonID);
    } else if (year) {
      dispatchGetRaceTrends(year, "", "");
    }
  }, [year, teamID, seasonID]);

  useEffect(() => {
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  return (
    <>
      {getRaceTrendsData && getRaceTrendsData?.loading && (
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
            height: "547px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"450px"}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      {getRaceTrendsData && !getRaceTrendsData?.loading && (
        <Card
          sx={{
            background: "#FFFFFF",
            color: "black",
            borderRadius: 3,
            boxShadow: "none",
            p: 2,
            width: "100%",
          }}
          ref={cardGraph}
        >
          {getRaceTrendsData &&
            getRaceTrendsData?.data &&
            getRaceTrendsData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info" sx={{ mb: 3 }}>
                No race trends list records found for this sport yet.
              </Alert>
            )}
          {getRaceTrendsData &&
            getRaceTrendsData?.data &&
            getRaceTrendsData?.data.length > 0 && (
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    color="#00000"
                    sx={{
                      fontSize: "18px",
                      fontWeight: 500,
                      paddingBottom: "80px",
                    }}
                    className="bukra"
                  >
                    Race Trends
                  </Typography>
                  <Box>
                    <Select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      size="small"
                      sx={{
                        bgcolor: "white",
                        borderRadius: 1,
                        color: "#58585B",
                      }}
                      className="dubai-med"
                    >
                      {trendsYear &&
                        trendsYear?.map((value: any, index: any) => (
                          <MenuItem
                            value={value?.value}
                            className="dubai-med"
                            key={index}
                          >
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <Box
                                sx={{
                                  width: "8px",
                                  height: "8px",
                                  bgcolor: "#E4002B",
                                  borderRadius: "50%",
                                  mr: 1,
                                }}
                              />
                              <Typography className="dubai-regular">
                                {value?.value.split("-")[0]}
                              </Typography>
                              <Typography mx={2} className={"bukra"}>
                                -
                              </Typography>
                              <Box
                                sx={{
                                  width: "8px",
                                  height: "8px",
                                  bgcolor: "#26D07C",
                                  borderRadius: "50%",
                                  mr: 1,
                                }}
                              />
                              <Typography className="dubai-regular">
                                {value?.value.split("-")[1]}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                    </Select>
                  </Box>
                </Box>
                <LineChart
                  sx={{
                    "& .MuiAreaElement-series-Germany": {
                      fill: "url('#lineChartGradient')",
                    },
                    "& .MuiAreaElement-series-India": {
                      fill: "url('#lineChartGradientColor')",
                    },
                  }}
                  grid={{ horizontal: true }}
                  xAxis={[
                    {
                      data: xLabels,
                      scaleType: "point",
                    },
                  ]}
                  yAxis={[
                    {
                      data: [100, 80, 60, 40, 20, 10, 0],
                      valueFormatter: (value) => `${value}`,
                    },
                  ]}
                  series={[
                    {
                      data: startYearCompetitions,
                      valueFormatter: (v, { dataIndex }) => {
                        const competitions =
                          getRaceTrendsList?.startYearList[dataIndex]
                            ?.competitions || "NA";
                        const medals =
                          getRaceTrendsList?.startYearList[dataIndex]?.medals ||
                          "NA";
                        return `Competitions:${competitions}, Medals: ${medals}`;
                      },
                      showMark: false,
                      connectNulls: true,
                      area: true,
                      id: "Germany",
                      color: "#E4002B",
                    },
                    {
                      data: endYearCompetitions,
                      valueFormatter: (v, { dataIndex }) => {
                        const competitions =
                          getRaceTrendsList?.endYearList[dataIndex]
                            ?.competitions || "NA";
                        const medals =
                          getRaceTrendsList?.endYearList[dataIndex]?.medals ||
                          "NA";
                        return `Competitions:${competitions}, Medals: ${medals}`;
                      },
                      showMark: false,
                      connectNulls: true,
                      area: true,
                      id: "India",
                      color: "#26D07C",
                    },
                  ]}
                  height={400}
                  margin={{ top: 10, bottom: 20 }}
                  className="chart-liner-list-dashboard"
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
                        <stop offset="40%" stopColor="rgba(228, 0, 43, 0.2)" />
                        <stop offset="100%" stopColor="rgba(228, 0, 43, 0)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg height="0" width="0">
                    <defs>
                      <linearGradient
                        id="lineChartGradientColor"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="40%" stopColor="rgb(184, 241, 213)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(158, 245, 201, 0)"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </LineChart>
              </CardContent>
            )}
        </Card>
      )}
    </>
  );
};

export default RaceTrends;
