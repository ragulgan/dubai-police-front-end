"use client";
import CustomButton from "@/components/buttons/CustomButton";
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Chip,
  Avatar,
  Stack,
  Divider,
  SnackbarCloseReason,
  LinearProgress,
  Tooltip,
  Button,
} from "@mui/material";
import router from "next/router";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  formatCount,
  formatDay,
  getLocalStorage,
  getTokenData,
  setLocalStorage,
  unsetLocalStorage,
} from "@/utils/helper";
import { editSuggestionsAndPolls } from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsEditSlice";
import _ from "lodash";
import EditIcon from "../../../../public/EditSVG.svg";
import EditWhiteIcon from "../../../../public/Edit-white.svg";
import EditPollsSlider from "../edit/editSlider";
import VoteIcon from "../../../../public/vote.svg";
import {
  addVoteDispatch,
  clearVoteAddState,
} from "@/redux/slices/suggestionsAndPolls/VoteAddSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import {
  clearSuggestionsAndPollsDeleteState,
  deleteSuggestionsAndPolls,
} from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsDeleteSlice";
import moment from "moment";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { CustomTooltip } from "@/components/tooltip/TooltipIcon";

export default function ViewPolls(props: any) {
  const { pollsID } = router.query;
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [showVoteEdit, setShowVoteEdit] = useState<boolean>(false);
  const [showVoteupdate, setShowVoteupdate] = useState<any>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const suggestionsAndPollsEditData = useSelector((state: any) => {
    return state.suggestionsAndPollsEdit;
  });
  const AddVotesData = useSelector((state: any) => {
    return state.voteAddList;
  });
  const PollsDeleteData = useSelector((state: any) => {
    return state.suggestionsAndPollsDelete;
  });
  const suggestionsAndPollsData =
    suggestionsAndPollsEditData?.data?.[0] ?? null;
  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };
  const loginData = getTokenData();
  useEffect(() => {
    if (
      suggestionsAndPollsData?.userVoteType === "Voted" ||
      suggestionsAndPollsData?.userVoteType === "Ended"
    ) {
      // setShowVoteupdate(true);
      setShowVoteEdit(true);
    } else {
      setShowVoteupdate(false);
      setShowVoteEdit(false);
    }
  }, [suggestionsAndPollsData]);

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const editPayload = {
    pollsID: Number(pollsID),
    section: "polls",
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.SuggestionPollsView)) {
      if (pollsID) {
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
  }, [pollsID, isUpdated]);

  const handleVote = () => {
    if (selectedOption) {
      const payload = {
        pollVotes: selectedOption,
        votedUserID: loginData?.userID,
        votedUserModule: loginData?.roleValue,
        roleModule: "",
      };
      dispatch(
        addVoteDispatch({
          // url: showVoteupdate ? "/UpdatePollsVotesByIDSS" : "/InsertPollsVotes",
          url: "/InsertPollsVotes",
          payload: payload,
        })
      );
    }
  };

  const handleVoteEdit = () => {
    setShowVoteEdit(false);
    setShowVoteupdate(true);
  };

  useEffect(() => {
    if (AddVotesData && AddVotesData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      setShowVoteEdit(true);
      setSnackbarMessage(
        `Votes ${showVoteupdate ? "Updated" : "Added"} Successfully`
      );
      dispatch(
        editSuggestionsAndPolls({
          url: "/GetPollsAndSuggestionsByID",
          payload: editPayload,
        })
      );
      setShowVoteupdate(false);
      dispatch(clearVoteAddState());
    } else if (AddVotesData && AddVotesData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      dispatch(clearVoteAddState());
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    } else if (AddVotesData && AddVotesData.code === 409) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        dispatch(clearVoteAddState());
        setSnackbarOpen(false);
      }, 2000);
    }
  }, [AddVotesData]);

  useEffect(() => {
    if (PollsDeleteData && PollsDeleteData.code === 200) {
      setTimeout(() => {
        router.back();
        dispatch(clearSuggestionsAndPollsDeleteState());
      }, 1000);
    } else if (PollsDeleteData && PollsDeleteData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      dispatch(clearSuggestionsAndPollsDeleteState());
    } else if (PollsDeleteData && PollsDeleteData.code === 409) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setSnackbarMessage("Error");
      setTimeout(() => {
        dispatch(clearSuggestionsAndPollsDeleteState());
        setSnackbarOpen(false);
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
  const isPastDate =
    suggestionsAndPollsData?.endDate &&
    moment(suggestionsAndPollsData.endDate, "DD/MM/YYYY").isBefore(
      moment(),
      "day"
    );

  useEffect(() => {
    if (suggestionsAndPollsData?.pollVotesList) {
      const votedOptions = suggestionsAndPollsData.pollVotesList.filter(
        (item: any) => item.voteType === "Voted"
      );
      const data = votedOptions.map((item: any) => ({
        pollsQuestionID: pollsID,
        pollsOptionID: item.pollsOptionID,
      }));
      setSelectedOption(data);
    }
  }, [suggestionsAndPollsData]);

  return (
    <>
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
          module={"mou"}
        />
      )}
      {suggestionsAndPollsEditData && suggestionsAndPollsEditData.loading ? (
        <Grid
          container
          mt={0.5}
          p={5}
          sx={{ marginTop: 0.5, height: "80vh", overflow: "scroll" }}
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
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
            className="bg-white"
          >
            <Box
              className="bg-white"
              p={2}
              sx={{
                width: 971,
                // height: 819,
                borderRadius: "16px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(38, 208, 124, 1)",
              }}
            >
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={6}>
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
                    className="dubai-med"
                    fontSize={"18px"}
                    fontWeight={400}
                    mt={2}
                    color={"#58585B"}
                  >
                    Created by
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
                      className="bukra"
                      fontSize={"12px"}
                      fontWeight={600}
                      sx={{ ml: 1 }}
                    >
                      {`${suggestionsAndPollsData?.createdFirstname}${suggestionsAndPollsData?.createdMiddlename}${suggestionsAndPollsData?.createdSurname}`}
                    </Typography>
                    <Typography
                      className="bukra"
                      fontSize="12px"
                      fontWeight={500}
                      sx={{ color: "#58585B", ml: 0.5, flexShrink: 0 }}
                    >
                      ({suggestionsAndPollsData?.createdByModule})
                    </Typography>
                    <Typography
                      className="bukra"
                      fontSize={"12px"}
                      fontWeight={600}
                      sx={{
                        // ml: "auto"
                        marginLeft: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {formatDay(suggestionsAndPollsData?.createdDate)}
                      </span>
                    </Typography>
                  </Box>
                  <Box mt={2} display={"flex"} alignItems={"center"}>
                    <Typography
                      className="bukra"
                      fontSize={"12px"}
                      fontWeight={600}
                    >
                      Start Date :{" "}
                      <span style={{ fontWeight: 500 }}>
                        {formatDay(suggestionsAndPollsData?.startDate)}
                      </span>
                    </Typography>
                    <Typography
                      className="bukra"
                      fontSize={"12px"}
                      fontWeight={600}
                      sx={{
                        marginLeft: "10px",
                      }}
                    >
                      End Date :{" "}
                      <span style={{ fontWeight: 500 }}>
                        {formatDay(suggestionsAndPollsData?.endDate)}
                      </span>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    p={1}
                    className="bg-white"
                    borderRadius={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    minHeight="100%"
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="end"
                      justifyContent="flex-end"
                    >
                      {checkAccess(USER_PERMISSION.SuggestionPollsEdit) && (
                        <CustomButton
                          label={"Edit"}
                          variant="outlined"
                          size="large"
                          ButtonIcon={EditIcon}
                          iconPosition="start"
                          onClick={() => {
                            handleEditData(pollsID);
                          }}
                        />
                      )}
                      {checkAccess(USER_PERMISSION.SuggestionPollsDelete) && (
                        <ReusableDeleteDialog
                          btnLabel={"Delete"}
                          btnBgColor={""}
                          btnBorderColor={"rgba(88, 88, 91, 1)"}
                          btnColor={"rgba(88, 88, 91, 1)"}
                          buttonIcon={true}
                          title={`Delete Polls`}
                          confirmationMessage="Are you sure, Do you want to delete?"
                          successMessage="Polls Deleted Successfully"
                          name={suggestionsAndPollsData?.pollsQuestion}
                          icon={
                            <DeleteIcon sx={{ color: "rgba(88, 88, 91, 1)" }} />
                          }
                          revertMessage={`Once the Polls is deleted, you cannot not revert.`}
                          deleteAction={(payload: any) =>
                            dispatch(
                              deleteSuggestionsAndPolls({
                                url: "/DeletePollsAndSuggestionsByID",
                                payload,
                              })
                            )
                          }
                          fetchAfterDelete={() => {
                            const payload: any = {
                              pollsID: Number(pollsID),
                              section: "polls",
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
                            pollsID: Number(pollsID),
                            section: "polls",
                          }}
                        />
                      )}
                    </Stack>
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
                  className="bukra"
                  sx={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    color: "rgba(0, 0, 0, 1)",
                    transition: "color 0.3s ease-in-out",
                    fontWeight: "500",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Show up to 2 lines before ellipsis
                    overflow: "hidden",
                  }}
                >
                  {suggestionsAndPollsData?.pollsQuestion}
                </Typography>
                {suggestionsAndPollsData?.pollVotesList &&
                  suggestionsAndPollsData.pollVotesList.map(
                    (item: any, index: number) => (
                      <Box
                        key={item.pollsOptionID}
                        p={2}
                        borderRadius={2}
                        sx={{
                          backgroundColor: showVoteEdit
                            ? "white"
                            : showVoteupdate
                            ? Array.isArray(selectedOption) &&
                              selectedOption.some(
                                (sel: any) =>
                                  (sel.pollsOptionID ?? sel.pollsOptionID) ===
                                  item.pollsOptionID
                              )
                              ? "rgba(0, 135, 85, 1)"
                              : "rgba(38, 208, 124, 0.1)"
                            : (Array.isArray(selectedOption) &&
                                selectedOption.some(
                                  (sel: any) =>
                                    (sel.pollsOptionID ?? sel.pollsOptionID) ===
                                    item.pollsOptionID
                                )) ||
                              item.voteType === "Voted" ||
                              item.voteType === "Ended"
                            ? "rgba(0, 135, 85, 1)"
                            : "rgba(38, 208, 124, 0.1)",

                          color: showVoteEdit
                            ? "white"
                            : (Array.isArray(selectedOption) &&
                                selectedOption?.some(
                                  (sel: any) =>
                                    sel?.pollsOptionID === item.pollsOptionID
                                )) ||
                              item.voteType === "Voted" ||
                              item.voteType === "Ended"
                            ? "white"
                            : "black",
                          transition: "all 0.3s ease-in-out",
                          cursor: isPastDate ? "" : "pointer",
                          "&:hover": {
                            backgroundColor: showVoteEdit
                              ? "white"
                              : "rgba(0, 135, 85, 1)",
                            color: "white",
                          },
                          border: showVoteEdit
                            ? "white"
                            : "1px solid rgba(38, 208, 124, 1)",
                          height: showVoteEdit ? "100px" : "",
                        }}
                        onClick={() =>
                          setSelectedOption((prevSelected: any) => {
                            if (!isPastDate) {
                              const selectedArray = Array.isArray(prevSelected)
                                ? prevSelected
                                : [];

                              // Always normalize data to lowercase keys
                              const normalizedSelected = selectedArray.map(
                                (item: any) => ({
                                  pollsOptionID:
                                    item.pollsOptionID ?? item.pollsOptionID,
                                  pollsQuestionID: item.pollsQuestionID,
                                })
                              );

                              const isAlreadySelected = normalizedSelected.some(
                                (sel: any) =>
                                  sel.pollsOptionID === item.pollsOptionID
                              );

                              if (
                                suggestionsAndPollsData?.multipleChoice ===
                                true
                              ) {
                                if (isAlreadySelected) {
                                  // Remove if already selected
                                  return normalizedSelected.filter(
                                    (sel: any) =>
                                      sel.pollsOptionID !== item.pollsOptionID
                                  );
                                } else {
                                  return [
                                    ...normalizedSelected,
                                    {
                                      pollsOptionID: item.pollsOptionID,
                                      pollsQuestionID: pollsID,
                                    },
                                  ];
                                }
                              } else {
                                // Single choice: override existing with only this one
                                return [
                                  {
                                    pollsOptionID: item.pollsOptionID,
                                    pollsQuestionID: pollsID,
                                  },
                                ];
                              }
                            }
                            return prevSelected;
                          })
                        }
                      >
                        {showVoteEdit ? (
                          <>
                            <Typography
                              className="dubai-med"
                              sx={{
                                fontSize: "20px",
                                lineHeight: "30px",
                                letterSpacing: "0%",
                                color: showVoteEdit
                                  ? "rgba(0, 0, 0, 1)"
                                  : selectedOption === item.pollsOptionID
                                  ? "white"
                                  : "rgba(0, 0, 0, 1)",
                                transition: "color 0.3s ease-in-out",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                "&:hover": {
                                  color: "black",
                                },
                              }}
                            >
                              {index + 1}. {item.pollsOptionName}
                            </Typography>
                            <Box
                              m={1.5}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              // flexWrap="wrap"
                              width="100%"
                            >
                              <LinearProgress
                                key={index}
                                variant="determinate"
                                value={item.percentage}
                                sx={{
                                  height: "15px",
                                  width: "100%",
                                  border: "1px solid rgba(38, 208, 124, 1)",
                                  backgroundColor: "rgba(38, 208, 124, 0.15)",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor:
                                      Number(item.percentage) != null &&
                                      Number(item.percentage) >= 0 &&
                                      Number(item.percentage) <= 100
                                        ? "rgba(0, 135, 85, 1)"
                                        : "rgba(38, 208, 124, 0.15)",
                                  },
                                  color: "rgba(38, 208, 124, 1)",
                                  //  borderTopRightRadius: index === 2 ? "3px" : 0,
                                  //  borderBottomRightRadius: index === 2 ? "3px" : 0,
                                  //  borderTopLeftRadius: index === 0 ? "3px" : 0,
                                  //  borderBottomLeftRadius: index === 0 ? "3px" : 0,
                                  borderRadius: "200px",
                                }}
                                className="linear-progress-polls"
                              />
                              <Typography
                                variant="body2"
                                className="dubai-med"
                                sx={{ minWidth: "40px", color: "#000" }}
                              >
                                {item.percentage}%
                              </Typography>
                              <Typography
                                variant="body2"
                                className="dubai-med"
                                sx={{ whiteSpace: "nowrap", color: "#000" }}
                              >
                                Count ({formatCount(item.voteCount)})
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <Typography
                            fontWeight={500}
                            mb={1}
                            className="dubai-med"
                            sx={{
                              fontSize: "20px",
                              lineHeight: "30px",
                              letterSpacing: "0%",
                              color:
                                Array.isArray(selectedOption) &&
                                selectedOption.includes(item.pollsOptionID)
                                  ? "white"
                                  : "rgba(0, 0, 0, 1)",
                              transition: "color 0.3s ease-in-out",
                              "&:hover": {
                                color: "white",
                              },
                            }}
                          >
                            {index + 1}. {item.pollsOptionName}{" "}
                            {item.count ? item.count : null}
                          </Typography>
                        )}
                      </Box>
                    )
                  )}
              </Stack>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
                mt={10}
              >
                {showVoteupdate && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      mr: 1,
                      height: "48px",
                    }}
                    onClick={() => {
                      setShowVoteupdate(false);
                      setShowVoteEdit(true);
                      dispatch(
                        editSuggestionsAndPolls({
                          url: "/GetPollsAndSuggestionsByID",
                          payload: editPayload,
                        })
                      );
                    }}
                    className="text-capitalize dubai-med"
                  >
                    Cancel
                  </Button>
                )}
                {(checkAccess(USER_PERMISSION.SuggestionPollsEdit) ||
                  checkAccess(USER_PERMISSION.SuggestionPollsView)) &&
                  !isPastDate && (
                    <CustomButton
                      sx={{
                        height: "48px",
                        borderRadius: "4px",
                        padding: "12px 15px",
                        fontSize: "18px",
                        fontWeight: 500,
                        gap: "10px",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(0, 135, 85, 1)",
                          color: "white",
                        },
                      }}
                      label={
                        AddVotesData && AddVotesData.loading
                          ? "..."
                          : showVoteEdit
                          ? "Edit Vote"
                          : showVoteupdate
                          ? "Update Vote"
                          : "Vote"
                      }
                      variant="contained"
                      size="large"
                      ButtonIcon={showVoteEdit ? EditWhiteIcon : VoteIcon}
                      iconPosition="start"
                      onClick={showVoteEdit ? handleVoteEdit : handleVote}
                    />
                  )}
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </>
  );
}
