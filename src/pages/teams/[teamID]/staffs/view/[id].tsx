"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ViewPageNav from "@/components/nav/ViewPageNav";
import ProfileCard from "@/components/view/ProfileCard";
import Axios from "../../../../../utils/axiosFileInstance";
import UploadDocuments from "@/components/view/UploadDocuments";
import ResultsAndAchievements from "@/components/view/ResultsAndAchievements";
import CalendarSection from "@/components/view/CalendarSection";
import CustomButton from "@/components/buttons/CustomButton";
import Image from "next/image";
import ViewBgImage from "../../../../../../public/viewBGImage.png";
import rightCurve from "../../../../../../public/rightCurve.png";
import leftCurve from "../../../../../../public/leftCurve.png";
import AssignedAthlete from "../../../../../../public/assignedAthlete.svg";
import NationalTeamAthletes from "../../../../../../public/nationalTeamAthletes.svg";
import FemaleAthletes from "../../../../../../public/femaleAthletes.svg";
import maleHero from "../../../../../../public/maleHero.png";
import femaleHero from "../../../../../../public/femaleHero.png";
import EditSVG from "../../../../../../public/EditSVG.svg";
import BackIcon from "../../../../../../public/backIcon.svg";
import { Avatar, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getHeroImage } from "@/utils/helper";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import _ from "lodash";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { Attachment, BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import StaffSlideDialog from "../edit/StaffSlideDialog";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

const ViewStaffs: React.FC = () => {
  const router = useRouter();
  const { id, teamID } = router.query;
  const staffID = id;

  // populating breadcrumb
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/staffs`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Staff",
      route: `/teams/${teamID}/staffs`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/teams/${teamID}/staffs/view`,
      currentPage: true,
      disabled: false,
    },
  ];
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
  const [section, setSection] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const staffEditList = useSelector((state: RootState) =>
    state.staffEdit.code === 200 && !isEmpty(state.staffEdit?.data[0])
      ? state.staffEdit?.data[0]
      : null
  );
  const staffData =
    staffEditList && staffEditList?.resultAndAchievement?.length > 0
      ? staffEditList?.resultAndAchievement
      : null;
  const staffViewDetails =
    staffEditList && staffEditList?.staffOverviewList[0]
      ? staffEditList?.staffOverviewList[0]
      : null;
  const staffEditLoading = useSelector((state: RootState) => state.staffEdit);
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

  const postData = () => {
    if (checkAccess(USER_PERMISSION.StaffView)) {
      const payload: any = {
        staffID: Number(staffID),
        sportID: Number(teamID),
      };
      dispatch(editStaff(payload));
    } else {
      router.push("/access-denied");
    }
  };

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

  useEffect(() => {
    if (router.query.id) {
      postData();
    }
  }, [router.query.id]);

  useEffect(() => {
    if (!_.isEmpty(staffEditList)) {
      setAttachments(staffEditList?.attachmentList);
    }
  }, [staffEditList]);

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    // Prevent the drawer from closing when the click away or backdrop event is triggered
    if (reason === "backdropClick") {
      return;
    }
    setShowEditDialog(false);
  };

  const teamsNames = getSportList && getSportList.data;
  const selOption: any = _.filter(teamsNames, (sport: any) => {
    if (sport.sportID && typeof sport.sportID !== "undefined") {
      const selectedSports = staffEditList?.sport
        ? staffEditList.sport.split(",").map((id: string) => id.trim())
        : [];
      return selectedSports.includes(sport.sportID.toString());
    }
  });

  const getStaffHeroImage = () => {
    return getHeroImage(staffEditList);
  };

  return (
    <>
      {showEditDialog && (
        <StaffSlideDialog
          open={showEditDialog}
          id={staffEditList?.staffID}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          module={"staff"}
          isView={true}
        />
      )}
      {/* {staffEditLoading.loading ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: "78vh",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : ( */}
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
                fontWeight: 500,
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
          pb={5}
          mt={1}
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
            <Typography
              variant="h1"
              position={"absolute"}
              top={"30px"}
              left={"196px"}
              color="#EBE8E3"
              className="dubai-med"
              sx={{
                fontSize: "169px",
                fontWeight: 500,
                opacity: "0.5",
                display: { xs: "none", sm: "unset" },
              }}
            >
              {staffEditList?.roleText === "Other Staff"
                ? staffEditList?.otherStaff
                : staffEditList?.roleText}
            </Typography>
            <Grid
              container
              alignItems={"end"}
              justifyContent={"space-between"}
              position={"absolute"}
              bottom={0}
            >
              {staffViewDetails ? (
                <Grid item xs={4.5} px={3}>
                  <Typography className="bukra view-overview tertiary-color">
                    2024 - 2025{" "}
                    <span style={{ fontSize: "20px" }}>(Current Season)</span>
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mt={2}
                  >
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <AssignedAthlete width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          {staffViewDetails?.assignedAthletes
                            ? staffViewDetails?.assignedAthletes
                            : "--"}
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Assigned Athletes
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <NationalTeamAthletes width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          {staffViewDetails?.nationalTeamAthletes
                            ? staffViewDetails?.nationalTeamAthletes
                            : "--"}
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          National Team Athletes
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
                        <AssignedAthlete width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          {staffViewDetails?.maleAthletes
                            ? staffViewDetails?.maleAthletes
                            : "--"}
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Male Athletes
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={"48%"} display={"flex"}>
                      <Box width={"44px"} height={"44px"}>
                        <FemaleAthletes width={"100%"} height={"100%"} />
                      </Box>
                      <Box ml={2}>
                        <Typography className="bukra overview-title tertiary-color">
                          {staffViewDetails?.femaleAthletes
                            ? staffViewDetails?.femaleAthletes
                            : "--"}
                        </Typography>
                        <Typography className="dubai-regular overview-subtitle tertiary-color">
                          Female Athletes
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
                  >
                    <Typography
                      className="overview-table-head bukra"
                      color="#EBE8E3"
                    >
                      KPIs
                    </Typography>
                    <Box
                      mt={1}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className="overview-table-head dubai-regular"
                      color="#EBE8E3"
                    >
                      <Typography className="dubai-regular overview-table-list">
                        Total Competitions
                      </Typography>
                      <Typography className="dubai-regular overview-table-list">
                        {staffViewDetails?.kpiList
                          ? staffViewDetails?.kpiList?.totalCompetition
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      mt={1}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className="overview-table-head dubai-regular"
                      color="#EBE8E3"
                    >
                      <Typography className="dubai-regular overview-table-list">
                        Total Medals
                      </Typography>
                      <Typography className="dubai-regular overview-table-list">
                        {staffViewDetails?.kpiList
                          ? staffViewDetails?.kpiList?.totalMedals
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      mt={1}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className="overview-table-head dubai-regular"
                      color="#EBE8E3"
                    >
                      <Typography className="dubai-regular overview-table-list">
                        Training Session Conducted
                      </Typography>
                      <Typography className="dubai-regular overview-table-list">
                        {staffViewDetails?.kpiList
                          ? staffViewDetails?.kpiList?.sessionConducted
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      mt={1}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className="overview-table-head dubai-regular"
                      color="#EBE8E3"
                    >
                      <Typography className="dubai-regular overview-table-list">
                        Training Session Availability
                      </Typography>
                      <Typography className="dubai-regular overview-table-list">
                        {staffViewDetails?.kpiList
                          ? staffViewDetails?.kpiList?.sessionAvailiability
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      mt={1}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className="overview-table-head dubai-regular"
                      color="#EBE8E3"
                    >
                      <Typography className="dubai-regular overview-table-list">
                        Training Session Hours
                      </Typography>
                      <Typography className="dubai-regular overview-table-list">
                        {staffViewDetails?.kpiList
                          ? staffViewDetails?.kpiList?.sessionHours
                          : "--"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={4.5}
                  px={3}
                  sx={{ display: { xs: "none", sm: "unset" } }}
                ></Grid>
              )}
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: { xs: "none", sm: "unset" } }}
              >
                <Box textAlign={"start"} display={"grid"}>
                  {getStaffHeroImage() !== "" ? (
                    <img
                      src={getStaffHeroImage()}
                      alt=""
                      style={{
                        width: "363px",
                        height: "630px",
                        objectFit: "cover",
                      }}
                    />
                  ) : staffEditList?.gender ? (
                    <Image
                      src={
                        staffEditList?.gender === "female"
                          ? femaleHero
                          : maleHero
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
                    src={staffEditList?.profileImage}
                    style={{
                      width: 136,
                      height: 136,
                      border: "2px solid #FFFFFF",
                    }}
                  />
                  {checkAccess(USER_PERMISSION.StaffEdit) && (
                    <CustomButton
                      sx={{
                        ml: 2,
                        backgroundColor: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontSize: "18px",
                        fontWeight: 500,
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
                <Typography
                  mt={2}
                  className="bukra tertiary-color view-rank text-capitalize"
                >
                  {staffEditList?.rankOrGrade}
                </Typography>
                <Typography
                  mt={0.5}
                  className="bukra tertiary-color view-name text-capitalize"
                >
                  {staffEditList
                    ? `${staffEditList?.firstName} ${staffEditList?.middleName} ${staffEditList?.surname}`
                    : ""}
                </Typography>
                {!_.isEmpty(selOption) ? (
                  <Tooltip
                    title={
                      selOption &&
                      Array.isArray(selOption) &&
                      selOption?.map((item: any, index: any) => {
                        return (
                          <>
                            {item.sportName}
                            {index !== selOption.length - 1 && ", "}
                          </>
                        );
                      })
                    }
                    sx={{ fontSize: "9px" }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        p: 1,
                        px: 2,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                        display: "inline-block",
                        maxWidth: "100%",
                      }}
                      className="bukra text-capitalize"
                    >
                      {selOption &&
                        Array.isArray(selOption) &&
                        selOption?.map((item: any, index: any) => {
                          return (
                            <>
                              {item.sportName}
                              {index !== selOption.length - 1 && ", "}
                            </>
                          );
                        })}
                    </Box>
                  </Tooltip>
                ) : (
                  <>&nbsp;</>
                )}
                <Box
                  sx={{ border: "1px solid #FFFFFF", borderRadius: "15px" }}
                  p={1.5}
                  mt={2}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={2}
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
                        className="view-table-list-data text-capitalize dubai-bold text-capitalize"
                        ml={1}
                      >
                        {staffEditList?.gender}
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
                        {staffEditList?.age}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={1}
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
                        {staffEditList?.dob}
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
                      <Tooltip title={staffEditList?.nationalityText}>
                        <Typography
                          className="view-table-list-data text-capitalize dubai-bold text-ellipsis"
                          ml={1}
                          sx={{ cursor: "default" }}
                        >
                          {staffEditList?.nationalityText}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
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
                        className="view-table-list-data text-capitalize dubai-bold text-capitalize"
                        ml={1}
                      >
                        {staffEditList?.federationLicence}
                      </Typography>
                    </Box>
                  </Box>
                  {/* <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
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
                        className="view-table-list-data text-capitalize dubai-bold text-capitalize
                        "
                        ml={1}
                      >
                        {staffEditList?.department}
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
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Box
                      textAlign={"center"}
                      borderRight={"1px solid #FFFFFF"}
                      width={"50%"}
                      px={1}
                    >
                      <Typography className="view-table-list-head tertiary-color dubai-regular">
                        Highest Certification
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color dubai-bold">
                        {staffEditList?.coachingCertifications
                          ? staffEditList?.coachingCertifications
                          : "---"}
                      </Typography>
                    </Box>
                    <Box textAlign={"center"} width={"50%"}>
                      <Typography className="view-table-list-head tertiary-color dubai-regular">
                        Source
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color dubai-bold">
                        Dubai Police
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
                    type="staff"
                    staffData={staffData}
                    sportID={Number(teamID)}
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
                    module="staff"
                    moduleID={Number(staffID)}
                    onClick={() => toggleSection(2)}
                  />
                )}
                {checkAccess(USER_PERMISSION.StaffSentiveDataView) && (
                  <>
                    {section !== 3 && (
                      <ViewPageNav
                        label="Uploaded Documents"
                        expanded={section === 3}
                        onClick={() => toggleSection(3)}
                      />
                    )}
                    {section === 3 && (
                      <UploadDocuments
                        module="staff"
                        label="Uploaded Documents"
                        expanded={true}
                        attachmentList={attachments}
                        onClick={() => toggleSection(3)}
                        onFileChange={() => postData()}
                      />
                    )}
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <ProfileCard data={staffEditList} module="staff" id={id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* )} */}
    </>
  );
};

export default ViewStaffs;
