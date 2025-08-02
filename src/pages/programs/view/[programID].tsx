import BreadcrumpWithBack from "@/components/nav/BreadcrumbWithBack";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import CalendarGrey from "../../../../public/CalendarGrey.svg";
import ClockGrey from "../../../../public/ClockGrey.svg";
import Location from "../../../../public/Location.svg";
import CustomButton from "@/components/buttons/CustomButton";
import EditIcon from "@mui/icons-material/Edit";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useEffect, useState } from "react";
import { GetProgramByID } from "@/redux/slices/program/getRaceCalendarIDSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SlideFullDrawer from "../edit/slideFullDrawer";
import { isEmpty } from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ProgramsViewPage = () => {
  const router = useRouter();
  const { programID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "79vh";
    if (isFullHD) return "78vh";
    if (is3K) return "79vh";
    if (is2K) return "73vh";
    if (isLaptopL) return "75vh";
    if (isLaptop) return "75vh";
    if (isTab) return "75vh";
    return "75vh";
  };
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Programs",
      route: `/programs`,
      disabled: false,
      currentPage: false,
    },
    {
      title: "View",
      route: `/programs/view/${programID}`,
      disabled: false,
      currentPage: true,
    },
  ];

  const GetProgramEditData = useSelector(
    (state: RootState) => state.GetProgramById
  );
  const progranEditdata = GetProgramEditData && GetProgramEditData?.data[0];

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.ProgramsView)) {
      if (programID) {
        const payload: any = {
          programID: Number(programID),
        };
        dispatch(GetProgramByID(payload));
      }
    } else {
      router.push("/");
    }
  }, [programID, dispatch]);

  const RenderEditorContentHTML = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
        className="dubai-regular"
      />
    );
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return <div>{plainText}</div>;
  };

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);

    if (programID) {
      const payload: any = {
        programID: Number(programID),
      };
      dispatch(GetProgramByID(payload));
    }
  };

  return (
    <Box p={1}>
      {/* Breadcrump with back */}
      {isOpen && (
        <SlideFullDrawer
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
        />
      )}
      <BreadcrumpWithBack routes={breadcrumbRoutes} />
      {/* View content */}
      {GetProgramEditData && GetProgramEditData?.loading ? <></> : null}
      {GetProgramEditData && !GetProgramEditData?.loading ? (
        <Grid container mt={1}>
          <Grid
            item
            xs={12}
            sx={{ height: getPageContentHeight(), overflowY: "scroll" }}
          >
            <Box className="bg-white" borderRadius={1}>
              <Grid container>
                {/* image section */}
                <Grid item xs={12} sm={6} md={4} lg={4} padding={2}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    {isEmpty(progranEditdata && progranEditdata?.filePath) ? (
                      <Box p={0.5}>
                        <StaticFoodImage
                          style={{
                            width: "100%",
                            height: "300px",
                            borderRadius: 8,
                          }}
                          className="static-image"
                        />
                      </Box>
                    ) : (
                      <img
                        src={progranEditdata && progranEditdata?.filePath}
                        alt="Program Image"
                        style={{
                          width: "100%",
                          height: "300px",
                          borderRadius: 8,
                          padding: "4px",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                {/* details section */}
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Box padding={2}>
                    <Typography
                      sx={{
                        fontSize: "24px",
                        lineHeight: "24.2px",
                        color: "#005844",
                        mt: 1,
                      }}
                      className="bukra-semi-bold text-capitalize"
                    >
                      {progranEditdata?.programName}
                    </Typography>
                    <Typography
                      className="dubai-regular webkit-line-clamp"
                      sx={{
                        marginTop: 2,
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "18px",
                        color: "#58585B",
                      }}
                    >
                      <RenderEditorContent
                        content={progranEditdata?.objective}
                      />
                    </Typography>

                    {/* date */}
                    <Box
                      sx={{
                        marginTop: 1,
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CalendarGrey style={{ width: 20, height: 20 }} />
                      <Typography
                        className="dubai-regular"
                        sx={{
                          paddingX: 1,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "21px",
                          color: "#58585B",
                        }}
                      >
                        {progranEditdata?.startDate}
                      </Typography>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          paddingRight: 1,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "21px",
                          color: "#58585B",
                        }}
                      >
                        {`-`}
                      </Typography>
                      <CalendarGrey style={{ width: 20, height: 20 }} />
                      <Typography
                        className="dubai-regular"
                        sx={{
                          paddingX: 1,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "21px",
                          color: "#58585B",
                        }}
                      >
                        {progranEditdata?.endDate}
                      </Typography>
                    </Box>

                    {/* time */}
                    <Box
                      sx={{
                        marginTop: 1,
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ClockGrey style={{ width: 20, height: 20 }} />
                      <Typography
                        className="dubai-regular"
                        sx={{
                          paddingX: 1,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "21px",
                          color: "#58585B",
                        }}
                      >
                        {isEmpty(progranEditdata?.startTime) ? (
                          <>&nbsp;</>
                        ) : (
                          progranEditdata?.startTime
                        )}
                      </Typography>
                      {isEmpty(progranEditdata?.startTime) ? null : (
                        <>
                          <Typography
                            className="dubai-regular"
                            sx={{
                              paddingRight: 1,
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "21px",
                              color: "#58585B",
                            }}
                          >
                            {`-`}
                          </Typography>
                          <ClockGrey style={{ width: 20, height: 20 }} />
                          <Typography
                            className="dubai-regular"
                            sx={{
                              paddingX: 1,
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "21px",
                              color: "#58585B",
                            }}
                          >
                            {isEmpty(progranEditdata?.endTime) ? (
                              <>&nbsp;</>
                            ) : (
                              progranEditdata?.endTime
                            )}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box
                      sx={{
                        marginTop: 1,
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Location style={{ width: 20, height: 20 }} />
                      <Typography
                        className="dubai-regular"
                        sx={{
                          paddingX: 1,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "21px",
                          color: "#58585B",
                        }}
                      >
                        {progranEditdata?.programLocation}
                      </Typography>
                    </Box>

                    {/* Frequency & content outline */}
                    <Box
                      sx={{
                        marginTop: 2,
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Frequency */}
                      <Box
                        sx={{
                          borderStyle: "solid",
                          borderWidth: "1px",
                          borderColor: "rgba(0, 135, 85, 0.3)",
                          padding: 1,
                          borderRadius: 2,
                          bgcolor: "rgba(0, 135, 85, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#58585B",
                          }}
                          className="bukra"
                        >
                          {`Frequency`}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#000000",
                            mt: 1,
                          }}
                          className="dubai-med"
                        >
                          {isEmpty(progranEditdata?.frequency) ? (
                            <>&nbsp;</>
                          ) : (
                            progranEditdata?.frequency
                          )}
                        </Typography>
                      </Box>

                      {/* Content Outline */}
                      <Box
                        sx={{
                          marginLeft: 1,
                          borderStyle: "solid",
                          borderWidth: "1px",
                          borderColor: "rgba(0, 135, 85, 0.3)",
                          padding: 1,
                          borderRadius: 2,
                          bgcolor: "rgba(0, 135, 85, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#58585B",
                          }}
                          className="bukra"
                        >
                          {`Content Outline`}
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#000000",
                            mt: 1,
                          }}
                          className="dubai-med"
                        >
                          {isEmpty(progranEditdata?.contentOutline) ? (
                            <>&nbsp;</>
                          ) : (
                            progranEditdata?.contentOutline
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Edit button */}
                {checkAccess(1069) ? (
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Box
                      sx={{
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <CustomButton
                        sx={{
                          marginRight: 1,
                          fontSize: "16px",
                          fontWeight: 400,
                        }}
                        fullWidth={false}
                        label="Edit"
                        variant="outlined"
                        size="large"
                        iconPosition="start"
                        ButtonIcon={EditIcon}
                        onClick={() =>
                          handleEditData(progranEditdata?.programID)
                        }
                      />
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Box>

            {/* Feedback content */}
            <Box mt={1} className="bg-white" borderRadius={1}>
              <Card>
                <CardHeader
                  avatar={<ListOutlinedIcon />}
                  title="Feedbacks"
                  className="primary-color card-header"
                />
                <CardContent sx={{ py: 0 }}>
                  <Typography className="dubai-med view-card-list-para">
                    <RenderEditorContentHTML
                      content={progranEditdata?.feedback}
                    />
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

export default ProgramsViewPage;
