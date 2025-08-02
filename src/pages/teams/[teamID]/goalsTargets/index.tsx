// new feature branch
"use client";

import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TeamsTable from "@/components/GoalandTargets/goalsTargets";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import {
  listGoalsTargets,
  clearListState,
} from "@/redux/slices/goalsTargets/goalsTargetsListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Edit from "./[id]/edit";
import { clearEditState } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import { filterBySearchGnT } from "@/utils/helper";
import SeasonMenu from "@/components/SeasonMenu";
import GoalsSlideDialog from "@/components/GoalandTargets/goalsSlide";
import { listSeason } from "@/redux/slices/season/SeasonListSlice";
import moment from "moment";
import { editSeason } from "@/redux/slices/season/SeasonEditSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import { clearUpdateState } from "@/redux/slices/season/SeasonUpdateSlice";
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getYearOfDate } from "@/utils/datetime";
import LandingPageCard from "@/components/GoalandTargets/LandingPageCard";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const { teamID, currentSeasonID } = router.query;
  const seasonSelectID = Number(currentSeasonID);
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sport",
      route: `/teams/${teamID}/goalsTargets`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Goals & Targets",
      route: `/teams/${teamID}/goalsTargets`,
      currentPage: true,
      disabled: false,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [goalModule, setGoalModule] = useState("long-term");
  const [isEditData, setisEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [seasonAnchorEl, setSeasonAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectSeason, setSelectSeason] = useState<any | null>(null);
  const [seasonID, setSeasonID] = useState<any | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [snackbarValue, setSnackbarValue] = useState<any>();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "72vh";
    if (isFullHD) return "73vh";
    if (is3K) return "72vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "72vh";
    if (isLaptop) return "72vh";
    if (isTab) return "68vh";
    return "72vh";
  };

  const storedFilters = localStorage.getItem("goals&targetsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const dispatch: AppDispatch = useDispatch();
  const GoalsTargetslist = useSelector(
    (state: RootState) => state.listGoalsTargets
  );
  const Seasonlist = useSelector((state: RootState) => state.listSeason);
  const editSeasonlist = useSelector((state: RootState) => state.editSeason);
  const editSeasonDataLoading = editSeasonlist && editSeasonlist?.loading;

  let editSeasonData = null;

  if (seasonID || seasonSelectID) {
    let indexSeasonID = null;
    if (seasonID) {
      indexSeasonID = seasonID;
    } else {
      indexSeasonID = seasonSelectID;
    }
    if (
      editSeasonlist &&
      editSeasonlist?.data &&
      editSeasonlist &&
      editSeasonlist?.data.length
    ) {
      const index = editSeasonlist?.data.findIndex(
        (item: any) => item.seasonID == indexSeasonID
      );

      if (index > -1) {
        editSeasonData =
          editSeasonlist && editSeasonlist?.data && editSeasonlist.data[index];
      } else {
        editSeasonData =
          editSeasonlist && editSeasonlist?.data && editSeasonlist.data[0];
      }
    }
  } else {
    editSeasonData =
      editSeasonlist && editSeasonlist?.data && editSeasonlist.data[0];
  }

  const UpdateSeasonlist: any = useSelector(
    (state: RootState) => state.updateSeason
  );

  const handleClose = () => {
    setIsOpen(false);
    dispatch(clearEditState());
  };

  const handleGoalClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsGoalOpen(false);
  };

  useEffect(() => {
    const payload = {
      sportID: Number(teamID),
      goalsAndTargetsSection: "",
      searchText: searchText !== "" ? searchText : "",
      filteredBy: Array.isArray(filterData) ? filterData.join(",") : "",
      paginationIndex: 0,
      paginationCount: 0,
      seasonID: seasonSelectID,
    };
    if (teamID && seasonSelectID) {
      dispatch(listGoalsTargets({ url: "/GetGoalsAndTargetsList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [filterData, teamID, seasonSelectID]);

  useEffect(() => {
    if (teamID) {
      const payload = {
        sportID: Number(teamID),
      };
      dispatch(listSeason({ url: "/GetSeasonList", payload }));
    }
  }, [teamID]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleSeasonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSeasonAnchorEl(event.currentTarget);
    setSeasonDialogOpen(true);
  };

  const handleCloseSeasonDialog = (season: any) => {
    if (season.seasonID) {
      setSeasonAnchorEl(null);
      setSeasonDialogOpen(false);
      const data = {
        startYear: season?.startDate
          ? getYearOfDate(season?.startDate, "DD/MM/YYYY")
          : "",
        endYear: season?.endDate
          ? getYearOfDate(season?.endDate, "DD/MM/YYYY")
          : "",
        seasonName: season?.seasonName,
      };
      setSelectSeason(data);
      setSeasonID(season?.seasonID);
      if (season?.seasonID) {
        router.push(
          `/teams/${teamID}/goalsTargets?currentSeasonID=${season?.seasonID}`
        );
        const payload: any = { seasonID: season?.seasonID };
        dispatch(editSeason(payload));
      }
    } else {
      setSeasonDialogOpen(false);
    }
  };

  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };

  const handleGoalEdit = (e: any, name: any) => {
    e.stopPropagation();
    setGoalModule(name);
    setIsGoalOpen(true);
    setSnackbarValue(
      name === "Edit Long-term Goals" ? "Long-term" : "Season's Main"
    );
  };

  const handleView = (name: any) => {
    setGoalModule(name);
    setIsGoalOpen(true);
  };

  useEffect(() => {
    let season = null;
    if (seasonID || seasonSelectID) {
      let indexSeasonID = null;
      if (seasonID) {
        indexSeasonID = seasonID;
      } else {
        indexSeasonID = seasonSelectID;
      }
      if (
        Seasonlist &&
        Seasonlist?.data &&
        Seasonlist &&
        Seasonlist?.data.length
      ) {
        const index = Seasonlist?.data.findIndex(
          (item: any) => item.seasonID == indexSeasonID
        );
        if (index > -1) {
          season = Seasonlist && Seasonlist?.data && Seasonlist.data[index];
          router.push(
            `/teams/${teamID}/goalsTargets?currentSeasonID=${season?.seasonID}`
          );
        } else {
          season = Seasonlist?.data?.[0];
          router.push(
            `/teams/${teamID}/goalsTargets?currentSeasonID=${season?.seasonID}`
          );
        }
      }
    } else {
      season = Seasonlist?.data?.[0];
      if (teamID && season?.seasonID) {
        router.push(
          `/teams/${teamID}/goalsTargets?currentSeasonID=${season?.seasonID}`
        );
      }
    }

    const startYear = season?.startDate
      ? moment(season.startDate, "DD/MM/YYYY").year()
      : "";
    const endYear = season?.endDate
      ? moment(season.endDate, "DD/MM/YYYY").year()
      : "";
    const data: any = {
      startYear,
      endYear,
      seasonName: season?.seasonName,
    };
    setSelectSeason(data);
    setSeasonID(season?.seasonID);
    if (seasonSelectID) {
      const payload: any = { seasonID: seasonSelectID };
      dispatch(editSeason(payload));
    }
  }, [Seasonlist, isGoalOpen, seasonSelectID]);

  useEffect(() => {
    if (UpdateSeasonlist && UpdateSeasonlist.code === 200) {
      const payload: any = {
        seasonID: seasonSelectID,
      };
      dispatch(editSeason(payload));
      setShowBanner(true);
      setSnackbarStatus(UpdateSeasonlist.code);
      setIsGoalOpen(false);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    } else if (UpdateSeasonlist && UpdateSeasonlist.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(UpdateSeasonlist.code);
      setIsGoalOpen(false);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [UpdateSeasonlist]);

  const filteredList = filterBySearchGnT(
    GoalsTargetslist.data,
    searchText.trim()
  );

  return (
    <>
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `${snackbarValue} Goals Updated successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
      )}
      <GoalsSlideDialog
        open={isGoalOpen}
        onClose={(event: any, reason: any) => handleGoalClose(event, reason)}
        module={goalModule}
        selectSeason={selectSeason}
        seasonID={seasonSelectID}
        editSeasonData={editSeasonData}
        setGoalModule={setGoalModule}
        setIsGoalOpen={setIsGoalOpen}
      />
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>

      {Seasonlist && Seasonlist.loading ? (
        <Box
          height={getPageContentHeight()}
          p={2}
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} />
        </Box>
      ) : null}

      {Seasonlist && !Seasonlist.loading ? (
        <Grid container mt={1}>
          <Grid item xs={12}>
            <Box className="bg-white" borderRadius={1}>
              <Box display={"flex"}>
                <Typography
                  sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
                  p={2}
                  className="table-list-header bukra-semi-bold header-border-right"
                >
                  Goals & Targets
                </Typography>
                <Box className="header-border-right" sx={{ flexGrow: 2 }} />
                <FilterDialog
                  anchorEl={anchorEl}
                  options={["notStarted", "inprogress", "completed"]}
                  open={filterDialogOpen}
                  onClose={handleCloseFilterDialog}
                  onApply={handleApplyFilters}
                  localStorageKey="goalstargetsSelectedFilters"
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                />
                <Button
                  variant="text"
                  className="dubai-regular text-capitalize header-border-right season-goal-btn"
                  sx={{
                    borderRadius: "0",
                    borderTopRightRadius: "4px",
                    flexGrow: 0,
                    width: "auto",
                    minWidth: 0,
                    px: 2,
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleSeasonClick}
                >
                  {`${selectSeason?.seasonName
                    ? selectSeason?.seasonName
                    : "Add Season"
                    }`}
                </Button>
                <SeasonMenu
                  seasonAnchorEl={seasonAnchorEl}
                  seasonDialogOpen={seasonDialogOpen}
                  handleCloseSeasonDialog={handleCloseSeasonDialog}
                  Seasonlist={Seasonlist?.data}
                />
                {isOpen && isEditData && (
                  <Edit
                    open={isOpen}
                    onClose={handleClose}
                    id={isEditData}
                    module="edit"
                    seasonID={seasonID}
                  />
                )}
              </Box>
              {GoalsTargetslist && GoalsTargetslist.loading ? (
                <Box
                  height={getPageContentHeight()}
                  p={2}
                  display={"grid"}
                  sx={{
                    placeContent: "center",
                    alignContent: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <CircularProgress sx={{ color: "#008755" }} />
                </Box>
              ) : null}

              {GoalsTargetslist &&
                !GoalsTargetslist.loading &&
                Seasonlist &&
                Seasonlist?.data &&
                Seasonlist?.data?.length > 0 ? (
                <Box
                  p={2}
                  sx={{
                    height: getPageContentHeight(),
                    overflowX: "scroll",
                  }}
                >
                  <Grid container columnSpacing={2}>
                    <Grid item xs={6} md={6}>
                      <LandingPageCard
                        titleLabel="Long-term Goals"
                        contentText={editSeasonData?.longTermGoals}
                        loading={editSeasonDataLoading}
                        onViewClick={
                          checkAccess(USER_PERMISSION.GoalsTargetsEdit)
                            ? () => handleView("View Long-term Goals")
                            : () => { }
                        }
                        onEditClick={
                          checkAccess(USER_PERMISSION.GoalsTargetsEdit)
                            ? (e: any) => handleGoalEdit(e, "Edit Long-term Goals")
                            : () => { }
                        }
                      />

                    </Grid>
                    <Grid item xs={6} md={6}>
                      <LandingPageCard
                        titleLabel="Season's Main Goal"
                        contentText={editSeasonData?.seasonsMainGoal}
                        loading={editSeasonDataLoading}
                        onViewClick={
                          checkAccess(USER_PERMISSION.GoalsTargetsEdit)
                            ? () => handleView("View Season's Main Goal")
                            : () => { }
                        }
                        onEditClick={
                          checkAccess(USER_PERMISSION.GoalsTargetsEdit)
                            ? (e: any) => handleGoalEdit(e, "Edit Season's Main Goal")
                            : () => { }
                        }
                      />
                    </Grid>
                  </Grid>
                  <TeamsTable
                    data={filteredList || []}
                    isEdit={handleEditData}
                    teamId={teamID}
                    setPage={setPage}
                    page={page}
                    setRowsPerPage={setRowsPerPage}
                    rowsPerPage={rowsPerPage}
                    GoalsTargetslist={GoalsTargetslist}
                    seasonID={seasonSelectID}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    handleFilterClick={handleFilterClick}
                  />
                </Box>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
