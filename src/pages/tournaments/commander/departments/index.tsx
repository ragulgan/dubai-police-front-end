"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import DepartmentCardView from "@/components/commander-shield-department/DepartmentCardView";
import FilterDialog from "@/components/FilterDialog";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";

function Page() {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = useState<string>("All");
  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );
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
      title: "Departments",
      route: `/tournaments/commander/departments`,
      currentPage: true,
      disabled: false,
    },
  ];

  const getChipStyles = (label: string) => ({
    color: selectedChip === label ? "#EFFAF9" : "#008755",
    background: selectedChip === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: selectedChip === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height: "37px",
    border: "1px solid #008755",
    borderRadius: "33px",
    width: "105px",
  });

  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

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
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-bottom"
          >
            {" "}
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
          <ModuleSearchInput
            // searchText={searchText}
            // setSearchText={setSearchText}
            placeholder={"Search by Team Name..."}
          />
          <ModuleFilterButton
            // handleFilterClick={handleFilterClick}
            text={"Filter by performance"}
          />
          {/* <FilterDialog
            anchorEl={anchorEl}
            options={["Beginner", "Intermediate", "Advanced"]}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            localStorageKey="athletesTargetsSelectedFilters"
          /> */}

          <AppAddButton
            label="Create Department"
            onClick={() => router.push(`/tournaments/commander/departments/create`)}
          />
          {/* {isOpen && (
            <SlideFullDrawer
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              module={"trainingCamp"}
              isEditData={isEditData}
            />
          )} */}
        </Box>
        <Box sx={{
          overflowY: "auto",
          height: "66.5vh"
        }}>
          <Box
            display="flex"
            justifyContent="space-between" // Ensure items are spaced between flex-start and flex-end
            paddingX={"20px"}
            pb={selectedIcon === "grid" ? 0 : 2}
            mt={2}
            flexDirection="row"
            alignItems="center"
          >
            {/* Chips at Flex-Start */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="More"
                  sx={getChipStyles("more")}
                // onClick={() => handleChipClick("more")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Unit A"
                  sx={getChipStyles("unitA")}
                // onClick={() => handleChipClick("unitA")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Unit B"
                  sx={getChipStyles("unitB")}
                // onClick={() => handleChipClick("unitB")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Unit C"
                  sx={getChipStyles("unitC")}
                // onClick={() => handleChipClick("unitC")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Unit D"
                  sx={getChipStyles("unitD")}
                // onClick={() => handleChipClick("unitD")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Unit E"
                  sx={getChipStyles("unitE")}
                // onClick={() => handleChipClick("unitE")}
                />
              </Tooltip>
            </Stack>

            {/* Spacer for CustomIconButtons at Flex-End */}
            <Box display="flex" alignItems="center">
              <CustomIconButton
                icon={CardViewIcon}
                isSelected={selectedIcon === "grid"}
                onClick={() => handleIconClick("grid")}
                title={"Card view"}
              />
              <CustomIconButton
                icon={TableViewIcon}
                isSelected={selectedIcon === "list"}
                onClick={() => handleIconClick("list")}
                title={"Table view"}
                margin={1}
              />
            </Box>
          </Box>

          <Box sx={{
            px: 2,
            py: 2
          }}>
            <DepartmentCardView
            // data={filteredList || []}
            //edit={true}
            // isLoading={getTraningCampsLists.loading}
            // label={label}
            // module="athlete"
            // timeline={timeline}
            // teamID={teamID}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
