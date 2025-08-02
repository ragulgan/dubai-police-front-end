import { Box, Grid, Grow } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import { getAge } from "@/utils/datetime";
import StaffProfileCard from "./StaffProfileCard";

// Define the props for the StaffCardView component
interface StaffCardViewProps {
  data: any; // Array of Profile objects
  isEdit: any; // Function for editing a profile
  isLoading: boolean; // Loading state
  label?: any;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
}

const StaffCardView: React.FC<StaffCardViewProps> = ({
  data,
  isEdit,
  label,
}) => {
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");

  return (
    <Box p={{ xs: 2 }} pt={0}>
      <Grid container spacing={2}>
        {data &&
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
                  <StaffProfileCard
                    profileImage={profile.profileImage}
                    rank={profile.rank}
                    name={profile.firstName}
                    personalEmail={profile.personalEmail}
                    roleValue={profile.roleValue}
                    roleShortText={profile.roleShortText}
                    otherStaff={profile.otherStaff}
                    contractStart={profile.contractStartDate}
                    contractEnd={profile.contractEndDate}
                    onViewClick={() => {
                      router.push(
                        `/teams/${getCurrentSport}/staffs/view/` +
                          profile.staffID
                      );
                    }}
                    onEditClick={() => isEdit(profile.staffID)}
                    label={label}
                  />
                </Grid>
              </Grow>
            );
          })}
      </Grid>
    </Box>
  );
};

export default StaffCardView;
