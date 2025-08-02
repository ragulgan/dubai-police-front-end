import React, { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Tab,
  IconButton,
  Badge,
  Avatar,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle"; // For the green dot
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNotificationUpdateState,
  updateNotification,
} from "@/redux/slices/notification/updateNotificationByIdSlice";

interface NotificationListPageProps {
  onClose?: any;
  getNotificationList: any;
  setIsUpdated?: any;
}

const NotifiacationListPage: React.FC<NotificationListPageProps> = ({
  onClose,
  getNotificationList,
  setIsUpdated,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [value, setValue] = React.useState("1");
  const NotificationUpdateData = useSelector(
    (state: any) => state && state.updateNotificationById
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  dayjs.extend(relativeTime);
  const calculateTimeFromNow = (dateOfCreation: any) => {
    const creationTime = dayjs(dateOfCreation, "MM/DD/YYYY HH:mm:ss");
    return creationTime.fromNow();
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = getNotificationList?.data
      ?.slice()
      ?.sort((a: any, b: any) => a.status - b.status)
      ?.slice(0, 5)
      ?.filter((notification: any) => notification.status === 0)
      ?.map((notification: any) => notification.notificationID);

    const selectedIdsString =
      unreadNotifications.length > 0 ? unreadNotifications.join(",") : "";

    if (selectedIdsString) {
      const payload = {
        flag: "",
        notificationID: selectedIdsString,
      };
      dispatch(updateNotification({ url: "/UpdateNotificationByID", payload }));
    }
  };

  useEffect(() => {
    if (NotificationUpdateData && NotificationUpdateData.code === 200) {
      setIsUpdated(true);
      setTimeout(() => {
        dispatch(clearNotificationUpdateState());
      }, 3000);
    } else if (NotificationUpdateData && NotificationUpdateData.code === 500) {
      setTimeout(() => {
        dispatch(clearNotificationUpdateState());
      }, 3000);
    }
  }, [NotificationUpdateData]);

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        height: "510px",
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", paddingLeft: "15px" }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label="Notifications"
              value="1"
              className="dubai-med"
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 400,
              }}
            />
            <IconButton color="inherit">
              <Badge
                badgeContent={getNotificationList?.totalUnseenRecords}
                // badgeContent={Array.isArray(getNotificationList?.data) && getNotificationList?.data?.filter((notification: any) => notification.status === 0).length}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    borderRadius: "4px",
                    width: "20px",
                    height: "20px",
                  },
                }}
              ></Badge>
            </IconButton>
            <Box
              className="dubai-regular"
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                paddingRight: "18px",
                fontSize: "16px",
                lineHeight: "16px",
                color: "#00205B",
                cursor: "pointer",
              }}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Box>
          </TabList>
        </Box>
        <TabPanel
          value="1"
          sx={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "90%",
          }}
        >
          <Box>
            {getNotificationList?.data?.length ? (
              <>
                {getNotificationList?.data
                  ?.slice()
                  ?.sort((a: any, b: any) => a.status - b.status)
                  .slice(0, 5)
                  .map((notification: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor:
                          notification?.status === 0
                            ? "#F4FFFB"
                            : "transparent",
                        padding: 2,
                        borderRadius: 1,
                        borderBottom: "1px solid #ECECEC",
                      }}
                    >
                      {/* Green Dot */}
                      {notification?.status !== 1 ? (
                        <Box sx={{ paddingBottom: "20px" }}>
                          <CircleIcon
                            sx={{
                              fontSize: 10,
                              color: "#008755",
                              marginRight: 1,
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{ width: "10px", height: "10px", marginRight: 1 }}
                        />
                      )}

                      {/* Avatar */}
                      <Box sx={{ paddingBottom: "20px" }}>
                        <Avatar
                          src="/notifications/userOne.svg"
                          alt="User"
                          sx={{ width: "24px", height: "24px", marginRight: 2 }}
                        />
                      </Box>

                      {/* Notification Text */}
                      <Box sx={{ padding: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#000000",
                          }}
                          className="dubai-regular"
                          dangerouslySetInnerHTML={{
                            __html:
                              notification?.message?.length > 60
                                ? `${notification.message.substring(0, 60)}...`
                                : notification.message ||
                                  "No message available",
                          }}
                        ></Typography>
                        <Typography
                          className="dubai-regular"
                          sx={{
                            fontSize: "14px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                        >
                          {calculateTimeFromNow(notification?.dateOfCreation)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                {Array.from({
                  length: getNotificationList?.data?.length
                    ? Math.max(0, 5 - getNotificationList.data.length)
                    : 5,
                }).map((_, fillerIndex) => (
                  <Box
                    key={`filler-${fillerIndex}`}
                    sx={{ height: "80px", backgroundColor: "transparent" }}
                  />
                ))}
              </>
            ) : (
              <Typography
                sx={{ textAlign: "center", padding: 2, color: "#58585B" }}
                className="dubai-med"
              >
                No new notifications
              </Typography>
            )}
          </Box>

          {/* View All Button */}
          <Box sx={{ paddingX: "20px", paddingBottom: "10px" }}>
            <Button
              className="text-capitalize dubai-med"
              variant="outlined"
              color="primary"
              onClick={() => {
                router.push(`/notification`);
                onClose();
              }}
              autoFocus
              sx={{
                width: "100%",
                border: "1px solid #008755",
                borderRadius: "8px",
              }}
            >
              View All
            </Button>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default NotifiacationListPage;
