"use client";
import { Alert, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SlideDialog from "@/pages/teams/[teamID]/trainingPlans/edit/SlideDialog";
import { useRouter } from "next/router";
import SubMenuLayout from "../layout";
import {
  clearListState,
  viewTrainingPlans,
} from "@/redux/slices/trainingPlans/TrainingPlansListSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm } from "@/utils/helper";
import TrainingPlanTemplateCardView from "../../../../../components/trainingPlans/TrainingPlanTemplateCardView";
import AppAddButton from "@/components/buttons/AppAddButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";
import BreadcrumpWithBack from "@/components/nav/BreadcrumbWithBack";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import BackIcon from "../../../../../../public/backIcon.svg";
import Link from "@mui/material/Link";
import CustomButton from "@/components/buttons/CustomButton";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/trainingPlans`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Training Plans",
      route: `/teams/${teamID}/trainingPlans`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Training Templates",
      route: `/teams/${teamID}/trainingPlans/trainingTemplate`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const gettrainingPlansList = useSelector((state: any) => {
    return state.trainingPlansList;
  });
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (teamID) {
      const payload: any = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(
        viewTrainingPlans({ url: "/GetTrainingPlanDraftList", payload })
      );
    } else if (teamID) {
      const payload: any = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(
        viewTrainingPlans({ url: "/GetTrainingPlanDraftList", payload })
      );
    }
    return () => {
      dispatch(clearListState());
    };
  }, [teamID, page, rowsPerPage]);

  useEffect(() => {
    const payload: any = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 1,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(
        viewTrainingPlans({ url: "/GetTrainingPlanDraftList", payload })
      );
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const filteredList = filterBySearchTerm(
    gettrainingPlansList.data,
    searchText,
    ["trainingPlan", "trainingType", "assignedCoach"]
  );

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />

        <Link href={`/teams/${teamID}/trainingPlans?view=list`}>
          <CustomButton
            sx={{
              borderRadius: "28px",
              backgroundColor: "rgba(0, 135, 85, 0.1)",
              px: 1.5,
              py: 0,
              fontSize: "18px",
              fontWeight: 500,
              height: "30px",
            }}
            label="Back"
            variant="outlined"
            size="medium"
            ButtonIcon={BackIcon}
            iconPosition="start"
          />
        </Link>
      </Box>

      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            p={2}
            className="table-list-header bukra header-border-right"
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
          >
            Training Templates
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-med header-border-right"
          ></Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Template name."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.TrainingPlanAdd) ? (
            <AppAddButton
              label="Create Training Plans"
              onClick={() => router.push(`/teams/${teamID}/trainingPlans/add`)}
            />
          ) : null}
          {isOpen && isEditData && (
            <SlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module={"trainingPlan"}
            />
          )}
        </Box>
        <Box height={{ lg: "67vh", xl: "75vh" }} overflow={"scroll"}>
          {gettrainingPlansList && gettrainingPlansList.code !== 500 ? (
            <Box p={2} py={4}>
              <TrainingPlanTemplateCardView
                data={filteredList || []}
                isEdit={handleEditData}
                teamId={teamID}
                setPage={setPage}
                page={page}
                setRowsPerPage={setRowsPerPage}
                rowsPerPage={rowsPerPage}
                TrainingPlanslist={gettrainingPlansList}
                isLoading={gettrainingPlansList?.loading}
              />
            </Box>
          ) : gettrainingPlansList &&
            gettrainingPlansList?.data?.length === 0 ? (
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          ) : (
            <Box p={3}>
              <Alert className="dubai-med" severity="error">
                Something went wrong
              </Alert>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
