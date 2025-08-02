import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Avatar,
  Link,
  Select,
  MenuItem,
  CardContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import ShippingAddDrawer from "./shippingAddDrawer";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getTeamRequirementByID } from "@/redux/slices/teamRequirement/getTeamRequirementByIdSlice";
import { isEmpty } from "lodash";
import CustomButton from "@/components/buttons/CustomButton";
import EditIcon from "../../../../public/team-requirements/EditPenTeamOverview.svg";
import SlideTeamRequirementDrawer from "../../../pages/teams/[teamID]/teamRequirements/edit/slideTeamRequirementDrawer";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Axios from "../../../utils/axiosFileInstance";
import {
  clearTeamRequirementUpdateStatusState,
  updateStatusTeamRequirement,
} from "@/redux/slices/teamRequirement/updateTeamRequirementStatus";
import CustomSnackbar from "@/components/CustomSnackbar";
import RejectRequirementDialog from "./rejectRequirementDialog";
import CardHeader from "@mui/material/CardHeader";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const statusOptions = [
  {
    value: 0,
    label: "Pending",
    bgColor: "#FFF8F0",
    textColor: "#FC8A00",
    borderColor: "#FC8A00",
  }, // Yellow
  {
    value: 1,
    label: "Fulfilled",
    bgColor: "#0087551A",
    textColor: "#008755",
    borderColor: "#008755",
  }, // Green
  {
    value: 2,
    label: "Cancelled",
    bgColor: "#E4002B0F",
    textColor: "#E4002B",
    borderColor: "#E4002B",
  }, // Red
];

