// New Feature branch
"use client";
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
import SubMenuLayout from "./layout";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "../../../../../public/Icons/Filter.svg";
import AppAddButton from "@/components/buttons/AppAddButton";
import RewardsCardView from "@/components/rewards/rewardsCardView";
import React, { useEffect, useState } from "react";
import FilterDateDialog from "@/components/calendar/dateFilters";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { listRewards } from "@/redux/slices/rewards/rewardsListSlice";
import { isEmpty } from "lodash";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import RewardsSkeleton from "@/components/skeleton/RewardsSkeleton";
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
    if (is4K) return "71vh";
    if (isFullHD) return "73vh";
    if (is3K) return "71vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "71vh";
  };
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/rewards`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Rewards",
      route: `/teams/${teamID}/rewards`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [searchText, setSearchText] = useState("");
  const [filter, setfilter] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const rewardsList = useSelector((state: RootState) => state.rewardsList);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  useEffect(() => {
    if ((teamID && isEmpty(searchText)) || isUpdated) {
      const payload = {
        ...filterData,
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(listRewards({ url: "/GetRewardsList", payload: payload }));
      setfilter(false);
      setIsUpdated(false);
    } else {
      const handler = setTimeout(() => {
        const payload = {
          ...filterData,
          searchText: searchText && searchText,
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamID),
        };
        dispatch(listRewards({ url: "/GetRewardsList", payload: payload }));
        setfilter(false);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [teamID, filter, searchText, isUpdated]);

  return (
    <Box
      pl={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Rewards page breadcrumb */}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>

      {/* Rewards page content */}
      <Box
        mt={1}
        className="bg-white"
        borderRadius={1}
        sx={{
          flexGrow: 1,
        }}
      >
        <Box display={"flex"}>
          <Typography
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
          >
            All Rewards
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {`${rewardsList && rewardsList?.data && rewardsList?.data?.length ? rewardsList?.data?.length : 0} rewards`}
          </Typography>
          <Paper
            className="dubai-regular header-border-right"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              boxShadow: "none",
              flexGrow: 0.25,
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
              placeholder="Search by Name, Date, etc..."
              inputProps={{ "aria-label": "Search by Name, Date, etc..." }}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
            />
          </Paper>
          <Button
            variant="text"
            className="dubai-regular text-capitalize header-border-right"
            sx={{
              borderRadius: "0",
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              px: 2,
              fontSize: "16px",
              fontWeight: 400,
            }}
            color="secondary"
            endIcon={<FilterListIcon />}
            onClick={handleFilterClick}
          >
            Filters
          </Button>
          <FilterDateDialog
            anchorEl={anchorEl}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            setFilterData={setFilterData}
            filterData={filterData}
            setfilter={setfilter}
            module="news"
          />
          {checkAccess(USER_PERMISSION.RewardsAdd) ? (
            <AppAddButton
              label="Create Rewards"
              onClick={() => router.push(`/teams/${teamID}/rewards/add`)}
            />
          ) : null}
        </Box>
        <Box
          sx={{
            overflowY: "scroll",
            height: getPageContentHeight(),
          }}
        >
          {/* section for api error */}
          {rewardsList && !rewardsList.loading && rewardsList.code === 500 ? (
            <Box p={3}>
              <Alert className="dubai-med" severity="error">
                Unable to retrieve rewards records.
              </Alert>
            </Box>
          ) : null}

          {/* section for no records found */}
          {rewardsList &&
            !rewardsList.loading &&
            rewardsList.code !== 500 &&
            rewardsList.data.length === 0 ? (
            <Alert className="dubai-med" severity="info">
              No rewards records found for this sport yet.
            </Alert>
          ) : null}

          {/* Grid view loading */}
          {rewardsList && rewardsList?.loading && <RewardsSkeleton />}
          {/* Grid view */}
          {rewardsList &&
            !rewardsList.loading &&
            rewardsList.code !== 500 &&
            rewardsList.data.length > 0 && (
              <RewardsCardView
                rewardsList={rewardsList}
                filterData={filterData}
                teamID={teamID}
                setIsUpdated={setIsUpdated}
              />
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
