
"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import SubMenuLayout from "../../layout";
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
   title: "Reports",
   route: `/tournaments/commander/reports`,
   currentPage: false,
   disabled: false,
  },
  {
   title: "Department Ranking",
   route: `/tournaments/commander/reports/sector-ranking`,
   currentPage: true,
   disabled: true,
  },
 ];

 return (
  <>
   <Box
    p={1.5}
    className="bg-white"
    borderRadius={1}
    display={"flex"}
    justifyContent={"space-between"}
    alignItems={"center"}
    sx={{ marginBottom: "8px" }}
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
     onClick={() => router.back()}
    />
   </Box>
  </>
 );
}
Page.getLayout = (page: React.ReactNode) => (
 <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
