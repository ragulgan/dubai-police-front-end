"use client";
import { Box, Button, Card, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import SubMenuLayout from "../../layout";
import XlsSVG from "../../../../../../public/XlsSVG.svg";
import Image from "next/image";
import CommanderShield from "../../../../../../public/commander/commanderShield.svg";
import Logo from "../../../../../../public/commander/hashOne.png";
import DeptRankingBg from "../../../../../../public/commander/department-ranking-bg-img.png";
import DeptRankingBannerBg from "../../../../../../public/commander/department-ranking-banner-bg.png";
import SectorRankingReportTable from "@/components/commander-shield-report/SectorRankingReportTable";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";

function Page() {
 const router = useRouter();
 const breadcrumbRoutes: BreadcrumbRoutes[] = [
  {
   title: "Dashboard",
   route: `/dashboard`,
   currentPage: false,
   disabled: false,
  },
  {
   title: "Internal Races & Tournaments",
   route: `/tournaments`,
   currentPage: false,
   disabled: false,
  },
  {
   title: "Commander's Shield",
   route: `/tournaments/commander`,
   currentPage: false,
   disabled: false,
  },
  {
   title: "SectorReports",
   route: `/tournaments/commander/reports/sector-ranking`,
   currentPage: true,
   disabled: true,
  },
 ];

 const handleBack = () => router.back();

 const downloadSectorRankingExcel = async () => { };

 return (
  <>
   <Box
    p={1.5}
    mb={1}
    className="bg-white"
    borderRadius={1}
    display={"flex"}
    justifyContent={"space-between"}
    alignItems={"center"}
   >
    <BasicBreadcrumbs routes={breadcrumbRoutes} />
    <CustomButton
     sx={{
      borderRadius: "28px",
      backgroundColor: "rgba(0, 135, 85, 0.1)",
      px: 1.5,
      py: 0,
      fontSize: "18px",
      height: "30px",
     }}
     label="Back"
     variant="outlined"
     size="medium"
     ButtonIcon={BackIcon}
     iconPosition="start"
     onClick={handleBack}
    />
   </Box>
   <Card
    sx={{
     maxWidth: "100%",
     background: "#005844",
     color: "white",
     borderRadius: 2,
     height: "290px",
     position: "relative",
    }}
   >
    <Box
     sx={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: "40%",
      backgroundImage: `url(${DeptRankingBannerBg?.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center left",
      zIndex: 2,
      opacity: 1,
     }}
    />
    <Box
     sx={{
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: "42%",
      backgroundImage: `url(${DeptRankingBg?.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center right"
     }}
    />
    <Box
     sx={{
      position: "absolute",
      filter: "blur(80px)",
      borderRadius: "50%",
      backgroundColor: "#FFE628",
      zIndex: 0,
      height: "287px",
      width: "30%",
      left: 0,
      top: "10%",
     }}
    />
    <Box
     sx={{
      position: "absolute",
      filter: "blur(150px)",
      borderRadius: "50%",
      zIndex: 1,
      height: "216px",
      width: "50%",
      right: 0,
      top: "30%",
     }}
    />
    <Grid container direction="column">
     <Grid item xs={12} sm={6} md={6} p={2} container>
      <Grid item md={4} sx={{
       pt: 3,
       display: "flex",
       justifyContent: "center",
       alignItems: "center",
       position: "relative",
       zIndex: 2,
      }}>
       <Box width={"179px"} height={"207px"}>
        <CommanderShield width={"100%"} height={"100%"} />
       </Box>
      </Grid>
      <Grid item md={8}>
       <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        gap={2}
       >
        <Box>
         <Select
          value="2025"
          variant="outlined"
          sx={{
           bgcolor: "#008755",
           borderRadius: 2,
           color: "white",
           width: "200px",
           height: "39px",
           zIndex: 3,
           '.MuiSelect-icon': {
            color: 'white',
           },
           '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
           },
          }}
          className="dubai-med"
          displayEmpty
         >
          <MenuItem
           value="2025"
           className="dubai-med"
           sx={{
            color: "#008755",
            fontSize: "16px",
            lineHeight: "27.01px",
           }}
          >
           Season 2023 - 2024
          </MenuItem>
         </Select>
        </Box>
       </Box>
       <Grid container spacing={2}>
        <Grid item xs={12} md={3} />
        <Grid item xs={12} md={3} display="flex" justifyContent="center" alignItems="center">
         <Box width="150px" height="150px" paddingTop={"5px"}>
          <Image src={Logo} alt="Logo" width={150} height={130} />
         </Box>
        </Grid>

        <Grid item xs={12} md={6}>
         <Box sx={{ zIndex: 2, position: "relative" }}>
          <Typography className="bukra" sx={{ color: "#F8EB47", fontSize: "16px", fontWeight: 600 }}>
           Sector
          </Typography>
          <Typography className="bukra" sx={{ color: "#F8EB47", fontSize: "38px", fontWeight: 600 }}>
           Winner
          </Typography>
          <Typography className="bukra" sx={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 600 }}>
           Port Affairs
          </Typography>
          <Typography className="bukra" sx={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 500, paddingTop: "15px" }}>
           Shield Point
          </Typography>
          <Typography className="bukra" sx={{ color: "#FFFFFF", fontSize: "25px", fontWeight: 500 }}>
           71.1
          </Typography>
         </Box>
        </Grid>
       </Grid>
      </Grid>
     </Grid>
    </Grid>
   </Card >

   <Box mt={1} className="bg-white" borderRadius={1} height={"35vh"} overflow={"auto"}>
    <Box
     display="flex"
     justifyContent="flex-end"
     p={1}
     pt={4}
     pb={2}
     flexDirection="row"
     alignItems="center"
    >
     <Box display="flex" alignItems="center">
      <Button
       variant="outlined"
       className="text-capitalize dubai-med export-button"
       sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
       startIcon={<XlsSVG width="25px" height="25px" />}
       // disabled={searchText !== "" && selectedView !== "calendarview"}
       onClick={downloadSectorRankingExcel}
      >
       Export to Excel
      </Button>
     </Box>
    </Box>
    <SectorRankingReportTable />
   </Box>
  </>
 );
}
Page.getLayout = (page: React.ReactNode) => (
 <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
