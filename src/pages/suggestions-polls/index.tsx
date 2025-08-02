import {
  Alert,
  Box,
  Button,
  Grid,
  InputBase,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isEqual } from "lodash";
import PaginationComponent from "@/components/PaginationComponent";
import React from "react";
import _ from "lodash";
import SuggestionsAndPollsCardView from "@/components/suggestions-polls/SuggestionsAndPollsCardView";
import { listSuggestionsAndPolls } from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsListSlice";
import FilterDialog from "@/components/FilterDialog";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import FilterListIcon from "../../../public/Icons/Filter.svg";
import { checkAccess } from "@/utils/acessscheck";
import { SESSION, USER_PERMISSION } from "@/utils/constants";
import { getLocalStorage, safeJSONParse } from "@/utils/helper";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";

function Page() {
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Suggestions & Polls",
      route: `/suggestions-polls`,
      currentPage: true,
      disabled: false,
    },
  ];

  const router = useRouter();
  const { module } = router.query;
  const [searchText, setSearchText] = useState("");
  const [tabValue, setTabValue] = useState(module ? module : "suggestions");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const storedFilters = localStorage.getItem("suggestionsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const suggestionStatusMap: Record<string, number> = {
    "Pending": 0,
    "Approved": 1,
    "Rejected": 2,
    "Select All": 3,
    "My Suggestions": 4,
  };

  const pollsStatusMap: Record<string, number> = {
    "Select All": 0,
    "Pending": 1,
    "Voted": 2,
    "Ended": 3,
    "My Polls": 4,
  };

  const statusMap = tabValue === "polls" ? pollsStatusMap : suggestionStatusMap;
  const filterDataNumber: number[] = Array.isArray(filterData) && filterData.length > 0
    ? filterData.map((status) => statusMap[status] ?? 0)
    : [0];

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const mobile = useMediaQuery("(max-width:768px)")
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedData: any = safeJSONParse(tokenData);

  const getPageContentHeight = () => {
    if (is4K) return "69.5vh";
    if (isFullHD) return "73.5vh";
    if (is3K) return "69.5vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "69.5vh";
    if (isLaptop) return "69.5vh";
    if (isTab) return "65.5vh";
    if (mobile) return "100vh";
    return "65.5vh";
  };
  const dispatch: any = useDispatch();
  const suggestionsAndPollsListData = useSelector((state: any) => {
    return state.suggestionsAndPollsList;
  });

  const handleTabSelect = (value: any) => {
    router.push(`/suggestions-polls?module=${value}`);
    setTabValue(value);
    setSearchText("");
    setPage(1);
  };

  useEffect(() => {
    if (module) {
      setTabValue(module);
    }
  }, [module]);

  const handleCreate = () => {
    if (tabValue === "suggestions") {
      router.push(`/suggestions-polls/create`);
    } else {
      router.push(`/suggestions-polls/polls/create`);
    }
  };

  useEffect(() => {
    if (!isEmpty(searchText)) {
      const handler = setTimeout(() => {
        const payload = {
          section: tabValue && tabValue,
          searchText: searchText && searchText,
          filteredBy:
            !isEmpty(filterDataNumber) && filterDataNumber.length !== 3
              ? Array.isArray(filterDataNumber) && filterDataNumber.join(",")
              : "",
          paginationIndex: page && page,
          paginationCount: rowsPerPage,
          sportID: parsedData.sportID
        };
        dispatch(
          listSuggestionsAndPolls({
            url: "/GetPollsAndSuggestionsList",
            payload,
          })
        );
      }, 500);
      return () => clearTimeout(handler);
    } else {
      const payload = {
        section: tabValue && tabValue,
        searchText: searchText && searchText,
        filteredBy:
          !isEmpty(filterDataNumber) && filterDataNumber.length !== 3
            ? Array.isArray(filterDataNumber) && filterDataNumber.join(",")
            : "",
        paginationIndex: page && page,
        paginationCount: rowsPerPage,
        sportID: parsedData.sportID
      };
      dispatch(
        listSuggestionsAndPolls({ url: "/GetPollsAndSuggestionsList", payload })
      );
    }
  }, [searchText, tabValue, page, rowsPerPage, isUpdated, filterData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

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

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  return (
    <Box p={1}>
      <Box
        p={1.5}
        className="dubai-med primary-color"
        bgcolor={"#fff"}
        borderRadius={"4px"}
        fontSize={"18px"}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Button
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              px: 2,
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
              fontSize: { xs: "14px", md: "16px" },
              borderTopLeftRadius: "4px",
            }}
            className="bukra header-border-right text-capitalize"
            onClick={() => handleTabSelect("suggestions")}
            variant={tabValue === "suggestions" ? "contained" : "text"}
          >
            Suggestions
          </Button>
          <Button
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              px: 2,
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
              fontSize: "16px",
            }}
            className="bukra header-border-right text-capitalize"
            onClick={() => handleTabSelect("polls")}
            variant={tabValue === "polls" ? "contained" : "text"}
          >
            Polls
          </Button>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-med header-border-right"
          >
            {!isEmpty(searchText)
              ? suggestionsAndPollsListData &&
              suggestionsAndPollsListData?.data &&
              suggestionsAndPollsListData?.data?.length
              : suggestionsAndPollsListData &&
                suggestionsAndPollsListData?.totalRecords
                ? suggestionsAndPollsListData?.totalRecords
                : suggestionsAndPollsListData?.data?.length}{" "}
            {tabValue === "polls" ? "Polls" : "Suggestions"}
          </Typography>
          <Paper
            className="dubai-regular header-border-right"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              boxShadow: "none",
              flexGrow: 0.5,
              width: "auto",
              minWidth: 0,
              borderRadius: "0",
              px: 2,
            }}
          >
            <SearchIcon
              color="secondary"
              sx={{ width: "24px", height: "24px" }}
            />
            <InputBase
              className="dubai-regular"
              sx={{
                ml: 1,
                flex: 1,
                "& input::placeholder": {
                  color: "#58585B",
                  opacity: 1,
                },
              }}
              placeholder={`Search by ${tabValue === "polls" ? "Polls" : "Suggestions"
                }`}
              inputProps={{ "aria-label": "Search by suggestions " }}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
            />
          </Paper>
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={`Filter by  ${tabValue === "polls"
              ? "Poll Status"
              : "Suggestions Status"}`}
          />
          <FilterDialog
            anchorEl={anchorEl}
            options={
              tabValue === "polls"
                ? ["My Polls", "Pending", "Voted", "Ended"]
                : ["My Suggestions", "Pending", "Approved", "Rejected"]
            }
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            localStorageKey="suggestionsSelectedFilters"
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
          {checkAccess(USER_PERMISSION.SuggestionPollsAdd) && (
            <Button
              variant="contained"
              className="dubai-med text-capitalize"
              sx={{
                flexGrow: 0,
                width: "auto",
                minWidth: 0,
                px: { xs: "40px", sm: 2 },
                borderRadius: "0",
                borderTopRightRadius: "4px",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
                whiteSpace: "nowrap",
              }}
              endIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create {tabValue === "suggestions" ? "Suggestions" : "Polls"}
            </Button>
          )}
        </Box>
        <Box
          className="bg-white"
          borderRadius={1}
          sx={{
            width: "100%",
            height: getPageContentHeight(),
            overflowY: "scroll",
          }}
          p={3}
        >
          <Grid container spacing={2}>
            {suggestionsAndPollsListData &&
              suggestionsAndPollsListData?.loading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={is8K ? 2 : is4K ? 2.4 : is2K ? 3 : 4}
                    key={index}
                    sx={{ borderRadius: "8px" }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      animation="wave"
                    />
                    <Box sx={{ pt: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Grid>
                ))}
              </>
            ) : suggestionsAndPollsListData &&
              suggestionsAndPollsListData?.code === 200 ? (
              isEmpty(suggestionsAndPollsListData?.data) ? (
                <Box width={"100%"}>
                  {!isEmpty(searchText) ? (
                    <Alert className="dubai-med" severity="info">
                      No record(s) found.
                    </Alert>
                  ) : (
                    <Alert className="dubai-med" severity="info">
                      {`No ${tabValue === "suggestions" ? "Suggestions" : "Polls"
                        } record(s) found.`}
                    </Alert>
                  )}
                </Box>
              ) : (
                suggestionsAndPollsListData?.data.map(
                  (item: any, index: any) => (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={is8K ? 2 : is4K ? 2.4 : is2K ? 3 : 4}
                        key={index}
                        sx={{ borderRadius: "8px" }}
                      >
                        <SuggestionsAndPollsCardView
                          tabValue={tabValue}
                          data={item}
                          setIsUpdated={setIsUpdated}
                        />
                      </Grid>
                    </>
                  )
                )
              )
            ) : null}
          </Grid>
          <Box mt={3}>
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={
                !isEmpty(searchText)
                  ? suggestionsAndPollsListData &&
                  suggestionsAndPollsListData?.data &&
                  suggestionsAndPollsListData?.data?.length
                  : endIndex > suggestionsAndPollsListData?.totalRecords
                    ? suggestionsAndPollsListData?.totalRecords
                    : endIndex
              }
              totalItems={
                !isEmpty(searchText)
                  ? suggestionsAndPollsListData &&
                  suggestionsAndPollsListData?.data &&
                  suggestionsAndPollsListData?.data?.length
                  : Number(
                    suggestionsAndPollsListData &&
                    suggestionsAndPollsListData?.totalRecords
                  )
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
