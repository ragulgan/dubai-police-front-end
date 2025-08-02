"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ActivityCalendar from "@/components/calendar/ActivityCalendar";
import AppAddButton from "@/components/buttons/AppAddButton";
import SeasonCreateDialog from "@/components/dialogs/SeasonCreateDialog";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import DropDown from "@/components/Fields/DropDown";
import { useForm } from "react-hook-form";
import SubmitApprovalDialog from "@/components/dialogs/SubmitApprovalDialog";
import FilterDateDialog from "@/components/calendar/dateFilters";
import LeftLabelDropdown from "@/components/Fields/LeftLabelDropdown";

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
      title: "Master Plan",
      route: `/tournaments/activity-calendar`,
      currentPage: true,
      disabled: false,
    },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setfilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [type, setType] = useState("");
  const getPageContentHeight = () => {
    if (is4K) return "71vh";
    if (isFullHD) return "73vh";
    if (is3K) return "71vh";
    if (is2K) return "77vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "71vh";
  };

  const handleCreateClick = () => {
    setOpenDialog(true);
    setType("create");
  };

  const handleCreateItemSelect = (title: any) => {
    router.push(`/tournaments/commander/activity-calendar/${title}`);
    setOpenDialog(false);
  };
  const handleSubmitApproval = (title: any) => {
    setOpenDialog(true);
    setType("approval");
  };
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const yearOptions = [
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];
  const { control, watch, setValue } = useForm({
    defaultValues: {
      classification: "2025",
    },
  });

  const downloadExcel = async () => {};
  function handleOnSubmit(): void {
    //   throw new Error("Function not implemented.");
  }

  return (
    <>
      {type === "create" ? (
        <SeasonCreateDialog
          openDialog={openDialog}
          handleClose={() => {
            setOpenDialog(false);
          }}
          handleMenuSelect={handleCreateItemSelect}
        />
      ) : (
        type === "approval" && (
          <SubmitApprovalDialog
            openDialog={openDialog}
            handleClose={() => {
              setOpenDialog(false);
            }}
            onSubmit={handleOnSubmit}
          />
        )
      )}
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

      <Grid container mt={1}>
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Box className="bg-white" display={"flex"}>
            <Typography
              sx={{ flexGrow: 0 }}
              p={2}
              className="table-list-header bukra header-border-right"
            >
              Master Plan
            </Typography>

            <Typography
              sx={{ flexGrow: 2 }}
              p={2}
              className="table-list-header bukra header-border-right"
            ></Typography>
            <ModuleSearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder={"Activity Name,Location"}
            />
            <ModuleFilterButton
              handleFilterClick={handleFilterClick}
              text={"Filter by date"}
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

          <Box
            className="bg-white"
            display="flex"
            alignItems="center"
            gap={2}
            // sx={{ mt: 1, ml: 2 }}
            padding={1}
          >
            <Box sx={{ minWidth: 200, flexShrink: 0 }}>
              <Grid item xs={12} md={5.75}>
                <LeftLabelDropdown
                  name="classification"
                  control={control} // ✅ required
                  label="Select Year"
                  placeholder="Select Year"
                  options={yearOptions}
                  multiple={false}
                  variant="outlined"
                  minWidth={10}
                  icon={true}
                  required={false}
                  disabled={false}
                />
              </Grid>
            </Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: "8px",
                backgroundColor: "#008755",
                textTransform: "none",
                fontWeight: 500,
                height: "40px",
              }}
              onClick={handleSubmitApproval}
            >
              Submit For Approval
            </Button>

            <Typography sx={{ flexGrow: 2 }} p={2}></Typography>
            <Button
              variant="outlined"
              onClick={downloadExcel}
              className="text-capitalize dubai-med export-button"
              sx={{ p: 1, borderRadius: "43px", height: "44px" }}
              startIcon={<XlsSVG width="26px" height="26px" />}
            >
              {"Export to Excel"}
            </Button>
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            overflow={"scroll"}
            height={getPageContentHeight()}
          >
            <ActivityCalendar />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
