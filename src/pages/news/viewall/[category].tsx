import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Alert,
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Skeleton,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardView from "@/components/news/cardView";
import { useDispatch, useSelector } from "react-redux";
import { listNews } from "@/redux/slices/news/NewsListSlice";
import _, { isEmpty } from "lodash";
import FilterDateDialog from "@/components/calendar/dateFilters";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleFilterButton from "@/components/buttons/ModuleFilterButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ViewAllNews: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "News",
      route: `/news`,
      currentPage: false,
      disabled: false,
    },
    {
      title:
        category === "latestNews"
          ? "Latest News"
          : category === "featuredArticle"
            ? "Featured Article"
            : category === "clubNews"
              ? "Club's News"
              : "News",
      route: `/news/viewall/${category === "latestNews"
        ? "Latest News"
        : category === "featuredArticle"
          ? "Featured Article"
          : category === "clubNews"
            ? "Club's News"
            : "News"
        }`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filter, setfilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [searchText, setSearchText] = useState("");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return "70vh";
    if (isFullHD) return "73vh";
    if (is3K) return "70vh";
    if (is2K) return "66vh";
    if (isLaptopL) return "70vh";
    if (isLaptop) return "70vh";
    if (isTab) return "66vh";
    return "70vh";
  };

  const dispatch: any = useDispatch();
  const listNewsData = useSelector((state: any) => {
    return state.listNews;
  });
  const [categoryValue, setCategoryValue] = useState("");
  const [publish, setPublish] = useState("Published");

  const handleChange = (event: any) => {
    setPublish(event.target.checked ? "Published" : "Not Published");
  };
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  useEffect(() => {
    setCategoryValue(
      category === "latestNews"
        ? "4"
        : category === "featuredArticle"
          ? "3"
          : category === "clubNews"
            ? "2"
            : "1"
    );
  }, [category]);

  useEffect(() => {
    if (!isEmpty(searchText)) {
      const handler = setTimeout(() => {
        const payload = {
          ...filterData,
          searchText: searchText && searchText,
          section: categoryValue && categoryValue,
          paginationIndex: 0,
          paginationCount: 0,

          record: publish && publish,
        };
        dispatch(listNews({ url: "/GetNewsList", payload: payload }));
      }, 500);
      return () => clearTimeout(handler);
    } else if (!isEmpty(categoryValue)) {
      const payload = {
        ...filterData,
        searchText: searchText && searchText,
        section: categoryValue && categoryValue,
        paginationIndex: 0,
        paginationCount: 0,

        record: publish && publish,
      };
      dispatch(listNews({ url: "/GetNewsList", payload: payload }));
      setfilter(false);
    }
  }, [searchText, categoryValue, filter, publish]);

  return (
    <Box p={1}>
      {/* Breadcrump section */}
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
          onClick={() => {
            router.back();
          }}
        />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            {category === "latestNews"
              ? "Latest News"
              : category === "featuredArticle"
                ? "Featured Article"
                : category === "clubNews"
                  ? "Club's News"
                  : "News"}
          </Typography>
          <Box
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography p={2} className="dubai-regular" width={"30%"}>
              {listNewsData && listNewsData.data && listNewsData.data.length}{" "}
              News
            </Typography>
            {
              checkAccess(USER_PERMISSION.NewsAdd) && (
                <Box width={"70%"} sx={{ placeItems: "end" }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={publish === "Published"}
                          onChange={handleChange}
                        />
                      }
                      label="Published"
                      className="dubai-regular"
                    />
                  </FormGroup>
                </Box>
              )
            }
          </Box>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by News, Title..."}
            flexGrow={{ flexGrow: 0.5 }}
          />
          <ModuleFilterButton
            handleFilterClick={handleFilterClick}
            text={"Filter news by date"}
          />
          <FilterDateDialog
            anchorEl={anchorEl}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            setFilterData={setFilterData}
            filterData={filterData}
            setfilter={setfilter}
            module="news"
          />
        </Box>
        <Box
          className="bg-white"
          borderRadius={1}
          sx={{
            width: "100%",
            height: getPageContentHeight(),
            overflowY: "scroll",
          }}
          py={3}
          px={5}
        >
          <Grid container spacing={2} px={5}>
            {listNewsData && listNewsData.loading ? (
              <>
                {Array.from({ length: 15 }).map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
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
            ) : listNewsData &&
              listNewsData.data &&
              listNewsData.data.length > 0 ? (
              listNewsData.data.map((item: any, index: any) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
                  key={index}
                >
                  <CardView
                    title={item?.articleTitle}
                    date={item?.newsDate}
                    paragraph={item?.paragraph}
                    image={item?.filePath}
                    id={item?.newsID}
                  />
                </Grid>
              ))
            ) : (
              <Box width={"100%"} mt={3}>
                <Alert className="dubai-med" severity="info">
                  {`No ${category === "latestNews"
                    ? "Latest News"
                    : category === "featuredArticle"
                      ? "Featured Article"
                      : category === "clubNews"
                        ? "Club's News"
                        : "News"
                    } Records Found`}
                  .
                </Alert>
              </Box>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAllNews;
