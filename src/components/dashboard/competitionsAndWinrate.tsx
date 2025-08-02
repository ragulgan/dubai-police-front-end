import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Box,
  Typography,
  Select,
  MenuItem,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getCompetition } from "@/redux/slices/dashboard/getCompetitionSlice";

const CompetitionsAndWinrate: React.FC = () => {
  const cardGraph = useRef<HTMLImageElement>(null);
  const [timeframe, setTimeframe] = useState("6");
  const [innerWidth, setInnerWidth] = useState<any>("");
  const [innerHeight, setInnerHeight] = useState<any>("");
  const dispatch: AppDispatch = useDispatch();
  const getCompetitionData = useSelector(
    (state: RootState) => state.getCompetition
  );
  const monthOrder: { [key: string]: number } = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const winCount =
    getCompetitionData?.data && Array.isArray(getCompetitionData.data)
      ? Math.max(
          ...getCompetitionData.data.map((item: any) => Number(item.winCount))
        )
      : 0;
  const sortedData = Array.isArray(
    getCompetitionData && getCompetitionData?.data
  )
    ? [...getCompetitionData.data].sort((a: any, b: any) => {
        if (a.year !== b.year) {
          return parseInt(b.year) - parseInt(a.year);
        }
        return monthOrder[b.month] - monthOrder[a.month];
      })
    : [];

  const updatedData: any =
    sortedData &&
    sortedData.length > 0 &&
    sortedData.map((item) => ({
      ...item,
      totalEvent: Number(item.totalEvent),
      winCount: Number(item.winCount),
      resultCount: Number(item.totalEvent) - Number(item.winCount), // New field
    }));

  const dispatchGetCompetition = (timeframe: any) => {
    const payload = {
      sportID: 0,

      monthInterval: timeframe,
    };
    dispatch(
      getCompetition({ url: "/GetCompetitionsAndWins", payload: payload })
    );
  };

  useEffect(() => {
    dispatchGetCompetition(timeframe);
  }, [timeframe]);

  useEffect(() => {
    setInnerWidth(cardGraph.current?.clientWidth);
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  const graphDataSet = updatedData ? updatedData.reverse() : [];
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "49.5vh";
    if (isFullHD) return "64.5vh";
    if (is3K) return "77.3vh";
    if (is2K) return "79.3vh";
    if (isLaptopL) return "89vh";
    if (isLaptop) return "87vh";
    if (isTab) return "87vh";
    return "67vh";
  };

  return (
    <>
      {getCompetitionData && getCompetitionData?.loading && (
        <Card
          sx={{
            p: 2,
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
      {getCompetitionData && !getCompetitionData?.loading && (
        <Card
          sx={{ p: 3, borderRadius: 2, boxShadow: "none", height: "544px" }}
          ref={cardGraph}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: "18px",
              }}
              gap={1}
              className="bukra"
            >
              No of Competitions vs Win rate
            </Typography>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              size="small"
              sx={{ bgcolor: "white", borderRadius: 1, color: "#58585B" }}
              className="dubai-med"
            >
              <MenuItem value="3" className="dubai-med">
                3 - Month
              </MenuItem>
              <MenuItem value="6" className="dubai-med">
                6 - Month
              </MenuItem>
            </Select>
          </Box>
          <BarChart
            borderRadius={10}
            grid={{ horizontal: true }}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={[
              {
                dataKey: "winCount",
                color: "#007A3D",
                stack: "total",
                valueFormatter: (v, { dataIndex }) => {
                  const winRate = graphDataSet[dataIndex]?.winRate || "NA";
                  return `Win Rate: ${winRate}`;
                },
              },
              {
                dataKey: "resultCount",
                color: "#7ED6A4",
                stack: "total",
                valueFormatter: (v, { dataIndex }) => {
                  const totalEvent =
                    graphDataSet[dataIndex]?.totalEvent || "NA";
                  return `Competitions: ${totalEvent}`;
                },
              },
            ]}
            dataset={graphDataSet}
            width={innerWidth && innerWidth - 20}
            height={420}
            className="chart-liner-list-dashboard"
          />
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                bgcolor: "#9BE3BF",
                borderRadius: "50%",
                mr: 0.5,
              }}
            />
            <Typography className="dubai-regular">
              No of competitions
            </Typography>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                bgcolor: "#008755",
                borderRadius: "50%",
                mr: 0.5,
                ml: 2,
              }}
            />
            <Typography className="dubai-regular">Win rate</Typography>
          </Box>
        </Card>
      )}
    </>
  );
};

export default CompetitionsAndWinrate;
