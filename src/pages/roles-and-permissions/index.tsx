// New feature branch
import { useEffect, useState } from "react";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import {
  Box,
  CssBaseline,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Switch,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoleList } from "@/redux/slices/rolesAndPermissions/userRoleSlice";
import { getUserAccessByRoleList } from "@/redux/slices/rolesAndPermissions/userAccessByRoleSlice";
import AppAlert from "@/components/alert/AppAlert";
import { updateUserAccessByRoleList } from "@/redux/slices/rolesAndPermissions/updateUserAccessByRoleSlice";
import RolesAndPermissionListSkeleton from "@/components/skeleton/RolesAndpermissionListSkeletion";
import RolesAndPermissionViewSkeleton from "@/components/skeleton/RolesAndPermissionViewSkeleton";
import { useRouter } from "next/router";
import { checkIsAdmin } from "@/utils/acessscheck";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#008755",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#FFF", // Updated to green
        border: "1px solid #008755",
        ...theme.applyStyles("dark", {
          backgroundColor: "#218838", // Darker green for dark mode
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));

const RolesAndPermissionsIndexPage = () => {
  const router = useRouter();
  const userRoleData = useSelector((state: RootState) => state.userRole);
  const [expandedRoleID, setExpandedRoleID] = useState<string | null>(null);
  const userAccessByRoleData = useSelector(
    (state: RootState) => state.userAccessByRole
  );
  const [roleIdToUpdate, setRoleIdToUpdate] = useState();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Settings",
      route: `/roles-and-permissions`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Roles & Permissions",
      route: `/roles-and-permissions`,
      currentPage: true,
      disabled: false,
    },
  ];

  const dispatch: any = useDispatch();

  // Get User Roles
  const getUserRoles = () => {
    const usersPayload: any = {
      moduleName: "Staff",
    };
    dispatch(
      getUserRoleList({ url: "/Sports/GetRoleList", payload: usersPayload })
    );
  };

  const handleAccordionChange = (roleID: any) => {
    setExpandedRoleID((prevRoleID) => {
      const newExpandedRoleID = prevRoleID === roleID ? null : roleID;
      return newExpandedRoleID;
    });
  };

  useEffect(() => {
    if (expandedRoleID !== null) {
      getUserAccessByRoleID(expandedRoleID);
    }
  }, [expandedRoleID]);

  //GetUserAccessByRoleID
  const getUserAccessByRoleID = (row: any) => {
    const usersPayload: any = {
      roleID: row,
    };
    dispatch(
      getUserAccessByRoleList({
        url: "/Sports/GetUserAccessByRoleID",
        payload: usersPayload,
      })
    );
  };

  //UpdateUserAccessByRoleID
  const updateUserAccessByRoleId = (
    module: any,
    row: any,
    currentState: any
  ) => {
    const updatedState = currentState == 1 ? 0 : 1;
    const usersPayload: any = {
      roleID: row?.roleID,
      moduleID: module?.moduleID,
      isAccesssable: updatedState,
    };
    dispatch(
      updateUserAccessByRoleList({
        url: "/Sports/UpdateUserAccessByRoleID",
        payload: usersPayload,
      })
    );
    setRoleIdToUpdate(row?.roleID); // Call the list API here
  };

  const updateUserAccessByRoleData = useSelector(
    (state: any) => state.updateUserAccessByRole
  );

  useEffect(() => {
    if (
      updateUserAccessByRoleData &&
      updateUserAccessByRoleData?.code === 200
    ) {
      getUserAccessByRoleID(roleIdToUpdate);
    }
  }, [updateUserAccessByRoleData]);

  // on page load
  useEffect(() => {
    if (checkIsAdmin()) {
      getUserRoles();
    } else {
      router.push("/");
    }
  }, []);

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const is3Knew = useMediaQuery("(min-width:1780px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const isHT1200 = useMediaQuery("(min-height:1200px)");

  const getPageContentHeight = () => {
    if (is4K) return "74.5vh";
    if (isFullHD) {
      if (isHT1200) return "75.3vh";
      return "70.8vh";
    }
    if (is3K) {
      if (is3Knew) return "69.9vh";
      return "68.4vh";
    }
    if (is2K) {
      if (window.innerHeight >= 826) return "71vh";
      if (window.innerHeight >= 730) return "69.8vh";
      return "68.4vh";
    }
    if (isLaptopL) return "66.2vh";
    if (isLaptop) return "74.3vh";
    if (isTab) return "74.3vh";
    return "60vh";
  };

  return (
    <Box p={1} pl={0} sx={{ height: "87vh" }}>
      <CssBaseline />
      {/* menu section */}
      <SettingsSideMenu activeMenuID={2} />

      {/* main content */}
      <Box
        sx={{
          marginLeft: "213px", // this width make the space for Settings menu
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* breadcrump */}
        <Box paddingTop={1.5} p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        {/* page content */}
        <Box
          mt={1}
          className="bg-white"
          borderRadius={1}
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <Box display={"flex"}>
            <Typography
              sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
              p={2}
              className="table-list-header bukra-semi-bold header-border-right"
            >
              Roles & Permissions
            </Typography>
            <Typography
              p={2}
              sx={{ flexGrow: 2 }}
              className="table-count-header dubai-regular header-border-right"
            >
              {""}
            </Typography>
          </Box>
          {/* end of header and section */}

          {userRoleData && userRoleData.loading ? (
            <RolesAndPermissionListSkeleton />
          ) : null}

          {userRoleData &&
          !userRoleData.loading &&
          userRoleData.code === 500 ? (
            <Box p={3}>
              <AppAlert type="error" message={"Unable to load users."} />
            </Box>
          ) : null}

          {userRoleData &&
          !userRoleData.loading &&
          userRoleData.code === 200 &&
          userRoleData.data &&
          userRoleData.data.length > 0 ? (
            <Box
              sx={{
                paddingX: 2,
                paddingY: 2,
                height: getPageContentHeight(),
                overflow: "scroll",
              }}
            >
              {userRoleData?.data?.map((row: any, index: any) => (
                <Box
                  key={row?.roleID || index}
                  sx={{
                    paddingBottom: "20px",
                  }}
                >
                  <Accordion
                    sx={{
                      border: "1px solid #DEDEDE",
                      boxShadow: "none",
                    }}
                    key={row?.roleID || index}
                    expanded={expandedRoleID === row?.roleID}
                    onChange={() => handleAccordionChange(row?.roleID)}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon
                          sx={{
                            border: "1px solid #008755",
                            color: "#008755",
                            borderRadius: "4px",
                            transform: "rotate(270deg)", // Right when collapsed
                            transition: "transform 0.3s ease-in-out",
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                          {
                            transform: "rotate(90deg)", // Down when expanded
                          },
                        // borderBottom: "1px solid #DEDEDE"
                      }}
                    >
                      <Typography
                        component="span"
                        className="bukra"
                        sx={{
                          fontSize: "18px",
                          fontWeight: 500,
                        }}
                      >
                        {row?.roleName}
                      </Typography>
                    </AccordionSummary>
                    <Box
                      sx={{
                        borderBottom: "1px solid #DEE2ED",
                      }}
                    ></Box>

                    <AccordionDetails sx={{ padding: "0px" }}>
                      {expandedRoleID === row?.roleID && (
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            height: "40vh",
                            overflowY: "auto",
                            marginTop: "0px",
                          }}
                        >
                          {userAccessByRoleData?.loading && (
                            <RolesAndPermissionViewSkeleton />
                          )}
                          {/* <RolesAndPermissionViewSkeleton /> */}
                          {!userAccessByRoleData?.loading &&
                            userAccessByRoleData?.code === 200 &&
                            userAccessByRoleData?.data?.[0]?.modules?.map(
                              (permission: any, idx: number) => (
                                <Grid
                                  item
                                  xs={12}
                                  lg={4}
                                  md={4}
                                  sm={12}
                                  key={permission?.moduleID || idx}
                                  className="expansion-detail"
                                  sx={{
                                    borderRight:
                                      idx % 3 !== 2
                                        ? "1px solid #DEE2ED"
                                        : "none",
                                    "@media (max-width: 768px)": {
                                      borderRight: "none",
                                    },
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                      "@media (max-width: 768px)": {
                                        width: "100%",
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        paddingLeft: "15px",
                                      }}
                                      className="dubai-med"
                                    >
                                      {permission?.moduleName}
                                    </Typography>
                                    <Box sx={{ paddingRight: "20px" }}>
                                      <AntSwitch
                                        checked={permission?.accessable}
                                        onChange={() =>
                                          updateUserAccessByRoleId(
                                            permission,
                                            row,
                                            permission?.accessable
                                          )
                                        }
                                        inputProps={{
                                          "aria-label": "ant design",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </Grid>
                              )
                            )}
                          {!userAccessByRoleData?.loading &&
                            userAccessByRoleData?.code === 200 &&
                            userAccessByRoleData?.data?.[0]?.modules?.length >
                              0 &&
                            userAccessByRoleData?.data?.[0]?.modules?.length %
                              3 ===
                              1 && (
                              <Grid
                                item
                                xs={4}
                                sx={{
                                  borderRight: "1px solid  #DEE2ED", // Force border on missing column 2
                                  paddingBottom: "50px",
                                  "@media (max-width: 768px)": {
                                    borderRight: "none",
                                  },
                                }}
                              />
                            )}
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default RolesAndPermissionsIndexPage;
