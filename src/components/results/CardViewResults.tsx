import { Box, Grid, Skeleton, useMediaQuery, Grow, Alert } from "@mui/material";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import ResultCard from "./ResultCard";

interface CardViewResultsProps {
  data: any;
  isEdit?: any;
  isLoading: boolean;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  sportId?: any;
}

const CardViewResults: React.FC<CardViewResultsProps> = ({
  data,
  isEdit,
  isLoading,
  module,
  sportId,
}) => {
  const currentNav = usePathname();
  const currentPath = currentNav?.split("/")[1];
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (isFullHD) return currentNav === "/latest-results" ? "69vh" : "73vh";
    if (is3K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (is2K) return currentNav === "/latest-results" ? "62vh" : "67vh";
    if (isLaptopL) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isLaptop) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isTab) return currentNav === "/latest-results" ? "66vh" : "72vh";
    return "64vh";
  };

  return (
    <Box
      p={{ xs: 2 }}
      pt={0}
      sx={{
        overflowY: "auto",
        height: getPageContentHeight(),
      }}
    >
      <Grid container spacing={2}>
        {data && data.length > 0 ? (
          // Show results if data is available
          data.map((results: any, index: any) => (
            <Grow
              in={true}
              style={{ transformOrigin: "0 0 0" }}
              {...(true ? { timeout: 500 + index * 200 } : {})}
              key={index}
            >
              <Grid item>
                <ResultCard
                  eventName={results?.eventName}
                  eventLocation={results?.eventLocation}
                  eventDate={results?.eventDate}
                  eventTime={results?.eventTime}
                  comments={results?.comments}
                  homeTeamName={results?.homeTeamName}
                  awayTeamName={results?.awayTeamName}
                  selectWinner={results?.selectWinner}
                  onViewClick={() => {
                    if (currentPath === "latest-results") {
                      router.push(
                        `/latest-results/view/${results.resultID}?sportId=${sportId}`
                      );
                    } else {
                      router.push(
                        `/teams/${getCurrentSport}/results/view/${results.resultID}`
                      );
                    }
                  }}
                  onEditClick={() => isEdit(results.resultID, sportId)}
                  module={module}
                />
              </Grid>
            </Grow>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CardViewResults;
