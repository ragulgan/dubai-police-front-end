import { Box, Grid, Skeleton, useMediaQuery, Grow } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import { getAge } from "@/utils/datetime";
import AthleteProfileCard from "./AthleteProfileCard";

// Define the props for the AthletesCardView component
interface AthletesCardViewProps {
  data: any; // Array of Profile objects
  isEdit: any; // Function for editing a profile
  isLoading: boolean; // Loading state
  label?: any;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
}

const AthletesCardView: React.FC<AthletesCardViewProps> = ({
  data,
  isEdit,
  isLoading,
  label,
}) => {
  const router = useRouter();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "66vh";
    if (isFullHD) return "66vh";
    if (is3K) return "66vh";
    if (is2K) return "59vh";
    if (isLaptopL) return "66vh";
    if (isLaptop) return "66vh";
    if (isTab) return "62vh";
    return "62vh";
  };
  const getCurrentSport = getLocalStorage("sport");

  return (
    <Box
      p={{ xs: 2 }}
      pt={0}
      sx={{
        overflowY: "scroll",
        height: getPageContentHeight(),
      }}
    >
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item key={index}>
                <Box width={"259px"}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    animation="wave"
                  />
                  <Box sx={{ pt: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
              </Grid>
            ))
          : data &&
            data.length &&
            data.map((profile: any, index: any) => {
              return (
                <Grow
                  in={true}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(true ? { timeout: 500 + index * 200 } : {})}
                  key={index}
                >
                  <Grid item key={index}>
                    <AthleteProfileCard
                      profileImage={profile.profileImage}
                      role={profile.role}
                      name={profile.firstName}
                      personalEmail={profile.personalEmail}
                      onViewClick={() => {
                        router.push(
                          `/teams/${getCurrentSport}/athletes/view/` +
                            profile.athleteID
                        );
                      }}
                      onEditClick={() => isEdit(profile.athleteID)}
                      label={label}
                      dob={
                        profile.dob ? getAge(profile.dob, "DD/MM/YYYY") : "---"
                      }
                      performanceLevel={profile.performanceLevel}
                      disciplePracticed={profile?.disciplinePracticed}
                    />
                  </Grid>
                </Grow>
              );
            })}
      </Grid>
    </Box>
  );
};

export default AthletesCardView;
