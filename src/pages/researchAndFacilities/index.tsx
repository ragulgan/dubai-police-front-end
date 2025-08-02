// New feature branch
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import AppAddButton from "@/components/buttons/AppAddButton";
import { useRouter } from "next/router";
import FacilitiesTabContent from "@/components/researchAndFacilities/FacilitiesTabContent";
import ResearchTabContent from "@/components/researchAndFacilities/ResearchTabContent";
import { listResearch } from "@/redux/slices/researchFacilities/researchListSlice";
import { useDispatch, useSelector } from "react-redux";
import { listFacilities } from "@/redux/slices/researchFacilities/facilitiesListSlice";
import { debounce } from "lodash";
import PaginationComponent from "@/components/PaginationComponent";
import FilterDialog from "@/components/FilterDialog";
import { isEmpty } from "lodash";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const debounceTime = 500;

const statusMapping: { [key: string]: number } = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Cancelled: 3,
};

const ResearchAndFacilitiesPage = () => {
  const router = useRouter();
  const { module, pageView } = router.query;
  const dispatch: any = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState<any[]>([]);
  const listResearchData = useSelector((state: any) => {
    return state.listResearch;
  });
  const mobile = useMediaQuery("(max-width:768px)");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight = () => {
    if (is4K) return "61vh";
    if (isFullHD) return "67vh";
    if (is3K) return "61vh";
    if (is2K) return "59vh";
    if (isLaptopL) return "61vh";
    if (isLaptop) return "61vh";
    if (isTab) return "57vh";
    if (mobile) return "100vh";
    return "57vh";
  };

  const listFacilitiesData = useSelector((state: any) => {
    return state.listFacilities;
  });

  const [currentTab, setCurrentTab] = React.useState<"research" | "facilities">(
    "research"
  );

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchText, setSearchText] = React.useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Research & Facilities",
      route: `/researchAndFacilities`,
      currentPage: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (module) {
      setCurrentTab(module === "facilities" ? "facilities" : "research");
    }
  }, [module]);

  const handleTabSelect = (value: "research" | "facilities") => {
    if (value === "research") {
      router.push(`/researchAndFacilities?module=${value}`);
    } else {
      router.push(
        `/researchAndFacilities?module=${value}&pageView=${pageView ? pageView : "tableview"
        }`
      );
    }
  };

  const getResearchList = () => {
    const researchListPayload = {
      searchText: searchText,
      filteredBy: "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
    };
    dispatch(
      listResearch({ url: "/GetResearchList", payload: researchListPayload })
    );
  };

  const debounceGetResearchList = debounce(
    () => getResearchList(),
    debounceTime
  );

  const getFacilitiesList = () => {
    const facilitiesListPayload = {
      searchText: searchText,
      filteredBy: !isEmpty(filterData) ? filterData.join(",") : "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
      startDate: "",
      endDate: "",
    };
    dispatch(
      listFacilities({
        url: "/GetFacilitiesList",
        payload: facilitiesListPayload,
      })
    );
  };

  const debounceGetFacilitiesList = debounce(
    () => getFacilitiesList(),
    debounceTime
  );

  useEffect(() => {
    if (currentTab === "research") {
      debounceGetResearchList();
    } else {
      debounceGetFacilitiesList();
    }

    return () => {
      debounceGetResearchList.cancel();
      debounceGetFacilitiesList.cancel();
    };
  }, [isUpdated, page, rowsPerPage, searchText, filterData]);

  useEffect(() => {
    setPage(1);
    setRowsPerPage(currentTab === "research" ? 12 : 10); // 12 items for research grid 10 items for facilities list
    setSearchText("");
  }, [currentTab]);

  const showPagination = () => {
    if (
      currentTab === "research" &&
      listResearchData &&
      !listResearchData.loading &&
      listResearchData.code === 200 &&
      listResearchData.data &&
      listResearchData.totalRecords > rowsPerPage
    )
      return true; // show pagination for research

    if (
      currentTab === "facilities" &&
      pageView === "tableview" &&
      listFacilitiesData &&
      !listFacilitiesData.loading &&
      listFacilitiesData.code === 200 &&
      listFacilitiesData.data &&
      listFacilitiesData.totalRecords > rowsPerPage
    )
      return true; // show pagination for research

    return false;
  };
  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (selectedFilters: any) => {
    const mappedFilters = selectedFilters.map(
      (filter: any) => statusMapping[filter]
    );
    setFilterData(mappedFilters);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const getOverallTotal = () => {
    if (
      currentTab === "research" &&
      listResearchData &&
      !listResearchData.loading &&
      listResearchData.code === 200 &&
      listResearchData.data &&
      listResearchData.data.length > 0
    )
      return listResearchData.totalRecords; // show pagination for research

    if (
      currentTab === "facilities" &&
      listFacilitiesData &&
      !listFacilitiesData.loading &&
      listFacilitiesData.code === 200 &&
      listFacilitiesData.data &&
      listFacilitiesData.data.length > 0
    )
      return listFacilitiesData.totalRecords;

    return 0;
  };

  const handleCreateClicked = () => {
    if (currentTab === "research") {
      router.push(`/researchAndFacilities/create/research`);
    } else {
      router.push(
        `/researchAndFacilities/create/facilities?pageView=${pageView}`
      );
    }
  };

  return (
    <Box p={1}>
      {/* Page breadcrump */}
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>

      {/* Page content */}
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
              fontSize: "16px",
              borderTopLeftRadius: "4px",
            }}
            className="bukra header-border-right text-capitalize"
            onClick={() => handleTabSelect("research")}
            variant={currentTab === "research" ? "contained" : "text"}
          >
            Research
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
            onClick={() => handleTabSelect("facilities")}
            variant={currentTab === "facilities" ? "contained" : "text"}
          >
            Facilities
          </Button>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {`${getOverallTotal()} ${currentTab === "research" ? "Research" : "Facilities"
              }`}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={`Search by ${currentTab === "research" ? "Research title" : "Facilities type"
              } & etc`}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {currentTab === "facilities" ? (
            <>
              <ModuleFilterButton
                handleFilterClick={handleFilterClick}
                text={"Filter facilities by status"}
              />
              <FilterDialog
                anchorEl={anchorEl}
                options={["Approved", "Pending", "Rejected", "Cancelled"]}
                open={filterDialogOpen}
                onClose={handleCloseFilterDialog}
                onApply={handleApplyFilters}
                localStorageKey="goalstargetsSelectedFilters"
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </>
          ) : null}
          {checkAccess(USER_PERMISSION.ResearchFacilitiesAdd) ? (
            <AppAddButton
              sx={{
                px: { xs: "40px", sm: "16px" },
                py: { xs: "40px", sm: "16px" },
              }}
              label={`Create ${currentTab === "research" ? "Research" : "Facilities"
                }`}
              onClick={handleCreateClicked}
            />
          ) : null}
        </Box>

        {/*  Research Tab*/}
        {currentTab === "research" && (
          <ResearchTabContent
            searchText={searchText}
            tabValue={currentTab}
            listResearchData={listResearchData}
            setIsUpdated={setIsUpdated}
            getPageContentHeight={getPageContentHeight}
          />
        )}

        {/*Facilities Tab */}
        {currentTab === "facilities" ? (
          <FacilitiesTabContent
            searchText={searchText}
            tabValue={currentTab}
            listFacilitiesData={listFacilitiesData}
            setIsUpdated={setIsUpdated}
            reloadFacilities={() => {
              getFacilitiesList();
            }}
            getPageContentHeight={getPageContentHeight}
          />
        ) : null}

        {/* pagination section */}
        {showPagination() ? (
          <PaginationComponent
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={(
              event: React.ChangeEvent<{ value: unknown }>
            ) => setRowsPerPage(event.target.value as number)}
            page={page}
            handleChangePage={(event: unknown, newPage: number) =>
              setPage(newPage)
            }
            startIndex={1}
            endIndex={10}
            totalItems={getOverallTotal()}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ResearchAndFacilitiesPage;
