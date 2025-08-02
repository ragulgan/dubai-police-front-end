// new feature branch
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SubMenuLayout from "./layout";
import { Alert, Box, Typography, useMediaQuery } from "@mui/material";
import AppAddButton from "@/components/buttons/AppAddButton";
import BudgetTable from "@/components/budget/budgetTable";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { isEmpty } from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { listBudget } from "@/redux/slices/budget/budgetListSlice";
import FilterDialog from "@/components/FilterDialog";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "58.5vh";
    if (isFullHD) return "63vh";
    if (is3K) return "58.5vh";
    if (is2K) return "54.5vh";
    if (isLaptopL) return "58.5vh";
    if (isLaptop) return "58.5vh";
    if (isTab) return "54.5vh";
    return "58.5vh";
  };
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/budget`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Budget",
      route: `/teams/${teamID}/budget`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const storedFilters = localStorage.getItem("budegetSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const filterDataNumber: any =
    filterData &&
    filterData.length > 0 &&
    filterData.map((status) =>
      status === "Pending" ? 0 : status === "Approved" ? 1 : 2
    );
  const budgetsList = useSelector((state: RootState) => state.budgetsList);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };

  useEffect(() => {
    if ((teamID && isEmpty(searchText)) || isUpdated) {
      const payload = {
        searchText: "",
        filteredBy:
          !isEmpty(filterDataNumber) && filterDataNumber.length !== 3
            ? Array.isArray(filterDataNumber) && filterDataNumber.join(",")
            : "",
        paginationIndex: page && page,
        paginationCount: rowsPerPage && rowsPerPage,
        sportID: Number(teamID),
      };
      dispatch(listBudget({ url: "/GetBudgetList", payload: payload }));
      setIsUpdated(false);
    } else {
      const handler = setTimeout(() => {
        const payload = {
          searchText: searchText && searchText,
          filteredBy:
            !isEmpty(filterDataNumber) && filterDataNumber.length !== 3
              ? Array.isArray(filterDataNumber) && filterDataNumber.join(",")
              : "",
          paginationIndex: page && page,
          paginationCount: rowsPerPage && rowsPerPage,
          sportID: Number(teamID),
        };
        dispatch(listBudget({ url: "/GetBudgetList", payload: payload }));
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [teamID, filterData, searchText, isUpdated, page, rowsPerPage]);

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
            Budget
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {`${budgetsList?.totalRecords} Budgets`}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            placeholder={"Search by Name, Status, etc..."}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter by approval status"}
          />
          <FilterDialog
            anchorEl={anchorEl}
            setRowsPerPage={setRowsPerPage}
            setPage={setPage}
            options={["Approved", "Pending", "Rejected"]}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            localStorageKey="budegetSelectedFilters"
          />
          {checkAccess(USER_PERMISSION.BudgetAdd) ? <AppAddButton
            label="Create Budget"
            onClick={() => router.push(`/teams/${teamID}/budget/add`)}
          /> : null}
        </Box >
        {budgetsList && budgetsList.loading && (
          <Box
            sx={{
              height: getPageContentHeight(),
              backgroundColor: "#FFFFFF",
              overflowY: "scroll",
            }}
          >
            <TableSkeleton />
          </Box>
        )
        }
        {/* section for api error */}
        {
          budgetsList && !budgetsList.loading && budgetsList.code === 500 ? (
            <Box p={3}>
              <Alert className="dubai-med" severity="error">
                Unable to retrieve budgets records.
              </Alert>
            </Box>
          ) : null
        }

        {/* section for no records found */}
        {
          budgetsList &&
            !budgetsList.loading &&
            budgetsList.code !== 500 &&
            budgetsList?.data.length === 0 ? (
            <Alert className="dubai-med" severity="info">
              No budgets records found for this sport yet.
            </Alert>
          ) : null
        }

        {
          budgetsList &&
          !budgetsList.loading &&
          budgetsList.code !== 500 &&
          budgetsList &&
          budgetsList?.data.length > 0 && (
            <Box pt={2} pb={2}>
              <BudgetTable
                budgetsList={budgetsList}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                searchText={searchText}
                teamID={teamID}
              />
            </Box>
          )
        }
      </Box >
    </>
  );
}

Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
