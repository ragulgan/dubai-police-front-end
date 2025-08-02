import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LatestNews from "@/components/news/latestNews";
import FeaturedArticle from "@/components/news/featuredArticle";
import ClubNews from "@/components/news/clubNews";
import News from "@/components/news/news";
import { useDispatch, useSelector } from "react-redux";
import { listNews } from "@/redux/slices/news/NewsListSlice";
import { isEmpty } from "lodash";
import AppAddButton from "@/components/buttons/AppAddButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const dispatch: any = useDispatch();
  const listNewsData = useSelector((state: any) => {
    return state.listNews;
  });

  useEffect(() => {
    if (!isEmpty(searchText)) {
      const handler = setTimeout(() => {
        const payload = {
          searchText: searchText && searchText,

        };
        dispatch(listNews({ url: "/GetNewsFilterByCategory", payload }));
      }, 500);
      return () => clearTimeout(handler);
    } else {
      const payload = {
        searchText: searchText && searchText,

      };
      dispatch(listNews({ url: "/GetNewsFilterByCategory", payload }));
    }
  }, [searchText]);

  return (
    <Box p={1}>
      <Box
        p={1.5}
        className="dubai-med primary-color"
        bgcolor={"#fff"}
        borderRadius={"4px"}
        fontSize={"18px"}
      >
        News
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
            }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            News
          </Typography>
          <Box
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-med header-border-right"
          />
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by News, Title..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.NewsAdd) && (
            <AppAddButton
              label="Create News"
              onClick={() => router.push(`/news/createNews`)}
            />
          )}
        </Box>
        <Box
          className="bg-white"
          borderRadius={1}
          sx={{
            width: "100%",
            height: is3K ? "72vh" : is2K ? "67vh" : "72vh",
            overflow: "scroll",
          }}
          py={3}
          px={3}
        >
          {listNewsData && listNewsData?.loading && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem", width: "20%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ placeItems: "end" }}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem", width: "20%" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: "220px", borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ height: "220px", borderRadius: "8px", mt: 1 }}
                />
              </Grid>
              <Grid item xs={7}>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: "450px", borderRadius: "8px" }}
                />
              </Grid>
              {Array.from({ length: 6 }).map((_, index) => (
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
            </Grid>
          )}
          {(listNewsData &&
            listNewsData?.data &&
            isEmpty(listNewsData?.data)) ||
            (Object.values(listNewsData?.data).every(
              (arr) => Array.isArray(arr) && arr.length === 0
            ) && (
                <Alert className="dubai-med" severity="info">
                  No record(s) found.
                </Alert>
              ))}
          {listNewsData &&
            !listNewsData?.loading &&
            listNewsData &&
            listNewsData?.data &&
            !isEmpty(listNewsData?.data) && (
              <>
                <LatestNews
                  listNewsData={
                    listNewsData &&
                    listNewsData?.data &&
                    listNewsData?.data["Latest News"]
                  }
                />
                <FeaturedArticle
                  listNewsData={
                    listNewsData &&
                    listNewsData?.data &&
                    listNewsData?.data["Featured Article"]
                  }
                />
                <ClubNews
                  listNewsData={
                    listNewsData &&
                    listNewsData?.data &&
                    listNewsData?.data["Club's News"]
                  }
                />
                <News
                  listNewsData={
                    listNewsData &&
                    listNewsData?.data &&
                    listNewsData?.data["News"]
                  }
                />
              </>
            )}
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
