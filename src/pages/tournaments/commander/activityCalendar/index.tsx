"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import FilterDateDialog from "@/components/calendar/dateFilters";
import ActivityCalendar from "@/components/calendar/ActivityCalendar";

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
      title: "Activities",
      route: `/tournaments/commander`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setfilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleCreateClick = () => {
    router.push("/tournaments/commander/activityCalendar/create");
  };

  return (
    <>
      <Box
        p={1.5}
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
          onClick={() => router.back()}
        />
      </Box>
      <Box className="bg-white" borderRadius={1} mt={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0 }}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            Activity Calendar
          </Typography>
          <Typography
            sx={{ flexGrow: 2 }}
            p={2}
            className="table-list-header bukra header-border-right"
          ></Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Activity Name, Location"}
            flexGrow={{ flexGrow: 0 }}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filters"}
          />
          <FilterDateDialog
            anchorEl={anchorEl}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            setFilterData={setFilterData}
            filterData={filterData}
            setfilter={setfilter}
          />
          <AppAddButton label="Create Activity" onClick={handleCreateClick} />
        </Box>
        <ActivityCalendar />
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
