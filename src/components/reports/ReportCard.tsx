import React from "react";
import { Box, Button, Grid, Grow, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarGrey from "../../../public/calendarResult.svg";
import Location from "../../../public/Location.svg";
import { useRouter } from "next/router";
import moment from "moment";
import { isEmpty } from "lodash";

interface RaceReportCardProps {
  results: {
    eventName: string;
    eventLocation: string;
    eventDate: string;
    resultID: string;
    beforeRaceStatus: string;
    afterRaceStatus: string;
  
  };
  planning?: {
    race?: {
      raceName?: string;
      city?: string;
      startDate?: string;
    };
  };
  key: number;
  sportId: string;
  currentPath: string;
  getCurrentSport: any;
  submitFinalReport: (status: boolean) => void;
  beforeReport: (status: boolean) => void;
  module?:string
  setSelectedData?:any
  cardIndex: number;
}

const ReportCard: React.FC<RaceReportCardProps> = ({
  results,
  key,
  sportId,
  currentPath,
  getCurrentSport,
  submitFinalReport,
  beforeReport,
  module,
  setSelectedData,
  cardIndex
}) => {
  const router = useRouter();
console.log({results},'============');

const handleSubmitFinalReport = (selectedData:any)=>{
  console.log({selectedData},'selectedDataselectedData');
  
setSelectedData(selectedData)
submitFinalReport(true);
}
const handleBeforeReport = (selectedData:any)=>{
  console.log({selectedData},'selectedDataselectedData');
  
setSelectedData(selectedData)
beforeReport(true);
}

  return (
    <Grow
      in={true}
      style={{ transformOrigin: "0 0 0" }}
      {...(true ? { timeout: 500 + cardIndex * 200 } : {})}
      key={key}
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={key}>
        <Box
          height={"116px"}
          p={2}
          display={"flex"}
          alignItems={"center"}
          sx={{
            border: "1px solid rgba(0, 135, 85, 0.3)",
            cursor: "pointer",
          }}
          borderRadius={"10px"}
        >
          <Box width={"25%"}>
            <Box display={"flex"} alignItems={"center"}>
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#000000",
                  ml: 0.5,
                }}
                className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
              >

                {/* Dubai Super Cup 2024 */}
                    {module !=='training' ? !isEmpty((results as any)?.planning?.race?.raceName) && (results as any)?.planning?.race?.raceName ? (results as any)?.planning?.race?.raceName: '--' 
                  :  !isEmpty((results as any)?.planning?.trainingCamp?.campName) && (results as any)?.planning?.trainingCamp?.campName ? (results as any)?.planning?.trainingCamp?.campName: '--'
                  }
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} mt={1}>
              <Location width={"20px"} height={"20px"} />
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#58585B",
                  ml: 0.5,
                }}
                className="dubai-regular text-capitalize webkit-line-clamp webkit-1"
              >
                {module !=='training' ?  !isEmpty((results as any)?.planning.race) && (results as any).planning?.race.city ? (results as any)?.planning.race.city : '--'
              :
                !isEmpty((results as any)?.planning?.trainingCamp?.city) && (results as any).planning?.trainingCamp?.city ? (results as any)?.planning?.trainingCamp?.city : '--'
              }
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} mt={1}>
              <CalendarGrey width={"20px"} height={"20px"} />
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#58585B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "200px",
                  ml: 0.5,
                }}
                className="dubai-regular text-capitalize"
              >
                {!isEmpty((results as any)?.planning.race) && (results as any).planning.race.startDate !== '' ?  moment((results as any).planning.race.startDate).format("DD-MM-YYYY") : '-'}
              </Typography>
            </Box>
          </Box>
          <Box
            width={"35%"}
            sx={{
              placeItems: "center",
              borderLeft: "1px solid rgba(0, 135, 85, 0.3)",
              borderRight: "1px solid rgba(0, 135, 85, 0.3)",
              padding: "16px",
            }}
            display="flex"
            justifyContent="center"
            gap={5}
          >
     <Box
              sx={{
                height: "56px",
                padding: "7px 14px",
                gap: "0px",
                borderRadius: "6px",
                opacity: 1,
                backgroundColor: "#F8FFFC",
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "center",
                border: '1px solid #008755'
                // borderColor:'#008755'
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#008755",
                  fontFamily:'dubai !important'
                }}
                // className="dubai-bold"
              >
              Before Race Status
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#008755",
                }}
                className="dubai-bold"
              >
              Submitted
              </Typography>
            
            </Box>

            <Box
              sx={{
                height: "56px",
                padding: "7px 14px",
                gap: "0px",
                borderRadius: "6px",
                opacity: 1,
                backgroundColor: "#FFF7F8",
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "center",
                 border: '1px solid #A60A3D',
                 
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#A60A3D",
                  fontFamily:'dubai !important'
                }}
              >
              After Race Status
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#A60A3D",
                }}
                className="dubai-bold"
              >
              Pending
              </Typography>
      
            </Box>
            {/* </Box> */}
          </Box>
          <Box
            width={"25%"}
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
              gap: 1,
              padding: 1,
              marginLeft:4
            }}
          >


            <Box display="flex" alignItems="center" gap={3.5} >
            <Button
            type="submit"
            variant="outlined"
            className="text-capitalize dubai-med"
          
         
            onClick={()=>handleBeforeReport(results)}
            // onClick={()=>beforeReport(true)}
            sx={{ fontSize: "16px", weight: 500,whiteSpace: "nowrap" ,px: 2 }}
          >
            View Planning Report
          </Button>
              <Button
            type="submit"
            variant="contained"
            className="text-capitalize dubai-med"
         
            onClick={()=>handleSubmitFinalReport(results)}
            // onClick={()=>submitFinalReport(true)}
            sx={{ fontSize: "16px", weight: 500,whiteSpace: "nowrap",px: 2,   }}
          >
            Submit Final Report
          </Button>
              {/* <IconButton
                sx={{
                  backgroundColor: "#008755",
                  color: "white",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                  width: "44px",
                  // padding: "4px 8px",
                }}
                onClick={() =>
                  router.push(
                    currentPath === "latest-results"
                      ? `/latest-results/view/${results.resultID}?sportId=${sportId}`
                      : `/teams/${getCurrentSport}/results/view/${results.resultID}`
                  )
                }
                disabled={true}
              >
                <VisibilityIcon />
              </IconButton> */}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grow>
  );
};

const StatusBox: React.FC<{ title: string; status: string; bgColor: string; borderColor: string; textColor: string }> = ({ title, status, bgColor, borderColor, textColor }) => (
  <Box sx={{ height: "56px", padding: "7px 14px", borderRadius: "6px", backgroundColor: bgColor, display: "flex", flexDirection: "column", justifyContent: "center", border: `1px solid ${borderColor}` }}>
    <Typography sx={{ fontSize: "14px", lineHeight: "24px", color: textColor, fontFamily: "dubai !important" }}>{title}</Typography>
    <Typography sx={{ fontSize: "14px", lineHeight: "24px", color: textColor }} className="dubai-bold">{status}</Typography>
  </Box>
);

export default ReportCard;
