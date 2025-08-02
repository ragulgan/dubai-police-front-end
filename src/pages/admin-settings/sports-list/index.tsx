import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { Box, CssBaseline, Grid, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import XlsSVG from "../../../public/XlsSVG.svg";
import EditPopUpListItem from "@/components/settings/EditPopUpListItem";
import UpdateSportDialog from "@/components/settings/UpdateSportDialog";
import axios from "axios";
import { isEmpty } from "lodash";


const sportsList = [
  { id: 1, title: "Cycling", category: 'Category A', active: true, order: 1 },
  { id: 2, title: "SWAT", category: 'Category C', active: false, order: 2 },
  { id: 3, title: "Rowing Olympic", category: 'Category B', active: true, order: 3 },
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
      title: "Sports List",
      route: `/sports-list`,
      currentPage: true,
      disabled: false
    },

  ];

  const [contactType, setContactType] = useState(sportsList);
  const [editingId, setEditingId] = useState<any>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [isUpdated, setUpdated] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  // const [isEdit,setEdit] = useState(false)
  console.log({ contactType, editingId });

  const handleEditClick = (role: object) => {
    setEditingId(role);
    console.log({ role });

    setEditOpen(true);
  };


  const handleUpdate = () => {
    setContactType((prevRoles) =>
      prevRoles.map((role) => (role.id === editingId ? { ...role, title: updatedTitle } : role))
    );
    setEditingId(null);
  };





  const fetchSportList = async () => {
    try {
      const response = await axios.get(`${process.env.API_BASE_URL}/settings/sports`);
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
  useEffect(() => {

    fetchSportList()

  }, [])
  console.log({ isUpdated });

  useEffect(() => {
    if (isUpdated) {
      fetchSportList();
      setUpdated(false)
    }
  }, [isUpdated])

  // const handleUpdate = async  () => {
  //   setContactType((prevRoles) =>
  //     prevRoles.map((role) => (role.id === editingId ? { ...role, name: updatedTitle } : role))
  //   );
  //   const response = await axios.put(
  //     `${process.env.API_BASE_URL}/settings/sports/${editingId.sportId}`,
  //    { name:updatedTitle,
  //     isDeleted:0
  //    }
  //   );
  //   console.log('Updated Successfully:', response.data);
  //   setEditingId(null);
  // };
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
              {/* <Box py={2} borderBottom={"1px solid #E0E0E0"} minWidth={'103%'}
                          marginBottom={2}
                          marginLeft={'-17px !important'}
                        >
                          <Typography className="typography textfield-label bukra"
                            sx={{
                              marginLeft: '18px !important'
                            }}
                          >
                            Order
                          </Typography>
                        </Box> */}
              <Box
                py={2}
                borderBottom={"1px solid #E0E0E0"}
                minWidth={"100%"}
                marginBottom={2}
                display="grid"
                gridTemplateColumns="10% 35% 20% 20% 20% 0%" // Defines equal width for columns
                alignItems="center"
                px={2}
              >
                <Typography sx={{ fontWeight: "bold", textAlign: "left", color: '#58585B' }} className="dubai-regular" >Order</Typography>
                <Typography sx={{ fontWeight: "bold", textAlign: "left", color: '#58585B' }} className="dubai-regular">Sports List</Typography>
                <Typography sx={{ fontWeight: "bold", textAlign: "center", color: '#58585B' }} className="dubai-regular">Category</Typography>
                <Typography sx={{ fontWeight: "bold", textAlign: "center", color: '#58585B' }} className="dubai-regular">Status</Typography>
                <Typography sx={{ fontWeight: "bold", textAlign: "center", color: '#58585B' }} className="dubai-regular">Actions</Typography>
              </Box>
              <List>
                {!isEmpty(contactType) && contactType.map((role: any) => (

                  <EditPopUpListItem
                    key={role.sportId}
                    id={role.sportId}
                    title={role.sportName}
                    order={role.orderId}
                    category={role.categoryType}
                    active={role.isActive}
                    isEditing={editingId === role.sportId}
                    onEditClick={() => handleEditClick(role)}            // updatedTitle={updatedTitle}
                  // onEditClick={handleEditClick}            // updatedTitle={updatedTitle}
                  />
                ))}
              </List>

            </Box>

          </Grid>
        </Box>
      </Box>
      <UpdateSportDialog
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={setUpdated
        }
        sport={editingId}

      />
    </Box>
  )
}

export default UserManagementIndexPage;