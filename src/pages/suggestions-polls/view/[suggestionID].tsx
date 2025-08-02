"use client";
import CustomButton from "@/components/buttons/CustomButton";
import {
  Box,
  Button,
  Typography,
  Grid,
  Skeleton,
  Chip,
  Avatar,
  Stack,
  Divider,
  SnackbarCloseReason,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import router from "next/router";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDay, getLocalStorage } from "@/utils/helper";
import { editSuggestionsAndPolls } from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsEditSlice";
import _ from "lodash";
import EditIcon from "../../../../public/EditSVG.svg";
import CustomSnackbar from "@/components/CustomSnackbar";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import {
  clearSuggestionsAndPollsDeleteState,
  deleteSuggestionsAndPolls,
} from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsDeleteSlice";
import ReusableDialog from "@/components/Fields/ReusableDialog";
import { useForm } from "react-hook-form";
import FormWithSunEditor from "@/components/useFormSunEditor";
import {
  clearStatusUpdatedState,
  StatusUpdatedDispatch,
} from "@/redux/slices/suggestionsAndPolls/StatusUpdated";
import ChatBox from "@/components/suggestions-polls/view/ChatBox";
import BackIcon from "../../../../public/backIcon.svg";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import EditPollsSlider from "@/components/suggestions-polls/edit/editSlider";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { CustomTooltip } from "@/components/tooltip/TooltipIcon";

