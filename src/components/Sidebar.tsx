"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Popover,
  Grid,
  Dialog,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Dashboard from "../../public/mainMenu/Default/001.dashboard.svg";
import DashboardGif from "../../public/mainMenu/Animated/01.dashboard.gif";
import Results from "../../public/mainMenu/Default/003.Latest Results.svg";
import ResultsGif from "../../public/mainMenu/Animated/03.Latest-Results.gif";
import Calendar from "../../public/mainMenu/Default/004.competition calendar.svg";
import CalendarGif from "../../public/mainMenu/Animated/04.Competition-calendar.gif";
import Tournment from "../../public/mainMenu/Default/005.Internal Race.svg";
import TournmentGif from "../../public/mainMenu/Animated/05.Internal-Race.gif";
import Program from "../../public/mainMenu/Default/006.Program.svg";
import ProgramGif from "../../public/mainMenu/Animated/06.Program.gif";
import News from "../../public/mainMenu/Default/008.News.svg";
import NewsGif from "../../public/mainMenu/Animated/07.News.gif";
import Teams from "../../public/mainMenu/Default/002.sports.svg";
import TeamsGif from "../../public/mainMenu/Animated/02.Sports.gif";
import Rules from "../../public/mainMenu/Default/007.Rules.svg";
import RulesGif from "../../public/mainMenu/Animated/07.Rules.gif";
import Menu from "../../public/mainMenu/Default/009.Other.svg";
import MenuGif from "../../public/mainMenu/Animated/08.Other.gif";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { handleAdminSetting, handleSubMenu } from "@/redux/slices/appSplice";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import { getLocalStorage, removeLocalStorage } from "@/utils/helper";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import CustomCard from "./SubMenuOpen";
import { getNationalityListAPI } from "@/redux/slices/nationality/getNationalityListSlice";
import GymIcon from "../../public/mainMenu/Default/010.Fitness & Nutrition.svg";
import GymIconGif from "../../public/mainMenu/Animated/09.Fitness-&-Nutrition.gif";
import SuggestionIcon from "../../public/mainMenu/Default/011.Polls.svg";
import SuggestionIconGif from "../../public/mainMenu/Animated/10.Polls.gif";
import SearchIcon from "../../public/mainMenu/Default/012.Research & Facilities.svg";
import SearchIconGif from "../../public/mainMenu/Animated/11.Research & Facilities.gif";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { getContractTypeAPI } from "@/redux/slices/settingSlice/contractTypeSlice/getContractTypeSlice";
import { getRewardsTypeAPI } from "@/redux/slices/settingSlice/rewardsType/getRewardsTypeSlice";
import { getFacilityTypeAPI } from "@/redux/slices/settingSlice/facilityType/getFacilityTypeSlice";

const drawerWidth = 110; // Width based on icon size

interface MenuItem {
  text: string;
  icon: any;
  path: string;
  gif: any;
  visible?: any;
}

