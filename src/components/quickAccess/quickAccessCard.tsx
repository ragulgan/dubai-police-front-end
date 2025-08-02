import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CardBG from "../../../public/QuickAccess/bgQuickAccess.png";
import { useRouter } from "next/router";
import UserCreation from "../UserCreation";

const QuickAccessCard = (props: any) => {
  const { Profile } = props;
  const router = useRouter();
  const { teamID } = router.query;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const AddStaff = () => {
    setDialogOpen(true);
  };

  const closeStaff = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {dialogOpen && (
        <UserCreation
          open={dialogOpen}
          onClose={closeStaff}
          teamID={teamID}
          module={Profile?.name === "Add Staff" ? "staffs" : "athletes"}
        />
      )}
      <Box
        sx={{
          width: "251px",
          height: "158px",
          border: "1px solid #9BE3BF",
          bgcolor: "rgba(155, 227, 191, 0.2)",
          position: "relative",
          textAlign: "center",
          placeContent: "center",
          cursor: "pointer",
          borderRadius: "4px",
          "&:hover .profile-icon": {
            transform: "scale(1.3)",
          },
        }}
        onClick={() => {
          if (
            Profile?.name === "Add Staff" ||
            Profile?.name === "Add Athlete"
          ) {
            AddStaff();
          } else {
            router?.push(`${Profile?.path}`);
          }
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${CardBG.src})`,
            opacity: 0.05,
            zIndex: 1,
          }}
        />
        <Profile.icon
          className="profile-icon"
          style={{
            width: 30,
            height: 30,
            zIndex: 2,
            position: "relative",
            transition: "transform 0.3s ease-in-out",
          }}
        />
        <Typography className="bukra primary-color" sx={{ fontSize: "14px" }}>
          {Profile?.name}
        </Typography>
      </Box>
    </>
  );
};

export default QuickAccessCard;
