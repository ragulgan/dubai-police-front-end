import {
  Box,
  Grid,
  Skeleton,
  useTheme,
  useMediaQuery,
  Alert,
  Grow,
} from "@mui/material";
import React from "react";
import TrainingCampCard from "./TrainingCampCard";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import GridViewSkeleton from "./skeleton/GridViewSkeleton";

// Define the interface for a single profile
interface Profile {
  profileImage: string;
  rank: string;
  name: string;
  personalEmail: string;
  role: string;
  contractStartDate: string;
  contractEndDate: string;
  staffID: string;
}

// Define the props for the TrainingCampCardView component
interface CardViewProps {
  data: any; // Array of Profile objects
  isEdit: any; // Function for editing a profile
  isLoading: boolean; // Loading state
  label?: any;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  timeline?: any;
  teamID?: any;
}

const TrainingCampList: React.FC<CardViewProps> = ({
  data,
  isEdit,
  isLoading,
  label,
  module,
  timeline,
  teamID,
}) => {
  const router = useRouter();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const isMobile = useMediaQuery("(max-width:768px)");

  const getPageContentHeight = () => {
    if (is4K) return "55vh";
    if (isFullHD) return "67vh";
    if (is3K) return "55vh";
    if (is2K) return "59vh";
    if (isLaptopL) return "55vh";
    if (isLaptop) return "55vh";
    if (isTab) return "59vh";
    return "55vh";
  };
  const getCurrentSport = getLocalStorage("sport");

  return (
    <Box
      p={{ xs: 2 }}
      pt={0}
      sx={
        module === "staff"
          ? null
          : {
            overflowY: "scroll",
            height: getPageContentHeight(),
          }
      }
    >
      <Grid container spacing={2} sx={{justifyContent: isMobile ? "center": ""}}>
        {isLoading ? (
          <GridViewSkeleton />
        ) : data && data.length > 0 ? (
          data.map((profile: any, index: any) => {
            return (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 500 + index * 200 } : {})}
                key={index}
              >
                <Grid item key={index}>
                  <TrainingCampCard
                    teamID={teamID}
                    campName={profile.campName}
                    timeline={timeline}
                    campStartDate={profile.campStartDate}
                    campEndDate={profile.campEndDate}
                    campCity={profile.campCity}
                    statusText={profile.statusText || "---"}
                    trainingCampID={profile.trainingCampID}
                    campProfile={profile.profileFilePath}
                    onViewClick={() => {
                      router.push(
                        `/teams/${getCurrentSport}/trainingCamp/view/` +
                        profile.trainingCampID
                      );
                    }}
                    onEditClick={() => isEdit(profile.trainingCampID)}
                    label={label}
                  />
                </Grid>
              </Grow>
            );
          })
        ) : (
          <Box p={2} width={"100%"}>
            <Alert className="dubai-med" severity="info">
              No Training camp created for this sport yet.
            </Alert>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default TrainingCampList;
