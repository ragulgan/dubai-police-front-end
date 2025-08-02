import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";
import EditIcon from "../../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CalendarGrey from "../../../public/CalendarGrey.svg";
import CustomButton from "../buttons/CustomButton";

const CompetitionCardView = () => {
  const competitionList: any = [{
    trainingCampID: 187,
    sportID: 1,
    sportName: "Cycling",
    competitionName: "test competition",
    competitionStartDate: "28/04/2025",
    competitionEndDate: "30/04/2025",
    competitionCountry: "80",
    competitionCity: "Chennai",
    profileFilePath: "/Uploads/TrainingCamp/187/ProfileImage/proof-rubber.jpg",
    profileFileID: 2188,
    budgetFilePath: "/Uploads/TrainingCamp/187/Budget/Profile imae.png",
    budgetFileID: 2105,
    signatureFilePath: "",
    signatureFileID: 0,
    rejectedReason: "",
    status: 1,
    statusText: "Approved",
    statusType: "Ongoing",
    percentage: "100"
  }]

  return (
    <>
      <Card
        sx={{
          bgcolor: "#fff",
          minHeight: "180px",
          border: `1px solid #00875580`,
          overflow: "auto",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "none",
          width: "350px",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={"/commanderShield/competition.svg"}
            alt="Profile Image"
            style={{
              width: "100%",
              borderRadius: 8,
              paddingTop: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingBottom: "0px"
            }}
          />
          <CardContent className="pb-2" sx={{ p: 1 }}>
            <Box display={"flex"} alignItems={"center"} sx={{
              paddingTop: "0px",
              paddingBottom: "10px"
            }}>
              <Chip
                key={"Internal Tournament"}
                label={"Internal Tournament"}
                sx={{
                  padding: "0px",
                  fontWeight: 500,
                  fontSize: "16px",
                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                  color: "#008755",
                  lineHeight: "16px",
                  height: "27px",
                  ".MuiChip-label": {
                    paddingLeft: "8px"
                  },
                  border: "1px solid #008755",
                  mr: 1,
                  width: "fit-content"
                }}
                className="dubai-med"
              />
              <Chip
                key={"Cycling"}
                label={"Cycling"}
                icon={
                  <img
                    src={"/commanderShield/Cycling.svg"}
                    style={{
                      width: "30px",
                      height: "16px",
                      // objectFit: "cover",
                      paddingTop: "1px",
                      paddingRight: "2px",
                      paddingLeft: "2px"
                      // marginTop: "3px"
                    }}
                    alt={"Cycling"}
                  />
                }
                sx={{
                  padding: "0px",
                  fontWeight: 500,
                  fontSize: "16px",
                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                  color: "#008755",
                  lineHeight: "16px",
                  height: "27px",
                  ".MuiChip-label": {
                    paddingLeft: "8px"
                  },
                  border: "1px solid #008755",
                  mr: 1,
                }}
                className="dubai-med"
              />
            </Box>

            <Tooltip title={competitionList.campName}>
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#000",
                  textAlign: "left",
                  paddingBottom: "5px"
                }}
                className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
              >
                Champions Cup Football Championship
              </Typography>
            </Tooltip>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "18px",
                color: "#58585B",
                textAlign: "left",
              }}
              className="dubai-med"
            >
              A thrilling tournament showcasing top teams competing for football supremacy.
            </Typography>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignContent={"flex-start"}
              mt={1}
              mb={3}
            >
              <CalendarGrey width={"20px"} height={"20px"} />
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#58585B",
                  textAlign: "left",
                  marginRight: "3px",
                  marginLeft: "5px",
                }}
                className="dubai-regular"
              >
                25/11/2024
              </Typography>&nbsp;
              <CalendarGrey width={"20px"} height={"20px"} />
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#58585B",
                  textAlign: "left",
                  marginLeft: "5px",
                }}
                className="dubai-regular"
              >
                25/11/2025
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomButton
                sx={{
                  marginRight: 1,
                  fontSize: "16px",
                  height: "48px",
                }}
                fullWidth={true}
                label="View"
                variant="contained"
                size="large"
                iconPosition="start"
                ButtonIcon={VisibilityIcon}
              // onClick={(e: any) => {
              //   onViewClicked(program?.programID);
              // }}
              />
              <CustomButton
                sx={{
                  marginLeft: 1,
                  fontSize: "16px",
                  height: "48px",
                }}
                fullWidth={true}
                label="Edit"
                variant="outlined"
                size="large"
                iconPosition="start"
                ButtonIcon={EditIcon}
              // onClick={(e: any) => {
              //   onEditClicked(program?.programID);
              // }}
              />
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  )
}

export default CompetitionCardView;