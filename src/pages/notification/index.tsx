// notifications new feature branch
import NotificationViewAllPage from "@/components/notification/notificationViewAllPage";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { listNotification } from "@/redux/slices/notification/getNotificationSlice";
import { AppDispatch } from "@/redux/store";
import {
  Badge,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

const debounceTime = 500;

function Page() {
  const getNotificationList = useSelector((state: any) => {
    return state.getNotificationList;
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [flagData, setFlagData] = useState<any>("all");
  const [isUpdated, setIsUpdated] = useState<any>(false);

  useEffect(() => {
    const payload = {
      flag: flagData,
      searchText: debouncedSearchText !== "" ? debouncedSearchText : "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
    };

    dispatch(listNotification({ url: "/GetNotification", payload }));
  }, [flagData, page, rowsPerPage, debouncedSearchText, isUpdated]);

  const debounceSearch = debounce((value) => {
    setDebouncedSearchText(value);
  }, debounceTime);

  useEffect(() => {
    debounceSearch(searchText);
    return debounceSearch.cancel;
  }, [searchText]);

  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");

  return (
    <>
      <Box p={1}>
        <Box
          p={1.5}
          className="dubai-med primary-color"
          bgcolor={"#fff"}
          borderRadius={"4px"}
          fontSize={"18px"}
        >
          Notifications
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
              className="table-list-header bukra-semi-bold header-border-right-notification"
            >
              Notifications
            </Typography>
            <Typography
              sx={{
                flexGrow: 0,
                width: "auto",
                minWidth: 0,
                paddingTop: "16px",
                paddingBottom: "16x",
                paddingRight: "16px",
              }}
              className="table-list-header bukra-semi-bold header-border-right"
            >
              <IconButton color="inherit">
                <Badge
                  badgeContent={getNotificationList?.totalUnseenRecords}
                  //badgeContent={Array.isArray(getNotificationList?.data) && getNotificationList?.data?.filter((notification: any) => notification.status === 0).length}
                  color="error"
                  className="dubai-med"
                  sx={{
                    "& .MuiBadge-badge": {
                      borderRadius: "4px",
                      width: "26px",
                      height: "20px",
                      px: 1,
                      textAlign: "center",
                    },
                  }}
                ></Badge>
              </IconButton>
            </Typography>
            <Box
              p={2}
              sx={{ flexGrow: 2 }}
              className="table-count-header dubai-med header-border-right"
            />
            <ModuleSearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder={"Search by Notification Name..."}
              flexGrow={{ flexGrow: 0.25 }}
            />
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
            <NotificationViewAllPage
              getNotificationList={getNotificationList}
              setFlagData={setFlagData}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              setIsUpdated={setIsUpdated}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Page;
