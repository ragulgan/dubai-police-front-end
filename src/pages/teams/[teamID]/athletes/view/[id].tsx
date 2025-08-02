"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ViewPageNav from "@/components/nav/ViewPageNav";
import ProfileCard from "@/components/view/ProfileCard";
import UploadDocuments from "@/components/view/UploadDocuments";
import ResultsAndAchievements from "@/components/view/ResultsAndAchievements";
import CalendarSection from "@/components/view/CalendarSection";
import MedicalCheckCard from "@/components/view/MedicalCheckCard";
import SuggestedNutrition from "@/components/view/SuggestedNutrition";
import SlideDialog from "@/components/SlideDialog";
import CustomButton from "@/components/buttons/CustomButton";
import Image from "next/image";
import rightCurve from "../../../../../../public/rightCurve.png";
import leftCurve from "../../../../../../public/leftCurve.png";
import ViewBgImage from "../../../../../../public/viewBGImage.png";
import Totalcompetition from "../../../../../../public/Totalcompetition.svg";
import TotalMedals from "../../../../../../public/TotalMedals.svg";
import TrainingAvailability from "../../../../../../public/TrainingAvailability.svg";
import TrainingHours from "../../../../../../public/TrainingHours.svg";
import TopScorer from "../../../../../../public/TopScorer.svg";
import EditSVG from "../../../../../../public/EditSVG.svg";
import maleHero from "../../../../../../public/maleHero.png";
import femaleHero from "../../../../../../public/femaleHero.png";
import BackIcon from "../../../../../../public/backIcon.svg";
import {
  Avatar,
  LinearProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import MedicalHistoryCard from "@/components/view/MedicalHistoryCard";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { getHeroImage } from "@/utils/helper";
import { editTestAndMedicalByAtheleteEdit } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksByAtheleteEditSlice";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AthleteSlideDialog from "../edit/AthleteSlideDialog";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";
import CountAnimation from "@/components/common/CounterAnimation";

const ViewStaffs: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const athleteData = useSelector((state: RootState) =>
    state.athleteEdit.code === 200 && !isEmpty(state.athleteEdit?.data[0])
      ? state.athleteEdit?.data[0]
      : null
  );
  const athleteDataList =
    athleteData && athleteData?.resultAndAchievement?.length > 0
      ? athleteData?.resultAndAchievement
      : null;
  const athleteViewDetails =
    athleteData && athleteData?.athleteOverView[0]
      ? athleteData?.athleteOverView[0]
      : null;
  const { id, teamID } = router.query;
  const athleteID = id;
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const TestAndMedicalByIdAtheleteData = useSelector(
    (state: RootState) => state?.TestAndMedicalByAtheleteById
  );
  const TestAndMedicalByIdAthelete =
    TestAndMedicalByIdAtheleteData &&
    TestAndMedicalByIdAtheleteData?.data?.length > 0
      ? TestAndMedicalByIdAtheleteData?.data[0]
      : null;
  const [section, setSection] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "78.25vh";
    if (isFullHD) return "78.25vh";
    if (is3K) return "78.25vh";
    if (is2K) return "74.25vh";
    if (isLaptopL) return "75.25vh";
    if (isLaptop) return "75.25vh";
    if (isTab) return "75.25vh";
    return "71.25vh";
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Athletes",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View Athlete",
      route: `/teams/${teamID}/athletes/view/${athleteID}`,
      currentPage: true,
      disabled: false,
    },
  ];

  const postData = async () => {
    if (checkAccess(USER_PERMISSION.AthleteView)) {
      const payload: any = {
        athleteID: Number(athleteID),
        sportID: Number(teamID),
      };
      dispatch(editAthlete(payload));
    } else {
      router.push("/access-denied");
    }
  };

  useEffect(() => {
    if (id) {
      const payload: any = {
        athleteID: id,
        sportID: Number(teamID),
      };
      dispatch(editTestAndMedicalByAtheleteEdit(payload));
    }
  }, [id]);

  useEffect(() => {
    if (router.query.id) {
      postData();
    }
  }, [router.query.id]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isEdit) {
      timeoutId = setTimeout(() => {
        postData();
        dispatch(isUpdatedFunc(false));
        setShowEditDialog(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [isEdit]);

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setShowEditDialog(false);
  };

  const getAthleteHeroImage = () => {
    return getHeroImage(athleteData);
  };

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return <div>{plainText ? plainText : "--"}</div>;
  };

  const athleteOverViewData = athleteData?.athleteOverView?.[0];

  return (
    <>
      {showEditDialog && (
        <AthleteSlideDialog
          open={showEditDialog}
          id={Number(athleteID)}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          module={"athlete"}
          isView={true}
        />
      )}
      <Grid container p={1}>
        <Grid item xs={12} md={12}>
          <Box
            p={1.5}
            className="bg-white"
            borderRadius={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <BasicBreadcrumbs routes={breadcrumbRoutes} />
            <CustomButton
              sx={{
                borderRadius: "28px",
                backgroundColor: "rgba(0, 135, 85, 0.1)",
                px: 1.5,
                py: 0,
                fontSize: "18px",

                height: "30px",
              }}
              label="Back"
              variant="outlined"
              size="medium"
              ButtonIcon={BackIcon}
              iconPosition="start"
              onClick={() => router.back()}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          height={getPageContentHeight()}
          overflow={"scroll"}
          mt={1}
          pb={5}
        >
          <Grid
            item
            xs={12}
            md={12}
            position={"relative"}
            borderRadius={"10px"}
            sx={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
            }}
            height={"735px"}
          >
            <Image
              src={rightCurve}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                objectFit: "cover",
              }}
            />
            <Image
              src={leftCurve}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                objectFit: "cover",
                opacity: "0.5",
              }}
            />
            <Image
              src={ViewBgImage}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Grid
              container
              alignItems={"end"}
              justifyContent={"space-between"}
              position={"absolute"}
              bottom={0}
            >
              {athleteViewDetails ? (
                <Grid item xs={12} sm={4.5} px={3}>
                  <Typography className="bukra view-overview tertiary-color">
                    Overview
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mt={2}
                  >
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <Totalcompetition width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          <CountAnimation
                            value={Number(athleteViewDetails?.totalCompetition)}
                          />
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Total competition
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <TotalMedals width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          <CountAnimation
                            value={Number(athleteViewDetails?.totalMedal)}
                          />
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Total Medals
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mt={2}
                  >
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <TrainingAvailability width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          {athleteViewDetails?.trainingAvailability} %
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Training Availability
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <TrainingHours width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          <CountAnimation
                            value={Number(athleteViewDetails?.trainingHours)}
                          />
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Training Hours
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    p={2}
                    my={3}
                    borderRadius={"15px"}
                    width={"90%"}
                    sx={{
                      backgroundColor: "#009671",
                    }}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <TopScorer width={"24px"} height={"24px"} />
                    <Typography
                      className="bukra overview-title tertiary-color"
                      sx={{
                        ml: 1,
                        width: "100%",
                        height: "auto",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                      }}
                    >
                      <RenderEditorContentHtml
                        content={athleteData?.resultsAndAchievements}
                      />
                    </Typography>
                  </Box>
                  <Box
                    p={2}
                    my={3}
                    borderRadius="15px"
                    width="90%"
                    sx={{ backgroundColor: "#009671" }}
                  >
                    <Typography
                      className="overview-table-head bukra"
                      color="#EBE8E3"
                    >
                      KPIs
                    </Typography>
                    {athleteViewDetails?.kpiList?.map((item: any) => (
                      <React.Fragment key={item.kpiID}>
                        <Box
                          mt={1}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          className="overview-table-head dubai-regular"
                          color="#EBE8E3"
                        >
                          <Typography className="dubai-regular overview-table-list">
                            {item.kpiName ?? "--"}
                          </Typography>
                          <Typography>{item.kpiPoint ?? "--"}</Typography>
                        </Box>

                        <Box m={1.5} display={"flex"} gap={0.5}>
                          {[1, 2, 3].map((header, value) => (
                            <LinearProgress
                              key={header}
                              variant="determinate"
                              value={value < item.kpiPoint ? 100 : 0}
                              sx={{
                                color: "#F1EB9C",
                                height: "8px",
                                width: "33.3%",
                                borderTopRightRadius: header === 3 ? "3px" : 0,
                                borderBottomRightRadius:
                                  header === 3 ? "3px" : 0,
                                borderTopLeftRadius: header === 1 ? "3px" : 0,
                                borderBottomLeftRadius:
                                  header === 1 ? "3px" : 0,
                              }}
                              className="linear-progress"
                            />
                          ))}
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                </Grid>
              ) : (
                <Grid item xs={12} sm={4.5} px={3}></Grid>
              )}
              <Grid item xs={12} sm={3}>
                <Box textAlign={"start"} display={"grid"}>
                  {getAthleteHeroImage() !== "" ? (
                    <img
                      src={getAthleteHeroImage()}
                      alt=""
                      style={{
                        width: "363px",
                        height: "630px",
                        objectFit: "cover",
                      }}
                    />
                  ) : athleteData?.gender ? (
                    <Image
                      src={
                        athleteData?.gender === "female" ? femaleHero : maleHero
                      }
                      alt={""}
                      style={{
                        width: "363px",
                        height: "630px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} px={3}>
                <Box display={"flex"} alignItems={"center"}>
                  <Avatar
                    alt="Avatar"
                    src={athleteData?.profileImage}
                    style={{
                      width: 136,
                      height: 136,
                      border: "2px solid #FFFFFF",
                    }}
                  />
                  {checkAccess(USER_PERMISSION.AthleteEdit) && (
                    <CustomButton
                      sx={{
                        ml: 2,
                        backgroundColor: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontSize: "18px",
                      }}
                      label="Edit"
                      variant="outlined"
                      size="small"
                      ButtonIcon={EditSVG}
                      iconPosition="start"
                      onClick={() => setShowEditDialog(true)}
                    />
                  )}
                </Box>
                <Typography mt={2} className="bukra tertiary-color view-rank">
                  {athleteData?.rank}
                </Typography>
                <Tooltip title={athleteData?.firstName}>
                  <Typography
                    mt={0.5}
                    className="bukra tertiary-color view-name"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "context-menu",
                    }}
                  >
                    {athleteData?.firstName}
                  </Typography>
                </Tooltip>
                <Box display={"flex"} gap={1}>
                  {/* {_.isEmpty(athleteData?.sportsCategory) ||
                  athleteData?.sportsCategory === "[]" ||
                  athleteData?.sportsCategory === " " ? null : (
                    <>
                      <Box
                        sx={{
                          backgroundColor: "#F1EB9C",
                          fontSize: "16px",
                          borderRadius: "8px",
                          px: 2,
                          py: 0.5,
                          textAlign: "center",
                        }}
                        className="dubai-bold text-capitalize"
                      >
                        {athleteData?.sportsCategory}
                      </Box>
                    </>
                  )} */}
                  {_.isEmpty(athleteData?.nationalTeamMember) ||
                  athleteData?.nationalTeamMember === " " ||
                  athleteData?.nationalTeamMember === "N" ||
                  athleteData?.nationalTeamMember === "No" ? (
                    <>&nbsp;</>
                  ) : (
                    <>
                      <Box
                        sx={{
                          backgroundColor: "#F1EB9C",
                          fontSize: "16px",
                          borderRadius: "8px",
                          px: 2,
                          py: 0.5,
                          textAlign: "center",
                        }}
                        className="dubai-bold text-capitalize"
                      >
                        {athleteData?.nationalTeamMember === "Y" &&
                          "National Team Player"}
                      </Box>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    minWidth: "256px",
                    maxWidth: "80%",
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    px={2}
                    py={1}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {athleteData?.sportName}
                  </Typography>
                  <Typography py={1}>|</Typography>
                  <Typography
                    px={2}
                    py={1}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {athleteData?.role}
                  </Typography>
                </Box>
                <Box
                  sx={{ border: "1px solid #FFFFFF", borderRadius: "15px" }}
                  p={1.5}
                  mt={2}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-regular"
                    mt={2}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        DOB:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                      >
                        {athleteData?.dob}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Age:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                      >
                        {athleteData?.age}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-regular"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Gender:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                      >
                        {athleteData?.gender}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Nationality:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {athleteData?.nationalityText}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-regular"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Discipline Practiced:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {athleteData?.disciplinePracticed}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-regular"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Federation License:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {athleteData?.federationLicense}
                      </Typography>
                    </Box>
                  </Box>
                  {/* <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-regular"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-regular">
                        Department:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-bold"
                        ml={1}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {athleteData?.department}
                      </Typography>
                    </Box>
                  </Box> */}
                </Box>
                <Box
                  p={1.5}
                  my={3}
                  borderRadius={"15px"}
                  width={"100%"}
                  sx={{
                    backgroundColor: "#009671",
                  }}
                >
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-regular"
                    color="#EBE8E3"
                  >
                    <Box
                      textAlign={"center"}
                      borderRight={"1px solid #FFFFFF"}
                      width={"50%"}
                    >
                      <Typography className="view-table-list-head tertiary-color dubai-regular">
                        Score
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color dubai-bold">
                        {athleteViewDetails?.score ?? "--"}
                      </Typography>
                    </Box>
                    <Box textAlign={"center"} width={"50%"}>
                      <Typography className="view-table-list-head tertiary-color dubai-regular">
                        Source
                      </Typography>
                      <Typography
                        className="view-table-list-data tertiary-color dubai-bold"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {athleteData && athleteData?.source
                          ? athleteData?.source
                          : "---"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Box width={"100%"}>
                {section !== 1 && (
                  <ViewPageNav
                    label="Results & Achievements"
                    expanded={section == 1}
                    onClick={() => toggleSection(1)}
                  />
                )}
                {section == 1 ? (
                  <ResultsAndAchievements
                    label="Results & Achievements"
                    expanded={section == 1}
                    onClick={() => toggleSection(1)}
                    type="athlete"
                    athleteData={athleteDataList}
                    sportID={Number(teamID)}
                    athleteID={Number(athleteID)}
                  />
                ) : null}
                {section !== 2 && (
                  <ViewPageNav
                    label="Training & Competition Calendar"
                    expanded={section == 2}
                    onClick={() => toggleSection(2)}
                  />
                )}
                {section == 2 && (
                  <CalendarSection
                    sportID={Number(teamID)}
                    label="Training & Competition Calendar"
                    expanded={section == 2}
                    module="athlete"
                    moduleID={Number(athleteID)}
                    onClick={() => toggleSection(2)}
                  />
                )}
                {section !== 3 && (
                  <ViewPageNav
                    label="Medical, Rehab & Wellness"
                    expanded={section == 3}
                    onClick={() => toggleSection(3)}
                  />
                )}
                {section == 3 && (
                  <MedicalCheckCard
                    label="Medical, Rehab & Wellness"
                    expanded={section == 3}
                    onClick={() => toggleSection(3)}
                    TestAndMedicalByIdAthelete={TestAndMedicalByIdAthelete}
                    sportID={Number(teamID)}
                    athleteId={Number(id)}
                  />
                )}
                {section !== 4 && (
                  <ViewPageNav
                    label="Nutrition Plan"
                    expanded={section == 4}
                    onClick={() => toggleSection(4)}
                  />
                )}
                {section == 4 && (
                  <SuggestedNutrition
                    sportID={Number(teamID)}
                    athleteID={Number(athleteID)}
                    label="Nutrition Plan"
                    expanded={section == 4}
                    onClick={() => toggleSection(4)}
                  />
                )}
                {section !== 5 && (
                  <ViewPageNav
                    label="Medical & Injuries History"
                    expanded={section == 5}
                    onClick={() => toggleSection(5)}
                  />
                )}
                {section == 5 && (
                  <MedicalHistoryCard
                    label="Medical & Injuries History"
                    expanded={section == 5}
                    onClick={() => toggleSection(5)}
                  />
                )}
                {checkAccess(USER_PERMISSION.AthleteSentiveDataView) && (
                  <>
                    {section !== 6 && (
                      <ViewPageNav
                        label="Uploaded Documents"
                        expanded={section == 6}
                        onClick={() => toggleSection(6)}
                      />
                    )}
                    {section == 6 ? (
                      <UploadDocuments
                        module="athlete"
                        label="Uploaded Documents"
                        expanded={section == 6}
                        attachmentList={
                          athleteData && athleteData.attachmentList
                            ? athleteData.attachmentList
                            : []
                        }
                        onClick={() => toggleSection(6)}
                        onFileChange={() => postData()}
                      />
                    ) : null}
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <ProfileCard data={athleteData} module="athlete" id={athleteID} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewStaffs;