const Sidebar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const getSportID = getLocalStorage("sport");
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [indexValue, setIndexValue] = React.useState<any>(false);
  const [open, setOpen] = React.useState(false);
  const isAdminSettingUpdated = useSelector((state: any) => {
    return state.ui.isSettingUpdated;
  });
  useEffect(() => {
    if (pathname !== `/teams/${getSportID}/staffs`) {
      removeLocalStorage("staffSelectedFilters");
    }
  }, [pathname]);

  useEffect(() => {
    const param: any = {
      moduleName: "staff",
    };
    const getSportpayload = {
      searchText: "",
    };
    dispatch(getContractTypeAPI());
    dispatch(getRewardsTypeAPI());
    dispatch(getFacilityTypeAPI());
    dispatch(getSportsListAPI(getSportpayload));
    dispatch(fetchRoles(param));
    dispatch(getNationalityListAPI());
  }, []);

  useEffect(() => {
    if (isAdminSettingUpdated) {
      const getSportpayload = {
        searchText: "",
      };
      const param: any = {
        moduleName: "staff",
      };
      dispatch(getSportsListAPI(getSportpayload));
      dispatch(getContractTypeAPI());
      dispatch(getRewardsTypeAPI());
      dispatch(getFacilityTypeAPI());
      dispatch(fetchRoles(param));
      dispatch(handleAdminSetting(false));
    }
  }, [isAdminSettingUpdated]);

  const handleMenuItem = (event: any, menu: any) => {
    if (menu.text !== "Sports" && menu.text !== "Others") {
      router.push(menu.path);
    }

    if (menu.text === "Sports") {
      dispatch(handleSubMenu(true));
    }

    if (menu.text === "Others") {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      text: "Dashboard",
      icon: Dashboard,
      path: "/dashboard",
      gif: DashboardGif,
      visible: true,
    },
    {
      text: "Sports",
      icon: Teams,
      path: `/teams/${getSportID}/mainPage`,
      gif: TeamsGif,
      visible: true,
    },
    {
      text: "Latest Results",
      icon: Results,
      path: "/latest-results",
      gif: ResultsGif,
      visible: true,
    },
    {
      text: "Competition Calendar",
      icon: Calendar,
      path: "/competition-calendar",
      gif: CalendarGif,
      visible: true,
    },
    {
      text: "Internal Races & Tournaments",
      icon: Tournment,
      // path: "/pageInProgress",
      gif: TournmentGif,
      path: "/tournaments",
      visible: true,
    },
    {
      text: "Programs",
      icon: Program,
      path: "/programs",
      gif: ProgramGif,
      visible: true,
    },
    {
      text: "Rules & Agreements",
      icon: Rules,
      path: "/rules",
      gif: RulesGif,
      visible: true,
    },
    { text: "News", icon: News, path: "/news", gif: NewsGif, visible: true },
    {
      text: "Others",
      icon: Menu,
      path: "/others",
      gif: MenuGif,
      visible: true,
    },
  ];

  const toggleDrawer = (): void => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CustomCard path={"mainPage"} customSelect={"Main Page"} />
      <Drawer
        variant="permanent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.default",
            transition: "width 0.3s",
          },
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem
            // button
            onClick={toggleDrawer}
            sx={{ justifyContent: "center", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                minWidth: "unset",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                color: "#008B30",
                background: "#EDFFFC",
                border: "1px solid #EEEEEE",
                marginBottom: "15px",
                "&:hover": {
                  background: "#21865B",
                  color: "#fff",
                },
              }}
            >
              <MenuIcon />
            </ListItemIcon>
          </ListItem>
          {menuItems
            .filter((item) => !!item.visible)
            .map((item, index) => (
              <ListItem
                key={index}
                onClick={(event) => handleMenuItem(event, item)}
                sx={{
                  justifyContent: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  px: 0.5,
                  borderTop: item.text === "Others" ? "1px solid #D1D1D1" : "0",
                }}
                component="div" // Specify the component prop here
              >
                <ListItemIcon
                  className={
                    pathname === item?.path
                      ? "icon-path"
                      : item?.path?.includes("/teams") &&
                        pathname?.includes("/teams")
                      ? "icon-path"
                      : ""
                  }
                  onMouseEnter={() => {
                    setIsHovered(true);
                    setIndexValue(index);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                  sx={{
                    minWidth: "unset",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "46px",
                    height: "46px",
                    borderRadius: "4px",
                    mt: item.text === "Others" ? 1 : 0,
                    color:
                      pathname === item?.path
                        ? "#fff"
                        : item?.path.includes("/teams") &&
                          pathname?.includes("/teams")
                        ? "#fff"
                        : "#008755",
                    background:
                      pathname === item?.path
                        ? "#008755"
                        : item?.path.includes("/teams") &&
                          pathname?.includes("/teams")
                        ? "#008755"
                        : "rgba(177, 228, 227, 0.20)",
                    border:
                      pathname === item?.path
                        ? "1px solid #21865B"
                        : item?.path?.includes("/teams") &&
                          pathname?.includes("/teams")
                        ? "1px solid #21865B"
                        : "1px solid #fff",
                    "&:hover": {
                      borderColor: "#008755",
                      background:
                        pathname === item?.path
                          ? "#008755"
                          : item?.path.includes("/teams") &&
                            pathname?.includes("/teams")
                          ? "rgba(177, 228, 227, 0.20)"
                          : "rgba(177, 228, 227, 0.20)",
                    },
                  }}
                >
                  {isHovered &&
                  index === indexValue &&
                  pathname !== item?.path ? (
                    <img
                      src={item.gif?.src}
                      alt="Hover GIF"
                      style={{ width: "90%", height: "90%" }}
                      loading="lazy"
                    />
                  ) : (
                    <item.icon width={30} height={30} />
                  )}
                </ListItemIcon>
                <Typography
                  sx={{
                    mt: 1,
                    color: pathname === item.path ? "#008755" : "#58585B",
                    textAlign: "center",
                    "&:hover": {
                      color: "#008755",
                    },
                  }}
                  className={
                    pathname === item.path
                      ? "side-menu-name dubai-bold"
                      : "side-menu-name dubai-med"
                  }
                >
                  {item.text}
                </Typography>
              </ListItem>
            ))}
        </List>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="xs"
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
          PaperProps={{
            sx: {
              position: "fixed",
              bottom: 0,
              left: 100,
              m: 0,
              borderRadius: "4px",
              boxShadow: 3,
              minWidth: "352px",
              height: "330px",
            },
          }}
        >
          <Box sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}>
            <Box
              sx={{
                color: "#000000",
                borderBottom: "1px solid #E6E6E6",
                p: 2,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              More Options
            </Box>
            <Box
              onClick={() => {
                router.push(`/fitness-and-nutrition?module=fitness`);
                handleClose();
              }}
              sx={{
                borderBottom: "1px solid #E6E6E6",
                p: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(177, 228, 227, 0.20)",
                  color: "#008755",
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  mb: 1,
                  "&:hover": {
                    border: "1px solid #008755",
                  },
                }}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setIndexValue("Fitness & Nutrition");
                }}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered && indexValue === "Fitness & Nutrition" ? (
                  <img
                    src={GymIconGif?.src}
                    alt="Hover GIF"
                    style={{ width: "90%", height: "90%" }}
                    loading="lazy"
                  />
                ) : (
                  <GymIcon width="28" height="28" />
                )}
              </Box>
              <Typography
                className="dubai-med"
                sx={{
                  color: "#58585B",
                  fontSize: "14px",
                  lineHeight: "23.63px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                Fitness & Nutrition
              </Typography>
            </Box>

            <Grid container>
              <Grid item xs={6}>
                <Box
                  onClick={() => {
                    router.push(`/suggestions-polls`);
                    handleClose();
                  }}
                  sx={{
                    borderRight: "1px solid #E6E6E6",
                    p: 3,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(177, 228, 227, 0.20)",
                      color: "#008755",
                      width: "56px",
                      height: "56px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": {
                        border: "1px solid #008755",
                      },
                    }}
                    onMouseEnter={() => {
                      setIsHovered(true);
                      setIndexValue("Suggestions & Polls");
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered && indexValue === "Suggestions & Polls" ? (
                      <img
                        src={SuggestionIconGif?.src}
                        alt="Hover GIF"
                        style={{ width: "90%", height: "90%" }}
                        loading="lazy"
                      />
                    ) : (
                      <SuggestionIcon width="28" height="28" />
                    )}
                  </Box>
                  <Typography
                    className="dubai-med"
                    sx={{
                      color: "#58585B",
                      fontSize: "14px",
                      lineHeight: "23.63px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    Suggestions & Polls
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box
                  onClick={() => {
                    router.push(`/researchAndFacilities?module=research`);
                    handleClose();
                  }}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(177, 228, 227, 0.20)",
                      color: "#008755",
                      width: "56px",
                      height: "56px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": {
                        border: "1px solid #008755",
                      },
                    }}
                    onMouseEnter={() => {
                      setIsHovered(true);
                      setIndexValue("Research & Facilities");
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered && indexValue === "Research & Facilities" ? (
                      <img
                        src={SearchIconGif?.src}
                        alt="Hover GIF"
                        style={{ width: "90%", height: "90%" }}
                        loading="lazy"
                      />
                    ) : (
                      <SearchIcon width="28" height="28" />
                    )}
                  </Box>
                  <Typography
                    className="dubai-med"
                    sx={{
                      color: "#58585B",
                      fontSize: "14px",
                      lineHeight: "23.63px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    Research & Facilities
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
