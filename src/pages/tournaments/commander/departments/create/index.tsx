"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../../public/svg/TableView.svg";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import CreateDepartmentForm from "@/components/commander-shield-department/create/AddDepartment";
import SubMenuLayout from "../../layout";

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
      route: `/tournaments/commander`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Departments",
      route: `/competitions/create`,
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
      <Box className="bg-white" borderRadius={1} mt={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0 }}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            Create Department
          </Typography>
        </Box>
        <CreateDepartmentForm />
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
