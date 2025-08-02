import React, { useState } from "react";
import {
 Box,
 Card,
 Typography,
 useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import CountAnimation from "../common/CounterAnimation";

interface ReportProps {
 page?: any;
 setPage?: any;
 rowsPerPage?: any;
 setRowsPerPage?: any;
}

const staticSectorReport = [
 { reportName: "Academic Affairs and Training Sector", shieldPoint: 89.9 },
 { reportName: "Sector Affairs", shieldPoint: 76.3 },
 { reportName: "Community Happiness and Logistics Support Sector", shieldPoint: 51.8 },
 { reportName: "Operations Sector", shieldPoint: 47.6 },
 { reportName: "Criminal Investigation Department", shieldPoint: 40.2 },
 { reportName: "Department of Administration", shieldPoint: 35.7 },
 { reportName: "Excellence and Leadership Affairs Sector", shieldPoint: 30.1 },
];

const SectorRankingReportTable: React.FC<ReportProps> = ({ page, setPage, rowsPerPage, setRowsPerPage }) => {
 const isTab = useMediaQuery("(min-width:768px)");
 const isLaptop = useMediaQuery("(min-width:1024px)");
 const isLaptopL = useMediaQuery("(min-width:1440px)");
 const is2K = useMediaQuery("(min-width:1535px)");
 const is3K = useMediaQuery("(min-width:1700px)");
 const isFullHD = useMediaQuery("(min-width:1920px)");
 const is4K = useMediaQuery("(min-width:2560px)");

 const getPageContentHeight = () => {
  if (is4K || isLaptopL || isLaptop || is3K) return "58.5vh";
  if (isFullHD) return "63vh";
  if (is2K || isTab) return "54.5vh";
  return "58.5vh";
 };

 return (
  <>
   <Box
    px={3}
    sx={{
     height: getPageContentHeight(),
     // overflowY: "auto",
     paddingBottom: "20px",
    }}
   >
    <Box sx={{ display: "flex", alignItems: "center" }}>
     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 0 }}>
      {staticSectorReport?.map((data: any, index: number) => (
       <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
         sx={{
          width: 40,
          height: 42,
          borderRadius: "50%",
          border: "2px solid #0087554D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#005844",
          background: " #F5F6F9",
         }}
         className="bukra-semi-bold"
        >
         {index + 1}
        </Box>
        {index !== staticSectorReport.length - 1 && (
         <Box sx={{ width: 2, height: "55px", bgcolor: "#008755" }} />
        )}
       </Box>
      ))}
     </Box>

     <Box flexGrow={2}>
      {staticSectorReport?.map((report: any, index: number) => (
       <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "30px", marginTop: "21px" }}>
        <Box sx={{ width: 40, height: 2, bgcolor: "#008755", marginBottom: "12px", marginTop: "17px" }} />
        <Card
         sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#005844",
          color: "white",
          p: 1.1,
          borderRadius: "8px",
          width: "100%",
         }}
        >
         <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ paddingLeft: '8px' }}>
           <Typography sx={{ fontSize: "15px" }} className="bukra-semi-bold text-capitalize">
            {report?.reportName}
           </Typography>
          </Box>
          <Box
           sx={{
            display: "flex",
            gap: "8px",
            color: "#FFFFFF",
            backgroundColor: "#FFFFFF1A",
            borderRadius: "5px",
            padding: "2px 16px",
            justifyContent: "flex-end",
           }}
          >
           <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "18px" }} className="bukra-semi-bold">
             <CountAnimation value={Number(report?.shieldPoint)} />
            </Typography>
            <Typography sx={{ fontSize: "12px" }} className="dubai-regular">
             Shield Point
            </Typography>
           </Box>
          </Box>
         </Box>
        </Card>
       </Box>
      ))}
     </Box>
    </Box>
   </Box>
  </>
 );
};

export default SectorRankingReportTable;