export default function ViewPolls(props: any) {
  const { suggestionID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Suggestions & Polls",
      route: `/suggestions-polls`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/suggestions-polls/polls/view/${suggestionID}`,
      currentPage: true,
      disabled: false,
    },
  ];
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [showVoteEdit, setShowVoteEdit] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [call, setCall] = useState<any>(false);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight: any = () => {
    if (is4K) return "76.5vh";
    if (isFullHD) return "78.5vh";
    if (is3K) return "76.5vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "76.5vh";
    if (isLaptop) return "76.5vh";
    if (isTab) return "72.5vh";
    return "72.5vh";
  };
  const suggestionsAndPollsEditData = useSelector((state: any) => {
    return state.suggestionsAndPollsEdit;
  });
  const PollsDeleteData = useSelector((state: any) => {
    return state.suggestionsAndPollsDelete;
  });
  const statusUpdatedDataData = useSelector((state: any) => {
    return state.statusUpdatedData;
  });
  const suggestionsAndPollsData =
    suggestionsAndPollsEditData?.data?.[0] ?? null;
  const voteShowEdit = getLocalStorage("SHOWEDIT");
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      suggestion: "",
    },
  });
  const suggestion = watch("suggestion");

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };
  const editPayload = {
    suggestionsID: Number(suggestionID),
    section: "suggestions",
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.SuggestionPollsView)) {
      if (suggestionID) {
        dispatch(
          editSuggestionsAndPolls({
            url: "/GetPollsAndSuggestionsByID",
            payload: editPayload,
          })
        );
      }
    } else {
      router.push("/access-denied");
    }
  }, [suggestionID, isUpdated]);

  useEffect(() => {
    if (PollsDeleteData && PollsDeleteData.code === 200) {
      setTimeout(() => {
        router.push(`/suggestions-polls`);
        dispatch(clearSuggestionsAndPollsDeleteState());
      }, 2000);
    } else if (PollsDeleteData && PollsDeleteData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      dispatch(clearSuggestionsAndPollsDeleteState());
    } else if (PollsDeleteData && PollsDeleteData.code === 409) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        dispatch(clearSuggestionsAndPollsDeleteState());
      }, 2000);
    }
  }, [PollsDeleteData]);

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const RenderEditorContentHTML = ({ content }: { content: string }) => {
    if (!content) return null;
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const hadleDialopeClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (statusUpdatedDataData && statusUpdatedDataData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setSnackbarMessage("Status Updated successfully");
      setDialogOpen(false);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      setShowVoteEdit(true);
      dispatch(
        editSuggestionsAndPolls({
          url: "/GetPollsAndSuggestionsByID",
          payload: editPayload,
        })
      );
      dispatch(clearStatusUpdatedState());
    } else if (statusUpdatedDataData && statusUpdatedDataData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      dispatch(clearStatusUpdatedState());
    } else if (statusUpdatedDataData && statusUpdatedDataData.code === 409) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        dispatch(clearStatusUpdatedState());
        setSnackbarOpen(false);
      }, 2000);
    }
  }, [statusUpdatedDataData]);

  const hadleApproved = () => {
    const payload = {
      suggestionsID: Number(suggestionID),
      section: "suggestions",

      status: 1,
    };
    dispatch(
      StatusUpdatedDispatch({ url: "/UpdPollsAndSuggStatus", payload: payload })
    );
  };

  const stripHtmlTags = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const suggestionFilter = stripHtmlTags(
    suggestionsAndPollsData?.suggestion
  ).trim();

  const handleConfirm = (data: any) => {
    const newErrors: any = {};
    const suggestionText = stripHtmlTags(data.suggestion).trim();
    if (_.isEmpty(suggestionText)) {
      newErrors.suggestion = "Suggestion is required";
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const payload = {
        suggestionsID: Number(suggestionID),
        section: "suggestions",

        status: 2,
      };
      dispatch(
        StatusUpdatedDispatch({
          url: "/UpdPollsAndSuggStatus",
          payload: payload,
        })
      );
    }
  };

  return (
    <Box p={1}>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={snackbarMessage}
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      {isOpen && (
        <EditPollsSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={"suggestion"}
        />
      )}
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
            onClick={() => {
              router.back();
            }}
          />
        </Box>
      </Grid>
      <ReusableDialog
        maxWidth="xl"
        open={dialogOpen}
        onClose={hadleDialopeClose}
        title="Reject Reason"
        actions={
          <Grid
            container
            spacing={1}
            mt={1}
            gap={2}
            width={"550px"}
            justifyContent="flex-end"
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={2} // adds space between buttons
            >
              <Button
                onClick={hadleDialopeClose}
                variant="outlined"
                color="secondary"
                className="dubai-med"
                sx={{
                  width: "73px",
                  height: "44px",
                  borderRadius: "4px",
                  borderWidth: "1px",
                  borderColor: "rgba(88, 88, 91, 1)",
                  paddingTop: "14px",
                  paddingRight: "16px",
                  paddingBottom: "14px",
                  paddingLeft: "16px",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  textTransform: "none",
                  color: "rgba(88, 88, 91, 1)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(handleConfirm)}
                variant="contained"
                color="secondary"
                className="dubai-med"
                sx={{
                  width: "73px",
                  height: "44px",
                  borderRadius: "4px",
                  borderWidth: "1px",
                  borderColor: "rgba(88, 88, 91, 1)",
                  paddingTop: "14px",
                  paddingRight: "16px",
                  paddingBottom: "14px",
                  paddingLeft: "16px",
                  backgroundColor: "rgba(88, 88, 91, 1)",
                  textTransform: "none",
                  color: "rgba(255, 255, 255, 1)",
                }}
                disabled={!suggestion}
              >
                Confirm
              </Button>
            </Box>
          </Grid>
        }
      >
        <FormWithSunEditor
          name="suggestion"
          control={control}
          minHeight={"200px"}
          module={"Suggestion"}
        />

        {errors.suggestion && (
          <Typography variant="caption" className="error-message">
            {errors.suggestion}
          </Typography>
        )}
      </ReusableDialog>
      {!call &&
      suggestionsAndPollsEditData &&
      suggestionsAndPollsEditData.loading ? (
        <Grid
          container
          className="bg-white"
          mt={1}
          p={5}
          sx={{ height: "80vh", overflow: "scroll" }}
        >
          <Grid item xs={8} />
          <Grid item xs={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "30%" }} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "50%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "30%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={12}
            md={12}
            height={"80vh"}
            className="bg-white"
            mt={1}
            sx={{ placeContent: "center", placeItems: "center" }}
          >
            <Box
              p={2}
              sx={{
                width: 971,
                borderRadius: "16px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(38, 208, 124, 1)",
              }}
            >
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={7}>
                  <Box display={"flex"} alignItems={"center"}>
                    {suggestionsAndPollsData &&
                    !_.isEmpty(suggestionsAndPollsData?.sportsList)
                      ? suggestionsAndPollsData?.sportsList
                          ?.slice(0, 3)
                          .map((item: any) => (
                            <Chip
                              key={item?.sportName}
                              label={item?.sportName}
                              icon={
                                <img
                                  src={item?.sportProfile}
                                  style={{
                                    width: "20px",
                                    height: "16px",
                                    paddingTop: "4px",
                                    objectFit: "cover",
                                  }}
                                  alt={item?.sportName}
                                />
                              }
                              sx={{
                                padding: "0px",
                                fontWeight: 500,
                                fontSize: "16px",
                                backgroundColor: "rgba(0, 135, 85, 0.03)",
                                color: "#008755",
                                lineHeight: "18px",
                                height: "24px",
                                ".MuiChip-label": {
                                  padding: "8px",
                                },
                                border: "1px solid #008755",
                                mr: 1,
                              }}
                              className="dubai-med webkit-line-clamp webkit-1"
                            />
                          ))
                      : null}
                    {suggestionsAndPollsData?.sportsList?.length > 3 && (
                      <CustomTooltip
                        title={
                          <div
                            style={{
                              backgroundColor: "white",
                              borderRadius: 8,
                              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                              padding: "8px 0",
                              maxHeight:
                                suggestionsAndPollsData.sportsList.length > 8
                                  ? "220px"
                                  : "auto",
                              overflowY:
                                suggestionsAndPollsData.sportsList.length > 8
                                  ? "auto"
                                  : "visible",
                              width: "220px",
                            }}
                          >
                            {suggestionsAndPollsData.sportsList
                              .slice(3)
                              .map((item: any, index: number, arr: any[]) => (
                                <div
                                  key={item?.sportName}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    gap: "8px",
                                    cursor: "pointer",
                                    transition: "background 0.2s ease-in-out",
                                    borderBottom:
                                      index !== arr.length - 1
                                        ? "1px solid #eee"
                                        : "none", // ← Separator line
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLDivElement
                                    ).style.backgroundColor = "#f7f7f7";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLDivElement
                                    ).style.backgroundColor = "transparent";
                                  }}
                                >
                                  <img
                                    src={item?.sportProfile}
                                    alt={item?.sportName}
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#008755",
                                      fontWeight: 500,
                                    }}
                                    className="dubai-med"
                                  >
                                    {item?.sportName}
                                  </span>
                                </div>
                              ))}
                          </div>
                        }
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#e0f7ec",
                            color: "#008755",
                            fontSize: "0.875rem",
                            width: 30,
                            height: 25,
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          +{suggestionsAndPollsData?.sportsList.length - 3}
                        </Avatar>
                      </CustomTooltip>
                    )}
                  </Box>
                  <Box
                    className="dubai-regular"
                    fontSize={"18px"}
                    mt={2}
                    color={"#58585B"}
                  >
                    Created by {suggestionsAndPollsData?.createdByModule}
                  </Box>
                  <Box mt={1} display={"flex"} alignItems={"center"}>
                    <Avatar
                      // alt="Dubai Police Team"
                      src={`${
                        suggestionsAndPollsData?.createdProfileimage
                          ? suggestionsAndPollsData?.createdProfileimage
                          : "/path-to-user-image.jpg}"
                      }`}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "rgba(0, 135, 85, 1)",
                        borderColor: "rgba(0, 135, 85, 1) !important",
                      }}
                    />
                    <Typography
                      className="bukra-semi-bold"
                      fontSize={"12px"}
                      sx={{ ml: 1 }}
                    >
                      {`${suggestionsAndPollsData?.createdFirstname}${suggestionsAndPollsData?.createdMiddlename}${suggestionsAndPollsData?.createdSurname}`}
                      <span style={{ fontWeight: 500, color: "#58585B" }}>
                        ({suggestionsAndPollsData?.createdByModule} )
                      </span>
                    </Typography>
                    <Typography
                      className="bukra-semi-bold"
                      fontSize={"12px"}
                      sx={{
                        marginLeft: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {formatDay(suggestionsAndPollsData?.createdDate)}
                      </span>
                    </Typography>
                  </Box>
                  <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                    sx={{
                      top: "310px",
                      left: "319px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "rgba(38, 208, 124, 1)",
                      backgroundColor: "rgba(38, 208, 124, 0.06)",
                      gap: "8px",
                      padding: "16px",
                    }}
                  >
                    <Typography
                      className="dubai-med"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 6,
                        overflow: "hidden",
                      }}
                    >
                      <RenderEditorContentHTML
                        content={suggestionsAndPollsData?.suggestion}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box
                    p={1}
                    className="bg-white"
                    borderRadius={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    minHeight="100%"
                  >
                    {/* {suggestionsAndPollsData?.statusText === "Rejected" ? (
                      <Chip
                        label={suggestionsAndPollsData?.statusText}
                        color="success"
                        className="dubai-med"
                        sx={{
                          width: "100px",
                          height: "44px",
                          borderRadius: "4px",
                          color:
                            suggestionsAndPollsData?.statusText === "Rejected"
                              ? "rgba(228, 0, 43, 1)"
                              : "rgba(0, 135, 85, 1)",
                          borderColor:
                            suggestionsAndPollsData?.statusText === "Rejected"
                              ? "rgba(228, 0, 43, 1)"
                              : "rgba(0, 135, 85, 1)",
                          backgroundColor:
                            suggestionsAndPollsData?.statusText === "Rejected"
                              ? "rgba(254, 245, 247, 1)"
                              : "rgba(229, 255, 246, 1)",
                          padding: 1,
                        }}
                      />
                    ) : ( */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="end"
                      justifyContent="flex-end"
                    >
                      {/* {suggestionsAndPollsData?.statusText === "Approved" ? (
                          <Chip
                            label="Approved"
                            color="success"
                            className="dubai-med"
                            sx={{
                              width: "100px",
                              height: "44px",
                              borderRadius: "4px",
                              color: "rgba(0, 135, 85, 1)",
                              borderColor: "rgba(0, 135, 85, 1)",
                              backgroundColor: "rgba(229, 255, 246, 1)",
                              padding: 1,
                            }}
                          />
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              color="secondary"
                              className="dubai-med"
                              sx={{
                                width: "73px",
                                height: "44px",
                                borderRadius: "4px",
                                borderWidth: "1px",
                                borderColor: "rgba(88, 88, 91, 1)",
                                paddingTop: "14px",
                                paddingRight: "16px",
                                paddingBottom: "14px",
                                paddingLeft: "16px",
                                backgroundColor: "rgba(255, 255, 255, 1)",
                                textTransform: "none",
                                color: "rgba(88, 88, 91, 1)",
                              }}
                              onClick={() => {
                                setDialogOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                            <LoadingButton
                              variant="contained"
                              color="secondary"
                              className="dubai-med"
                              sx={{
                                width: "73px",
                                height: "44px",
                                borderRadius: "4px",
                                borderWidth: "1px",
                                paddingTop: "14px",
                                paddingRight: "16px",
                                paddingBottom: "14px",
                                paddingLeft: "16px",
                                backgroundColor: "rgba(0, 135, 85, 1)",
                                textTransform: "none",
                              }}
                              loading={statusUpdatedDataData?.loading}
                              disabled={statusUpdatedDataData?.loading}
                              onClick={() => {
                                hadleApproved();
                              }}
                            >
                              Approve
                            </LoadingButton>
                          </>
                        )} */}
                      {checkAccess(USER_PERMISSION.SuggestionPollsEdit) && (
                        <CustomButton
                          label="Edit"
                          variant="outlined"
                          size="large"
                          ButtonIcon={EditIcon}
                          iconPosition="start"
                          onClick={() => handleEditData(suggestionID)}
                        />
                      )}
                      {checkAccess(USER_PERMISSION.SuggestionPollsDelete) && (
                        <ReusableDeleteDialog
                          btnLabel="Delete"
                          btnBgColor=""
                          btnBorderColor="rgba(88, 88, 91, 1)"
                          btnColor="rgba(88, 88, 91, 1)"
                          buttonIcon
                          title="Suggestions"
                          confirmationMessage="Are you sure you want to delete?"
                          successMessage="Suggestions Deleted Successfully"
                          name={suggestionFilter}
                          icon={
                            <DeleteIcon sx={{ color: "rgba(88, 88, 91, 1)" }} />
                          }
                          revertMessage="Once the suggestion is deleted, you cannot revert it."
                          deleteAction={(payload: any) =>
                            dispatch(
                              deleteSuggestionsAndPolls({
                                url: "/DeletePollsAndSuggestionsByID",
                                payload,
                              })
                            )
                          }
                          fetchAfterDelete={() => {
                            const payload = {
                              suggestionsID: Number(suggestionID),
                              section: "suggestions",
                            };
                            dispatch(
                              editSuggestionsAndPolls({
                                url: "/GetPollsAndSuggestionsByID",
                                payload,
                              })
                            );
                          }}
                          deleteResponse={PollsDeleteData}
                          clearDeleteState={() =>
                            dispatch(clearSuggestionsAndPollsDeleteState())
                          }
                          payload={{
                            suggestionsID: Number(suggestionID),
                            section: "suggestions",
                          }}
                        />
                      )}
                    </Stack>
                    {/* )} */}
                  </Box>
                </Grid>
              </Grid>
              <Divider
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  color: "rgba(38, 208, 124, 1)",
                  borderColor: "rgba(38, 208, 124, 1)",
                }}
              />
              <Stack spacing={2}>
                <Typography
                  mb={1}
                  className="bukra"
                  sx={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    color: "rgba(0, 0, 0, 1)",
                    transition: "color 0.3s ease-in-out",
                    fontWeight: "500",
                  }}
                >
                  {suggestionsAndPollsData &&
                    suggestionsAndPollsData?.pollsQuestion}
                </Typography>
                <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "300px" }}>
                  <ChatBox
                    suggestionsAndPollsData={suggestionsAndPollsData}
                    editPayload={editPayload}
                    setCall={setCall}
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </>
      )}
    </Box>
  );
}
