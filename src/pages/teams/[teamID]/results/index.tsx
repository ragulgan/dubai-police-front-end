// New feature branch
"use client";
import Box from "@mui/material/Box";
import SubMenuLayout from "./layout";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import { useDispatch, useSelector } from "react-redux";
import CardViewResults from "@/components/results/CardViewResults";
import CardListResults from "@/components/results/CardListResults";
import { AppDispatch } from "@/redux/store";
import {
  clearListState,
  viewResults,
} from "@/redux/slices/results/ResultListSlice";
import React from "react";
import isEmpty from "lodash/isEmpty";
import { filterBySearchTerm } from "@/utils/helper";
import Alert from "@mui/material/Alert";
import SlideResultDialog from "./edit/SlideDialog";
import CustomIconButton from "@/components/buttons/CustomIconButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import AppAddButton from "@/components/buttons/AppAddButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/results`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Results",
      route: `/teams/${teamID}/results`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const getResultsList = useSelector((state: any) => {
    return state.getResultsList;
  });

  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

  useEffect(() => {
    if (selectedIcon === "grid" && teamID) {
      const payload = {
        sportID: Number(teamID),
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
      };
      dispatch(viewResults({ url: "/GetResultsList", payload }));
    } else if (teamID) {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: searchText !== "" ? 0 : page,
        paginationCount: searchText !== "" ? 0 : rowsPerPage,
        sportID: Number(teamID),
      };
      dispatch(viewResults({ url: "/GetResultsList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [teamID, selectedIcon, page, rowsPerPage]);

  const filteredList = filterBySearchTerm(getResultsList.data, searchText, [
    "eventName",
    "awayTeamName",
    "awayTeamValue",
    "categoryRanking",
    "discipline",
    "eventLocation",
    "homeTeamValue",
    "resultType",
    "selectWinner",
  ]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      {isOpen && isEditData && (
        <SlideResultDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"Result"}
          setisEditData={setisEditData}
        />
      )}
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
            Results
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {!isEmpty(getResultsList) && searchText === ""
              ? getResultsList?.data?.length
              : !isEmpty(filteredList) && filteredList.length}{" "}
            total
          </Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ flexGrow: 0, width: "auto", minWidth: 0, px: 2 }}
            flexDirection={"row"}
            alignItems={"center"}
            className="table-list-header bukra header-border-right"
          >
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
              margin={0}
              title={"Single Card view"}
            />
          </Box>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Event Name, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.ResultAdd) ? (
            <AppAddButton
              label="Create Result"
              onClick={() => router.push(`/teams/${teamID}/results/add`)}
            />
          ) : null}
        </Box>
        {getResultsList && getResultsList.code !== 500 ? (
          selectedIcon === "list" ? (
            <Box p={2}>
              {getResultsList && (
                <CardListResults
                  data={filteredList || []}
                  isLoading={getResultsList.loading}
                  isEdit={handleEditData}
                  setPage={setPage}
                  page={page}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                />
              )}
            </Box>
          ) : (
            <>
              <CardViewResults
                data={filteredList || []}
                isLoading={getResultsList.loading}
                isEdit={handleEditData}
              />
            </>
          )
        ) : getResultsList && getResultsList?.data?.length === 0 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Box>
        ) : (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
}

Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
