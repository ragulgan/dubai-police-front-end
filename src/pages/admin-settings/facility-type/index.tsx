import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { Box, Button, CssBaseline, Grid, InputAdornment, List, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import XlsSVG from "../../../public/XlsSVG.svg";
import EditDeleteListItem from "@/components/settings/EditDeleteListItem";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { isEmpty } from "lodash";
import { handleAdminSetting } from "@/redux/slices/appSplice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";


const categoryList = [
  { id: 1, title: "Elite" },
  { id: 2, title: "Amature" },
  { id: 3, title: "Junior" },
]

const UserManagementIndexPage = () => {
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Settings",
      route: `/`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Admin Settings",
      route: `/admin-settings`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Facility Type",
      route: `/facility-type`,
      currentPage: true,
      disabled: false
    },

  ];

  const [contactType, setContactType] = useState(categoryList);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [lastField, setLastField] = useState("");
  const dispatch: AppDispatch = useDispatch();

  // const [isEdit,setEdit] = useState(false)
  console.log({ contactType, editingId });

  const handleEditClick = (id: number, title: string) => {
    setEditingId(id);
    setUpdatedTitle(title);
  };
  const handleDelete = async (id: number) => {
    setContactType((prev) => prev.filter((item) => item.id !== id))
    const response = await axios.delete(
      `${process.env.API_BASE_URL}/settings/facility_type/${id}`
    );
    if (response.data.responseCode === 200) {
      dispatch(handleAdminSetting(true));
    }
  };

  const handleUpdate = async () => {
    setContactType((prevRoles) =>
      prevRoles.map((role) => (role.id === editingId ? { ...role, name: updatedTitle } : role))
    );
    const response = await axios.put(
      `${process.env.API_BASE_URL}/settings/facility_type/${editingId}`,
      {
        name: updatedTitle,
        isDeleted: 0
      }
    );
    if (response.data.responseCode === 200) {
      dispatch(handleAdminSetting(true));
    }
    setEditingId(null);
  };



  const handleAdd = async () => {
    setContactType((prev: any) => [
      ...prev,
      { id: prev.length + 1, name: lastField },
    ])
    const response = await axios.post(
      `${process.env.API_BASE_URL}/settings/facility_type`,
      {
        name: lastField,
      }
    );
    if (response.data.responseCode === 200) {
      dispatch(handleAdminSetting(true));
    }
    setLastField('');
  }


  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const response = await axios.get(`${process.env.API_BASE_URL}/settings/facility_type`);
        console.log({ response });
        if (response.data.responseCode === 200) {
          setContactType(response.data.data); // Assuming response.data is an array
        }
      } catch (err) {
        // setError('Failed to fetch contract types');
      } finally {
        // setLoading(false);
      }
    };
    fetchContractTypes()

  }, [])



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
          height: "85vh"
        }}>
        {/* breadcrump */}
        <Box paddingTop={1.5} p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        {/* page content */}

        <Box mt={1} className="bg-white" borderRadius={1} sx={{
          flex: 1,
          overflow: "auto"
        }}>
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
                border: "1px solid #E0E0E0", borderRadius: "8px",
                width: "103%",
                paddingX: 2,
                marginLeft: -2



              }}
            >
              <Box py={2} borderBottom={"1px solid #E0E0E0"} minWidth={'103%'}
                marginBottom={2}
                marginLeft={'-17px !important'}
              >
                <Typography className="typography textfield-label bukra"
                  sx={{
                    marginLeft: '18px !important'
                  }}
                >
                  Facility Type
                </Typography>
              </Box>
              <List>
                {!isEmpty(contactType) && contactType.map((role: any) => (

                  <EditDeleteListItem
                    key={role.id}
                    id={role.id}
                    value={role.name}
                    isEditing={editingId === role.id}
                    onEditClick={handleEditClick}
                    onChange={(e: any) => setUpdatedTitle(e.target.value)}
                    onUpdate={handleUpdate}
                    updatedTitle={updatedTitle}
                    onDeleteClick={handleDelete}
                  />
                ))}
              </List>
              {!editingId && <Box sx={{ display: "flex", alignItems: "center", width: "100%", marginBottom: 5 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={lastField}
                  onChange={(e) => setLastField(e.target.value)}
                  placeholder="Add New Options"
                  InputProps={{
                    sx: {
                      fontSize: "16px", // Adjust text size
                      fontWeight: 500, // Adjust font weight
                      color: "#333333", // Adjust text color
                      fontFamily: "Dubai !important", // Apply custom font if needed
                    },
                    endAdornment: (
                      <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            textTransform: "capitalize",
                            borderRadius: "0 8px 8px 0",
                            height: "100%",
                            minWidth: "80px",
                            padding: "8px 1px",
                            marginRight: -1.6,
                          }}
                          onClick={handleAdd}
                          disabled={!lastField.trim()}
                        >
                          <AddIcon />
                        </Button>

                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: '100%',
                    },
                    //  "&:hover fieldset": {
                    //   borderColor: "#D9D9D9 !important",
                    // },
                  }}
                />

              </Box>}
            </Box>

          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default UserManagementIndexPage;