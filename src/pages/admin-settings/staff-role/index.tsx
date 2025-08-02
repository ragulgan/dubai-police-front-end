import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { Box, CssBaseline, Grid, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import XlsSVG from "../../../public/XlsSVG.svg";
import EditableListItem from "@/components/settings/EditableListItem";
import axios from "axios";
import { isEmpty } from "lodash";
import { handleAdminSetting } from "@/redux/slices/appSplice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const UserManagementIndexPage = () => {
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Settings",
      route: `/`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Admin Settings",
      route: `/admin-settings`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Role",
      route: `/Role`,
      currentPage: true,
      disabled: false,
    },
  ];

  const [roles, setRoles] = useState({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const handleEditClick = (id: number, title: string) => {
    setEditingId(id);
    setUpdatedTitle(title);
  };

  const handleUpdate = async () => {
    // setRoles((prevRoles) =>
    //   prevRoles.map((role:any) => (role.roleId === editingId ? { ...role, roleName: updatedTitle } : role))
    // );
    setRoles((prevRoles) =>
      (prevRoles as any[]).map((role: any) =>
        role.roleId === editingId ? { ...role, roleName: updatedTitle } : role
      )
    );
    const response = await axios.put(
      `${process.env.API_BASE_URL}/settings/role/${editingId}`,
      { roleName: updatedTitle, moduleName: "Staff", isActive: 1 }
    );
    if (response.data.responseCode === 200) {
      console.log("in----------------------------");

      dispatch(handleAdminSetting(true));
    }
    setEditingId(null);
  };

  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_BASE_URL}/settings/roles`
        );
        console.log({ response });
        if (response.data.responseCode === 200) {
          setRoles(response.data.data); // Assuming response.data is an array
        }
      } catch (err) {
        // setError('Failed to fetch contract types');
      } finally {
        // setLoading(false);
      }
    };
    fetchContractTypes();
  }, []);

  console.log({ roles });

  return (
    <Box p={1} pl={0} sx={{ height: "87vh" }}>
      <CssBaseline />
      {/* menu section */}
      <SettingsSideMenu activeMenuID={4} />

      {/* main content */}
      <Box
        sx={{
          marginLeft: "215px", // this width make the space for Settings menu
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "85vh",
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
            flex: 1,
            overflow: "auto",
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems={{ xs: "top", md: "center" }}
            sx={{
              paddingX: "2rem",
              paddingY: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                width: "103%",
                paddingX: 2,
                marginLeft: -2,
              }}
            >
              <Box
                py={2}
                borderBottom={"1px solid #E0E0E0"}
                minWidth={"103%"}
                marginBottom={2}
                marginLeft={"-17px !important"}
              >
                <Typography
                  className="typography textfield-label bukra"
                  sx={{
                    marginLeft: "18px !important",
                  }}
                >
                  Staff Role
                </Typography>
              </Box>
              <List>
                {/* (prevRoles as any[]).map((role: any) =>
        role.roleId === editingId ? { ...role, roleName: updatedTitle } : role
      ) */}
                {!isEmpty(roles)
                  ? (roles as any[]).map((role: any) => (
                      <EditableListItem
                        key={role.roleId}
                        id={role.roleId}
                        value={role.roleName}
                        isEditing={editingId === role.roleId}
                        onEditClick={handleEditClick}
                        onChange={(e: any) => setUpdatedTitle(e.target.value)}
                        onUpdate={handleUpdate}
                        updatedTitle={updatedTitle}
                      />
                    ))
                  : null}
              </List>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagementIndexPage;
