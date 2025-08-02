import React, { useState } from 'react'
import { Avatar, Box, Card, CardContent, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import EditIcon from "../../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorage } from '@/utils/helper';
import { AppDispatch } from '@/redux/store';
import RenderHtmlContent from '../common/RenderHtmlContent';
import DepartmentDrawer from '@/pages/tournaments/commander/departments/edit/DepartmentUpdateDrawer';

const DepartmentCardView: any = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const getCurrentSport = getLocalStorage("sport");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isEditData, setIsEditData] = useState(null);
  const [isOpenEditDepartment, setIsOpenEditDepartment] = useState(false);

  const handleEditData = (id: any) => {
    setIsEditData(id);
    setIsOpenEditDepartment(true);
  };

  const handleCloseEdit = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpenEditDepartment(false);
    // dispatch(clearEditState());
  };

  const onViewClick = () => {
    router.push(`/tournaments/commander/departments/view/`)
  }
  // Department List
  const departmentList = useSelector((state: any) => {
    return state.getDepartmentListAPI;
  });

  return (
    <>
      {isOpenEditDepartment && (
        <DepartmentDrawer
          open={isOpenEditDepartment}
          onClose={(event: any, reason: any) => handleCloseEdit(event, reason)}
          isEditData={isEditData}
        />
      )}
      <Box p={{ xs: 3 }} pt={0}>
        <Grid container spacing={2} sx={{ justifyContent: isMobile ? "center" : "" }}>
          <Grid item>
            <Card
              sx={{
                width: 345,
                height: "289px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 135, 85, 1)",
                boxShadow: "none",
                p: 1,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width="294px"
                    height="92px"
                  >
                    <Avatar
                      src={"/rewards/rewardsImg.svg"}
                      alt={"Player Image"}
                      sx={{
                        width: "76px",
                        height: "76px",
                        bgcolor: "rgba(177, 228, 227, 0.2)",
                        border: "1px solid #008755",
                      }}
                      imgProps={{
                        style: {
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        },
                      }}
                    />
                    <Stack direction="column" spacing={2} mt={2}>
                      <Typography
                        className="bukra-semi-bold text-capitalize"
                        sx={{
                          fontSize: "32px",
                          lineHeight: "18px",
                          color: "rgba(0, 0, 0, 1)",
                          textAlign: "right",
                        }}
                      >
                        89.9
                      </Typography>
                      <Typography
                        className="bukra-semi-bold text-capitalize"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "18px",
                          color: "rgba(0, 0, 0, 1)",
                        }}
                      >
                        {"Total Points"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Box mb={4}>
                  <Tooltip
                    title={"Airport Security"}
                  >
                    <Typography
                      className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
                      sx={{
                        fontSize: "16px",
                        lineHeight: "18px",
                        color: "rgba(0, 0, 0, 1)",
                      }}
                      mb={1}
                    >
                      {"Airport Security"}
                    </Typography>
                  </Tooltip>
                  <Typography
                    className="dubai-regular webkit-line-clamp webkit-2"
                    sx={{
                      fontSize: "16px",
                      lineHeight: "20.8px",
                      color: "rgba(88, 88, 91, 1)",
                      height: "42px",
                    }}
                  >
                    {
                      <RenderHtmlContent
                        content={"A premier tournament showcasing top talent and competitive spirit, held.."}
                      />
                    }
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <IconButton
                    sx={{
                      backgroundColor: "#008755",
                      color: "white",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      width: "50%",
                      padding: "4px 8px", // Adjust padding top/bottom and left/right
                      minHeight: "39px", // Reduce the height of the button
                    }}
                    onClick={onViewClick} // Use prop for click action
                  >
                    <VisibilityIcon />
                    <Typography
                      sx={{
                        fontFamily: "29LT Bukra",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                      ml={1}
                      className="dubai-regular"
                    >
                      View
                    </Typography>
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: "transparent",
                      color: "#008755",
                      border: "1px solid #008755",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#fff",
                      },
                      width: "50%",
                      padding: "4px 8px", // Adjust padding top/bottom and left/right
                      minHeight: "39px", // Reduce the height of the button
                    }}
                    className="dubai-regular"
                    onClick={() => handleEditData(1)}
                  >
                    <EditIcon width={"18px"} height={"18px"} />
                    <Typography
                      sx={{
                        fontFamily: "29LT Bukra",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                      ml={1}
                      className="dubai-regular"
                    >
                      Update Scores
                    </Typography>
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default DepartmentCardView