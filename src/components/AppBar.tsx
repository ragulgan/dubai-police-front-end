"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Logo from "../../public/LogoPng.png"; // Replace with your logo path
import Stack from "@mui/material/Stack";
import StyledMenu from "./Fields/menu"; // Ensure this path is correct
import { Button, Dialog, IconButton, Tooltip } from "@mui/material";
import NotificationBell from "../../public/notificationBell.svg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotifiacationListPage from "./notification/notifiacationListPage";
import { useDispatch, useSelector } from "react-redux";
import { listNotification } from "@/redux/slices/notification/getNotificationSlice";
import { AppDispatch } from "@/redux/store";
import GoogleTranslate from "./GoogleTranslate";
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import CountAnimation from "./common/CounterAnimation";

const HeaderAppBar: React.FC = () => {
  // Model Dialog
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState<any>(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState<number | null>(null);

  const handleClose = () => {
    setOpen(false);
    setShouldAnimate(false);
  };

  const getNotificationList = useSelector((state: any) => {
    return state.getNotificationList;
  });
  const [flagData, setFlagData] = useState<any>("all");

  const payload = {
    flag: flagData,
    searchText: "",
    paginationIndex: 1,
    paginationCount: 10,
  };

  const handleOpen = () => {
    const currentCount = Number(getNotificationList?.totalUnseenRecords || 0);
    if (currentCount !== prevCount) {
      setShouldAnimate(true);
      setPrevCount(currentCount);
    } else {
      setShouldAnimate(false);
    }
    setOpen(true);
    dispatch(listNotification({ url: "/GetNotification", payload }));
  };

  useEffect(() => {
    if (isUpdated) {
      dispatch(listNotification({ url: "/GetNotification", payload }));
      setIsUpdated(false);
    }
  }, [isUpdated, dispatch, flagData]);

  useEffect(() => {
    dispatch(listNotification({ url: "/GetNotification", payload }));
  }, []);

  const CartBadge = styled(Badge)(({ theme }) => ({
    [`& .${badgeClasses.badge}`]: {
      top: -4,
      right: -12,
      backgroundColor: "#d32f2f",
      color: "#fff",
      borderRadius: "12px",
      height: "25px",
      minWidth: "25px",
      padding: "0 6px",
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "20px",
    },
  }));
  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none", // Remove shadow
          borderBottom: "1px solid #ddd", // Add subtle border at the bottom
        }}
      >
        <Toolbar sx={{ height: "64px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            sx={{ width: "100%" }}
            spacing={5}
          >
            <StyledMenu />
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  aria-label="notifications"
                  onClick={handleOpen}
                  sx={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "4px",
                    color: "#008B30",
                    background: "#EFFAF9",
                    border: "1px solid #9BE3BF",
                    "&:hover": {
                      borderColor: "#21865B",
                    },
                    minWidth: "unset",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <CartBadge
                    color="primary"
                    overlap="circular"
                    className="dubai-med"
                    badgeContent={
                      shouldAnimate ? (
                        <CountAnimation
                          value={Number(
                            getNotificationList?.totalUnseenRecords
                          )}
                        />
                      ) : (
                        Number(getNotificationList?.totalUnseenRecords)
                      )
                    }
                  >
                    <NotificationBell width="22" height="22" />
                  </CartBadge>
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Global search">
                <Button
                  color="inherit"
                  aria-label="settings"
                  sx={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "4px",
                    color: "#26D07C",
                    background: "#EFFAF9",
                    border: "1px solid #9BE3BF",
                    "&:hover": {
                      borderColor: "#21865B",
                    },
                    minWidth: "unset",
                  }}
                >
                  <SearchOutlinedIcon width="24" height="24" />
                </Button>
              </Tooltip> */}
            </Stack>
          </Stack>
          <Box sx={{
            paddingTop: 1,
            marginRight: '30px',
            backgroundColor: 'rgb(239 250 249)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GoogleTranslate />
          </Box>
          <Box sx={{ paddingTop: 1 }}>
            <Image src={Logo} alt="Logo" width={130} height={47} />
          </Box>
        </Toolbar>
      </AppBar>
      {open ? (
        <Box sx={{ maxWidth: 420 }}>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            sx={{
              "& .MuiDialog-paper": {
                width: 550, // Set a fixed width for the dialog
                minWidth: 300,
                position: "absolute", // Positioning
                top: "146px", // Adjust the vertical position
                left: "100px", // Adjust the vertical position
                transform: "translateY(-22%)", // Center vertically
              },
            }}
          >
            <NotifiacationListPage
              onClose={handleClose}
              getNotificationList={getNotificationList}
              setIsUpdated={setIsUpdated}
            />
          </Dialog>
        </Box>
      ) : null}
    </>
  );
};

export default HeaderAppBar;
