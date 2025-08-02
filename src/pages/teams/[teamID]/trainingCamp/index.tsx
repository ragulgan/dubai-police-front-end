// new feature branch
"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import CardView from "@/components/TrainingCampList";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import { useRouter } from "next/router";
import { clearEditState } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import SubMenuLayout from "./layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm } from "@/utils/helper";
import SlideFullDrawer from "@/pages/teams/[teamID]/trainingCamp/edit/slideFullDrawer";
import {
  clearGetTraningCampsListState,
  getTraningCampListAPI,
} from "@/redux/slices/trainingCamp/getTrainingCampListSlice";
import TrainingCampsList from "@/components/trainingCamp/trainingCampTable";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import AppAddButton from "@/components/buttons/AppAddButton";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const getChipStyles = (label: string) => ({
    color: timeline === label ? "#EFFAF9" : "#008755",
    background: timeline === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: timeline === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height: "37px",
    border: "1px solid #008755",
    borderRadius: "33px",
    width: "105px",
  });

  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/trainingCamp`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Training Camp",
      route: `/teams/${teamID}/trainingCamp`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const getTraningCampsLists = useSelector((state: any) => {
    return state.getTraningCampsList;
  });
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });

  const label: any = ["Age", "Disciple Practiced"];
  const [timeline, setTimeline] = React.useState<string>("ongoing");
  const [isOpen, setIsOpen] = useState(false);

  const [isEditData, setisEditData] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    dispatch(clearEditState());
    const payload = {
      trainingCampType: timeline,
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 0,
      sportID: Number(teamID),
    };
    dispatch(getTraningCampListAPI({ url: "/GetTrainingCampList", payload }));
  };
  const filteredList = filterBySearchTerm(
    getTraningCampsLists.data,
    searchText,
    ["campName", "campStartDate", "campEndDate", "campCity"]
  );

  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

  const handleChipClick = (label: string) => {
    setTimeline(label); // Set the clicked chip as the selected one
  };
  useEffect(() => {
    if (selectedIcon === "grid" && teamID) {
      const payload = {
        trainingCampType: timeline,
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(getTraningCampListAPI({ url: "/GetTrainingCampList", payload }));
    } else if (teamID) {
      const payload = {
        trainingCampType: timeline,
        searchText: "",
        filteredBy: "",
        paginationIndex: searchText !== "" ? 0 : page,
        paginationCount: searchText !== "" ? 0 : rowsPerPage,
        sportID: Number(teamID),
      };
      dispatch(getTraningCampListAPI({ url: "/GetTrainingCampList", payload }));
    }
    return () => {
      dispatch(clearGetTraningCampsListState());
    };
  }, [teamID, selectedIcon, page, rowsPerPage, timeline]);

  useEffect(() => {
    const payload = {
      trainingCampType: timeline,
      searchText: "",
      filteredBy: "",
      paginationIndex: 1,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(getTraningCampListAPI({ url: "/GetTrainingCampList", payload }));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const downloadAthletesExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportTrainingCamp`,
        {
          sportID: Number(teamID),
          searchText: "",
          filteredBy: timeline,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TrainingCamp.xlsx");
      document.body.appendChild(link);
      link.click();
      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  return (
    <>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            Training Camp
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Camp Name, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.TrainingCampAdd) && (
            <AppAddButton
              label="Create Training Camp"
              onClick={() => router.push(`/teams/${teamID}/trainingCamp/add`)}
            />
          )}
          {isOpen && (
            <SlideFullDrawer
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              module={"trainingCamp"}
              isEditData={isEditData}
            />
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between" // Ensure items are spaced between flex-start and flex-end
          p={1}
          py={2}
          pb={selectedIcon === "grid" ? 0 : 2}
          flexDirection="row"
          alignItems="center"
        >
          {/* Chips at Flex-Start */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Select training camp status">
              <Chip
                className="dubai-med"
                label="Ongoing"
                sx={getChipStyles("ongoing")}
                onClick={() => handleChipClick("ongoing")}
              />
            </Tooltip>
            <Tooltip title="Select training camp status">
              <Chip
                className="dubai-med"
                label="Upcoming"
                sx={getChipStyles("upcoming")}
                onClick={() => handleChipClick("upcoming")}
              />
            </Tooltip>
            <Tooltip title="Select training camp status">
              <Chip
                className="dubai-med"
                label="History"
                sx={getChipStyles("history")}
                onClick={() => handleChipClick("history")}
              />
            </Tooltip>
          </Stack>

          {/* Spacer for CustomIconButtons at Flex-End */}
          <Box display="flex" alignItems="center">
            <Button
              variant="outlined"
              className="text-capitalize dubai-med export-button"
              sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
              startIcon={<XlsSVG width="25px" height="25px" />}
              onClick={downloadAthletesExcel}
            >
              Export to Excel
            </Button>
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

        {getTraningCampsLists && getTraningCampsLists.code !== 500 ? (
          selectedIcon === "list" ? (
            <Box p={2} pt={0}>
              {getTraningCampsLists && (
                <TrainingCampsList
                  data={filteredList || []}
                  isEdit={handleEditData}
                  teamId={teamID}
                  setPage={setPage}
                  page={page}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  TrainingCampslist={getTraningCampsLists}
                  timeline={timeline}
                />
              )}
            </Box>
          ) : (
            <Box>
              <CardView
                data={filteredList || []}
                isEdit={handleEditData}
                isLoading={getTraningCampsLists.loading}
                label={label}
                module="athlete"
                timeline={timeline}
                teamID={teamID}
              />
            </Box>
          )
        ) : getTraningCampsLists && getTraningCampsLists?.data?.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No Training camp created for this sport yet.
          </Alert>
        ) : getTraningCampsLists && getTraningCampsLists?.code === 500 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