const TeamRequirementsViewInfo = () => {
  const router = useRouter();
  const { id, teamID } = router.query;
  const teamRequirementID = id;
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditRequirement, setIsOpenEditRequirement] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>("");
  const [isRejectRequirement, setIsRejectRequirement] = useState(false);
  const [teamRequirementStatus, setTeamRequirementStatus] = useState(false);
  const [actionType, setActionType] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getTeamRequirementByIDDta = useSelector((state: RootState) => {
    return state && state.getTeamRequirementByID;
  });

  const updateTeamRequirementStatus = useSelector((state: RootState) => {
    return state && state.updateTeamRequirementStatus;
  });

  const getTeamRequirementByIDData = useSelector((state: RootState) => {
    return state &&
      state.getTeamRequirementByID &&
      !isEmpty(state?.getTeamRequirementByID?.data) &&
      !isEmpty(state?.getTeamRequirementByID?.data[0])
      ? state.getTeamRequirementByID.data[0]
      : null;
  });

  const mode =
    getTeamRequirementByIDData?.vendorName &&
      getTeamRequirementByIDData?.deliveryDate
      ? "Edit"
      : "Create";

  const initialStatus = getTeamRequirementByIDData?.shipmentStatus ?? 0;
  const [status, setStatus] = useState(initialStatus);
  const selectedStatus = statusOptions.find(
    (option: any) => option.value === status
  );

  useEffect(() => {
    setStatus(getTeamRequirementByIDData?.shipmentStatus ?? 0);
  }, [teamRequirementID, getTeamRequirementByIDData]);

  const handleChange = (event: any) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    if (newStatus === initialStatus) return;
    setActionType("statusUpdate");
    const payload = {
      teamRequirementID: Number(teamRequirementID),
      section: "shipping",
      status: newStatus,
    };
    try {
      dispatch(
        updateStatusTeamRequirement({
          url: "/UpdateTeamRequirementsStatus",
          payload,
        })
      );
      if (
        updateTeamRequirementStatus &&
        updateTeamRequirementStatus.code === 200
      ) {
        setTeamRequirementStatus(true);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.TeamRequirementsView)) {
      if (!teamRequirementID || !teamID) return;
      const payload: any = {
        teamRequirementID: Number(teamRequirementID),
        sportID: Number(teamID),
      };
      dispatch(getTeamRequirementByID(payload));
    } else {
      router.push("/");
    }
  }, [teamRequirementID, teamID, isUpdated]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpenEditRequirement(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleCloseEdit = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpenEditRequirement(false);
  };

  const downloadFile = async (file: any) => {
    if (!file) {
      return;
    }
    const fileName = file?.split("/").pop();
    if (file?.moduleID !== null) {
      try {
        const response = await Axios.get(file, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    }
  };

  useEffect(() => {
    if (
      updateTeamRequirementStatus &&
      updateTeamRequirementStatus.code === 200
    ) {
      setShowBanner(true);
      setSnackbarStatus("success");
      if (actionType === "requirementReject")
        setTimeout(() => {
          setIsRejectRequirement(false);
        }, 500);

      if (actionType === "statusUpdate") {
        setSnackbarMessage("Team Requirement Status Updated successfully!");
      } else if (actionType === "requirementReject") {
        setSnackbarMessage("Requirement rejected successfully!");
      } else if (actionType === "requirementApprove") {
        setSnackbarMessage("Requirement approved successfully!");
      }
      setTimeout(() => {
        const payload: any = {
          teamRequirementID: Number(teamRequirementID),
          sportID: Number(teamID),
        };
        dispatch(getTeamRequirementByID(payload));
        dispatch(clearTeamRequirementUpdateStatusState());
      }, 1000);
    } else if (
      updateTeamRequirementStatus &&
      updateTeamRequirementStatus.code === 500
    ) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearTeamRequirementUpdateStatusState());
        setShowBanner(false);
      }, 3000);
    }
  }, [updateTeamRequirementStatus, , actionType]);

  const handleCloseBanner = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      />
    );
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

  const handleRejectRequirement = (reason: string) => {
    setActionType("requirementReject");
    const payload = {
      teamRequirementID: Number(teamRequirementID),
      section: "requirement",
      status: "2",
      rejectedReason: reason,
    };
    dispatch(
      updateStatusTeamRequirement({
        url: "/UpdateTeamRequirementsStatus",
        payload,
      })
    );
  };

  const handleApproveRequirement = () => {
    setActionType("requirementApprove");
    const payload = {
      teamRequirementID: Number(teamRequirementID),
      section: "requirement",
      status: "1",
    };
    dispatch(
      updateStatusTeamRequirement({
        url: "/UpdateTeamRequirementsStatus",
        payload,
      })
    );
  };

  return (
    <>
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? snackbarMessage
              : (updateTeamRequirementStatus &&
                updateTeamRequirementStatus?.message) ||
              (updateTeamRequirementStatus &&
                updateTeamRequirementStatus?.message)
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={showBanner}
          onClose={handleCloseBanner}
        />
      )}
      {isOpenEditRequirement && (
        <SlideTeamRequirementDrawer
          open={isOpenEditRequirement}
          onClose={(event: any, reason: any) => handleCloseEdit(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
        />
      )}

      {isOpen && (
        <ShippingAddDrawer
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          teamRequirementID={teamRequirementID}
          getTeamRequirementByIDDta={getTeamRequirementByIDDta}
          setIsUpdated={setIsUpdated}
          mode={mode}
        />
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card sx={{ boxShadow: "none" }}>
            <Grid container direction="column" height="100%">
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  pl: 2,
                  pr: 2,
                  pt: 2,
                  pb: 2,
                }}
                container
                alignItems={"start"}
                justifyContent={"space-between"}
              >
                <Grid item md={8}>
                  <Box mt={1} mb={1}>
                    <Typography
                      sx={{
                        fontSize: "24px",
                        color: "#005844",
                      }}
                      className="bukra-semi-bold text-capitalize"
                    >
                      {getTeamRequirementByIDData?.requirementName ? getTeamRequirementByIDData?.requirementName : ""}
                    </Typography>
                  </Box>
                  <Box mt={1} display={"flex"} flexDirection={"column"}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "16px",
                        color: "#58585B",
                        lineHeight: "22px",
                        fontWeight: 500
                      }}
                      className="dubai-regular"
                    >
                      {" "}
                      <RenderEditorContentHtml
                        content={
                          getTeamRequirementByIDData?.description ? getTeamRequirementByIDData?.description : ""
                        }
                      />
                    </Box>
                  </Box>
                  <Box mt={1.5} display={"flex"}>
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        color: "#58585B",
                        lineHeight: "22px",
                      }}
                      className="bukra"
                    >
                      {" "}
                      Team Assigned:{" "}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "16px",
                        color: "#8D9093",
                        lineHeight: "22px",
                        paddingLeft: "5px",
                      }}
                      className="dubai-regular"
                    >
                      {" "}
                      {getTeamRequirementByIDData?.teamAssigned ? getTeamRequirementByIDData?.teamAssigned : ""}
                    </Box>
                  </Box>
                  <Box mt={1.5} display={"flex"}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "15px",
                        color: "#58585B",
                        lineHeight: "22px",
                        paddingTop: "6px",
                      }}
                      className="bukra"
                    >
                      {" "}
                      Priority Level:{" "}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        paddingLeft: "5px",
                      }}
                    >
                      <Chip
                        label={getTeamRequirementByIDData?.priorityLevel}
                        variant="outlined"
                        sx={{
                          borderColor: "E4002B",
                          border: "1px solid #E4002B",
                          borderRadius: "20px",
                          color: "#E4002B",
                          padding: "12px 12px",
                          gap: "8px",
                          backgroundColor: "rgb(248, 239, 239)",
                        }}
                        className="text-capitalize"
                      />
                    </Box>
                  </Box>
                  <Box mt={2.5} display={"flex"} alignItems={"center"}>
                    <Box
                      px={2}
                      py={1}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "6px",
                        border: "1px solid  #0087554D",
                      }}
                      width={"auto"}
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          lineHeight: "22px",
                          color: "#58585B",
                        }}
                        className="bukra"
                      >
                        Type
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#000000",
                        }}
                        className="dubai-med"
                      >
                        {getTeamRequirementByIDData?.typeValue
                          ? getTeamRequirementByIDData?.typeValue
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      px={2}
                      py={1}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid  #0087554D",
                      }}
                      width={"auto"}
                      ml={2}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          lineHeight: "24px",
                          color: "#58585B",
                        }}
                        className="bukra"
                      >
                        Quantity Required
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#000000",
                        }}
                        className="dubai-med"
                      >
                        {getTeamRequirementByIDData?.quantityRequired
                          ? getTeamRequirementByIDData?.quantityRequired
                          : "--"}
                      </Typography>
                    </Box>
                    <Box
                      px={2}
                      py={1}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid  #0087554D",
                      }}
                      width={"auto"}
                      ml={2}
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          lineHeight: "24px",
                          color: "#58585B",
                        }}
                        className="bukra"
                      >
                        Required Date
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "#000000",
                        }}
                        className="dubai-med"
                      >
                        {getTeamRequirementByIDData?.requiredDate ? getTeamRequirementByIDData?.requiredDate : "--"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={2.5} display={"flex"} flexDirection={"column"}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "15px",
                        color: "#58585B",
                        lineHeight: "22px",
                      }}
                      className="bukra"
                    >
                      {" "}
                      Justification{" "}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "16px",
                        color: "#8D9093",
                        lineHeight: "22px",
                      }}
                      className="dubai-regular"
                    >
                      {" "}
                      <RenderEditorContentHtml
                        content={
                          getTeamRequirementByIDData?.justification ? getTeamRequirementByIDData?.justification : "--"
                        }
                      />
                    </Box>
                  </Box>
                  <Box mt={2.5} display={"flex"} flexDirection={"column"}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "15px",
                        color: "#58585B",
                        lineHeight: "22px",
                      }}
                      className="bukra"
                    >
                      {" "}
                      Budget{" "}
                    </Box>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const fileUrl = getTeamRequirementByIDData?.budgetFilePath;
                        if (fileUrl) {
                          window.open(fileUrl, "_blank");
                        }
                      }}
                      sx={{
                        cursor: getTeamRequirementByIDData?.budgetFilePath
                          ? "pointer"
                          : "default",
                        paddingTop: "5px",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#05868E",
                        textDecoration: "none",
                      }}
                      className="dubai-med"
                    >
                      {getTeamRequirementByIDData?.budgetFilePath
                        ? getTeamRequirementByIDData?.budgetFilePath?.split("/").pop()
                        : ""}
                    </Link>
                  </Box>
                </Grid>
                <Grid item md={3} direction="column">
                  {checkAccess(USER_PERMISSION.TeamRequirementsApproveReject) && getTeamRequirementByIDData?.requirementStatus === 0 ? (
                    <Box display="flex" gap={1} justifyContent={"end"} pb={0}>
                      <Box
                        sx={{
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                        gap={1}
                      >
                        <Button
                          type="submit"
                          variant="outlined"
                          className="reject-button text-capitalize dubai-med"
                          onClick={() => setIsRejectRequirement(true)}
                        >
                          Reject
                        </Button>
                        <RejectRequirementDialog
                          open={isRejectRequirement}
                          onClose={() => setIsRejectRequirement(false)}
                          onReject={handleRejectRequirement}
                          getTeamRequirementByIDData={
                            getTeamRequirementByIDData
                          }
                        />
                        <Button
                          className="approve-button text-capitalize dubai-med"
                          variant="contained"
                          onClick={handleApproveRequirement}
                        >
                          Approve
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {checkAccess(USER_PERMISSION.TeamRequirementsEdit) &&
                    getTeamRequirementByIDData?.requirementStatus === 1 &&
                    getTeamRequirementByIDData?.shipmentStatusText !== "Fulfilled" ? (
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
                          backgroundColor: "#FFFFFF",
                          fontSize: "16px",
                          fontWeight: 500,
                        }}
                        label="Edit"
                        variant="outlined"
                        size="large"
                        ButtonIcon={EditIcon}
                        iconPosition="start"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleEditData(teamRequirementID);
                        }}
                        module="news"
                      />
                    </Box>
                  ) : null}
                </Grid>
              </Grid >
            </Grid >
          </Card >
        </Grid >
        {getTeamRequirementByIDData?.requirementStatusText === "Cancelled" ? (
          <Grid item xs={12} className="card-height">
            <Card sx={{ boxShadow: "none" }}>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Rejected Reason"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={getTeamRequirementByIDData?.rejectedReason}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : getTeamRequirementByIDData?.vendorName?.trim() ? (
          <Grid item xs={12} md={12} overflow={"scroll"}>
            <Card>
              <Grid container direction="column" height="100%">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  sx={{
                    pl: 2,
                    pr: 2,
                    pt: 2,
                  }}
                  container
                  alignItems={"start"}
                  justifyContent={"space-between"}
                >
                  <Grid item md={8}>
                    <Box mt={1.5} display={"flex"}>
                      <Box
                        component="span"
                        sx={{
                          color: "#008755",
                        }}
                      >
                        <MenuIcon width={"30px"} height={"30px"} />
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: "18px",
                          lineHeight: "19px",
                          paddingLeft: "5px",
                          color: "#008755",
                          paddingTop: "4px",
                        }}
                        className="bukra-semi-bold"
                      >
                        {" "}
                        Shipping Details
                      </Box>
                    </Box>
                    <Grid container spacing={2} mt={1.5}>
                      <Grid item xs={12} sm={6}>
                        <Box px={{ xs: 2, md: 4 }} py={1}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "#58585B",
                            }}
                            className="bukra"
                          >
                            Vendor Name
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "#8D9093",
                              paddingTop: "5px",
                            }}
                            className="dubai-regular"
                          >
                            {getTeamRequirementByIDData?.vendorName}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box px={2} py={1}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "#58585B",
                            }}
                            className="bukra"
                          >
                            Delivery Date
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "16px",
                              paddingTop: "5px",
                              color: "#8D9093",
                            }}
                            className="dubai-regular"
                          >
                            {getTeamRequirementByIDData?.deliveryDate}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box px={{ xs: 2, md: 4 }} py={1}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              lineHeight: "22px",
                              color: "#58585B",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "100%",
                            }}
                            className="bukra"
                          >
                            Vendor Website
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "16px",
                              paddingTop: "5px",
                              color: "#8D9093",
                            }}
                            className="dubai-regular"
                          >
                            {getTeamRequirementByIDData?.vendorWebsite}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box px={2} py={1}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="bukra"
                          >
                            Remarks
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "16px",
                              paddingTop: "5px",
                              color: "#8D9093",
                            }}
                            className="dubai-regular"
                          >
                            {getTeamRequirementByIDData?.remarks}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box px={{ xs: 2, md: 4 }} py={1} pb={3}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              lineHeight: "22px",
                              color: "#58585B",
                            }}
                            className="bukra"
                          >
                            Invoice
                          </Typography>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              downloadFile(
                                getTeamRequirementByIDData?.invoiceFilePath
                              );
                            }}
                            sx={{
                              paddingTop: "5px",
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#05868E",
                              textDecoration: "none",
                            }}
                            className="dubai-med"
                          >
                            {getTeamRequirementByIDData?.invoiceFilePath
                              ?.split("/")
                              .pop()}
                          </Link>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} direction="column">
                    {checkAccess(USER_PERMISSION.TeamRequirementsEdit) &&
                      getTeamRequirementByIDData?.shipmentStatusText !== "Fulfilled"
                      ? <Box mt={0} display={"flex"} justifyContent={"end"}>
                        <Box
                          component="span"
                          sx={{
                            fontSize: "15px",
                            color: "#58585B",
                            lineHeight: "22px",
                            paddingTop: "10px",
                          }}
                          className="bukra"
                        >
                          {" "}
                          Status{" "}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            fontSize: "15px",
                            paddingLeft: "8px",
                          }}
                        >
                          <Select
                            value={status}
                            onChange={handleChange}
                            displayEmpty
                            sx={{
                              width: "fit-content",
                              height: "37px",
                              gap: "8px",
                              borderWidth: "2px",
                              borderRadius: "16px",
                              borderColor: selectedStatus?.borderColor,
                              paddingRight: "5px",
                              paddingLeft: "5px",
                              fontSize: "14px",
                              fontWeight: 500,
                              backgroundColor: selectedStatus?.bgColor,
                              color: selectedStatus?.textColor,
                              "& .MuiSelect-icon": {
                                color: selectedStatus?.textColor,
                              },
                              "&.MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    selectedStatus?.borderColor + " !important",
                                },
                                "&:hover fieldset": {
                                  borderColor:
                                    selectedStatus?.borderColor + " !important",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor:
                                    selectedStatus?.borderColor + " !important",
                                },
                              },
                            }}
                          >
                            {statusOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Box> : null
                    }
                    {checkAccess(USER_PERMISSION.TeamRequirementsEdit) &&
                      getTeamRequirementByIDData?.shipmentStatusText !== "Fulfilled" ?
                      <Box
                        display="flex"
                        gap={1}
                        justifyContent={"end"}
                        mt={1.5}
                        pb={0}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: "#008755",
                            color: "#FFFFFF",
                            border: "1px solid #008755",
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "darkgreen",
                            },
                            paddingX: "16px",
                            minHeight: "48px",
                          }}
                          className="dubai-med"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        >
                          <SettingsOutlinedIcon width={"30px"} height={"30px"} />
                          <Typography
                            sx={{
                              fontSize: "16px",
                              lineHeight: "24px",
                              paddingLeft: "10px",
                            }}
                            className="bukra"
                          >
                            Shipping Update
                          </Typography>
                        </IconButton>
                      </Box> : null}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} md={12}>
            <Card
              sx={{
                height: "400px",
              }}
            >
              <Grid container height="100%">
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  sx={{
                    pl: 2,
                    pr: 2,
                    pt: 2,
                    pb: 2,
                  }}
                  container
                  alignItems={"start"}
                  justifyContent={"space-between"}
                >
                  <Grid item md={12}>
                    <Box mt={1.5} display={"flex"} mb={7}>
                      <Box
                        component="span"
                        sx={{
                          color: "#008755",
                        }}
                      >
                        <MenuIcon width={"30px"} height={"30px"} />
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: "18px",
                          lineHeight: "19px",
                          paddingLeft: "5px",
                          color: "#008755",
                          paddingTop: "4px",
                        }}
                        className="bukra-semi-bold"
                      >
                        {" "}
                        Shipping Details
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        textAlign: "center",
                      }}
                    >
                      <Avatar
                        src={"/team-requirements/addShippingDetails.svg"}
                        alt={"Shipping Box"}
                        sx={{
                          width: "256px",
                          height: "146px",
                          borderRadius: 1,
                        }}
                      />

                      {checkAccess(USER_PERMISSION.TeamRequirementsEdit) ? <Button
                        variant="contained"
                        sx={{
                          mt: 3,
                          bgcolor: "#008755",
                          color: "white",
                          "&:hover": { bgcolor: "#006644" },
                          textTransform: "none",
                          ml: 10,
                          "&.Mui-disabled": {
                            bgcolor: "#008755",
                            color: "white",
                            opacity: 0.6,
                          },
                        }}
                        onClick={() => {
                          setIsOpen(true);
                        }}
                        disabled={
                          getTeamRequirementByIDData?.requirementStatus !== 1
                        }
                      >
                        + Shipping Details
                      </Button> : null}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid >
    </>
  );
};

export default TeamRequirementsViewInfo;
