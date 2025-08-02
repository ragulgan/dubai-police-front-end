"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomRadioGroup from "../../Fields/CustomRadioGroup";
import TrainingCampCustomDatePicker from "../../../components/trainingCamp/trainingCampCustomDatePicker";
import moment from "moment";
import FormWithSunEditor from "@/components/useFormSunEditor";
import {
  Button,
  Typography,
  CircularProgress,
  SnackbarCloseReason,
  Fade,
  FormControl,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import _, { isArray } from "lodash";
import { getLocalStorage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import DropDown from "@/components/Fields/DropDown";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import {
  updateRewards,
  clearRewardsUpdateState,
} from "@/redux/slices/rewards/rewardsUpdateSlice";
import {
  addRewards,
  clearAddState,
} from "@/redux/slices/rewards/rewardsAddSlice";
import { RewardsDropdownList } from "@/redux/slices/rewards/rewardsDropdownList";
import { eventDropdownList } from "@/redux/slices/rewards/eventList";
import CustomSnackbar from "@/components/CustomSnackbar";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import dayjs from "dayjs";
import { clearEditState } from "@/redux/slices/rewards/rewardsEditSlice";
import { usePathname } from "next/navigation";
import { getNotificationModuleByID } from "@/redux/slices/notification/getNotificationModuleByID";
import { addNotification } from "@/redux/slices/notification/NotificationAddSlice";

import { competitionDropdownList } from "@/redux/slices/rewards/competitionList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactSelect from "./CustomRewardsReactSelect";

const RewardsAdd = (props: any) => {
  const { edit, id, onClose, setIsUpdated, rewardsEditresponse } = props;
  const router = useRouter();
  const pathName = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const { teamID } = router.query;
  const getCurrentSport: any = getLocalStorage("sport");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [sportsName, setSportsName] = useState<any>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [athleteDataOption, setAthleteDataOption] = useState<any>("");
  const [rewardsDataOption, setRewardsDataOption] = useState<any>("");
  const [eventDataOption, setEventDataOption] = useState<any>("");
  const [competitionDataOption, setCompetitionDataOption] = useState<any>("");
  const [filterRewardsList, setFilterRewardsList] = useState<any>("");
  const [isRewardError, setIsRewardError] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);
  const [SelectedRewardsOption, setSelectedRewardsOption] =
    useState<any>(null);
  const getAthleteList = useSelector((state: any) => {
    return state.getAthleteList?.data;
  });
  const rewardDropdownList = useSelector((state: any) => {
    return state.rewardDropdownList?.data;
  });
  const eventList = useSelector((state: any) => {
    return state.eventList?.data;
  });

  const competitionList = useSelector((state: any) => {
    return state.competitionList?.data;
  });

  const rewardsAddresponse = useSelector((state: any) => {
    return state.rewardsAdd;
  });
  const rewardsUpdateresponse = useSelector((state: any) => {
    return state.rewardsUpdate;
  });
  const getSportList = useSelector((state: RootState) => state.getSportList);

  const [notificationMessage, setNotificationMessage] = useState("");
  const GetNotificationModuleByIDData = useSelector((state: any) => {
    return state.getNotificationModuleByID;
  });

  const rewardsTypeList = useSelector((state: RootState) => state?.getRewardsTypeList && Number(state?.getRewardsTypeList?.code) === 200 ? state?.getRewardsTypeList.data : null);

  React.useEffect(() => {
    if (process.env.ENABLE_NOTIFICATION === "yes") {
      const payload: any = {
        moduleID: "129",
      };
      dispatch(
        getNotificationModuleByID({
          url: "/GetNotificationModuleByID",
          payload: payload,
        })
      );
    }
  }, []);

  React.useEffect(() => {
    if (
      GetNotificationModuleByIDData &&
      GetNotificationModuleByIDData?.code === 200
    ) {
      setNotificationMessage(GetNotificationModuleByIDData?.data[0]?.message);
    } else if (GetNotificationModuleByIDData?.code !== 200) {
      // console.error(
      //   "Failed to fetch data:",
      //   GetNotificationModuleByIDData?.message
      // );
    }
  }, [GetNotificationModuleByIDData]);

  const { handleSubmit, control, setValue, reset, watch, setError, clearErrors } = useForm<any>({
    defaultValues: {
      rewardName: null,
      rewardType: "Athlete",
      athleteName: null,
      raceOrEventSection: "event",
      raceOrEvent: null,
      dateOfAward: null,
      reward: [],
      result: null,
      remarks: null,
      priceMoney: "",
      other: ""
    },
  });
  const rewardType = watch("rewardType");
  const athleteName = watch("athleteName");
  const dateOfAward = watch("dateOfAward");
  const rewardName = watch("rewardName");

  const raceOrEventSection = watch("raceOrEventSection");

  const clearData = () => {
    reset({
      rewardName: "",
      rewardType: "",
      athleteName: "",
      raceOrEventSection: "",
      raceOrEvent: "",
      dateOfAward: null,
      reward: "",
      result: "",
      remarks: null,
      priceMoney: "",
      other: ""
    });
  };

  const handleCancel = () => {
    if (edit) {
      onClose();
      clearData();
      if (pathName?.split("/")[4] !== "view") {
        dispatch(clearEditState());
      }
    } else {
      router.push(`/teams/${getCurrentSport}/rewards`);
      clearData();
      dispatch(clearEditState());
    }
  };

  const getSelectedTournament = (selectedOption: any | null): void => {
    setValue("reward", "");
    if (selectedOption) {
      let filteredRewards: any[] = [];
      if (selectedOption?.eventType) {
        filteredRewards = rewardsDataOption?.filter(
          (reward: any) =>
            reward?.type?.toLowerCase() ===
            selectedOption?.eventType.toLowerCase()
        );
      } else if (selectedOption?.tournamentType) {
        filteredRewards = rewardsDataOption?.filter(
          (reward: any) =>
            reward?.type?.toLowerCase() ===
            selectedOption?.tournamentType.toLowerCase()
        );
      }
      setFilterRewardsList(filteredRewards);
    }
  };

  useEffect(() => {
    if (raceOrEventSection === "event") {
      setDropdownOptions(eventDataOption || []);
    }
    if (raceOrEventSection === "competition") {
      setDropdownOptions(competitionDataOption || []);
    }
  }, [raceOrEventSection, eventDataOption, competitionDataOption]);

  const onSubmit = (data: any) => {
    const isRewardEmpty = !data.reward || data.reward.length === 0;
    const isPriceMoneyEmpty = !data.priceMoney?.trim();
    const isOtherEmpty = !data.other?.trim();
    setIsRewardError(isRewardEmpty)
    if (isRewardEmpty && isPriceMoneyEmpty && isOtherEmpty) {
      setError("reward", { type: "manual", message: "" });
      setError("priceMoney", { type: "manual", message: "" });
      setError("other", { type: "manual", message: "" });
      return;
    }

    clearErrors(["reward", "priceMoney", "other"]);

    if (edit) {
      const updatePayload: any = {
        rewardName: data?.rewardName,
        rewardType: data?.rewardType,
        athleteName:
          data?.rewardType === "Team"
            ? `${sportsName && sportsName?.sportName} Team`
            : String(data?.athleteName),
        raceOrEvent: String(data?.raceOrEvent),
        raceOrEventSection: data?.raceOrEventSection,
        dateOfAward: dayjs(data?.dateOfAward).format("DD/MM/YYYY"),
        reward: Array.isArray(data?.reward)
          ? data.reward.map((item: { value: number }) => item.value).join(",")
          : "",
        result: data?.result,
        remarks: data?.remarks,
        rewardsID: id,
        sportID: Number(teamID),
        prizeMoney: String(data?.priceMoney),
        otherOption: data?.other
      };
      dispatch(
        updateRewards({
          url: "/UpdateRewardsByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        rewardName: data?.rewardName,
        rewardType: data?.rewardType,
        athleteName:
          data?.rewardType === "Team"
            ? `${sportsName && sportsName?.sportName} Team`
            : String(data?.athleteName),
        raceOrEvent: String(data?.raceOrEvent),
        raceOrEventSection: data?.raceOrEventSection,
        dateOfAward: dayjs(data?.dateOfAward).format("DD/MM/YYYY"),
        reward: Array.isArray(data?.reward)
          ? data.reward.map((item: { value: number }) => item.value).join(",")
          : "",
        result: data?.result,
        remarks: data?.remarks,
        sportID: Number(teamID),
        prizeMoney: String(data?.priceMoney),
        otherOption: data?.other
      };
      dispatch(
        addRewards({
          url: "/InsertRewards",
          payload: payload,
        })
      );
    }
  };

  const getDefaultAthleteOption = (athleteList: any) => {
    const defaultOptions = [];
    for (const item in athleteList) {
      defaultOptions.push({
        label:
          athleteList[item].firstName +
          " " +
          athleteList[item].middleName +
          " " +
          athleteList[item].surName,
        value: athleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const getDefaultRewardOption = (rewardList: any) => {
    const defaultOptions = [];
    for (const item in rewardList) {
      defaultOptions.push({
        label: rewardList[item].name,
        value: rewardList[item].id,
      });
    }
    return defaultOptions;
  };

  const getDefaultEventOption = (eventList: any) => {
    const defaultOptions = [];
    for (const item in eventList) {
      defaultOptions.push({
        label: eventList[item].eventName,
        value: eventList[item].eventID,
        eventType: eventList[item].eventType,
      });
    }
    return defaultOptions;
  };

  const getDefaultCompetitionOption = (competitionList: any) => {
    const defaultOptions = [];
    for (const item in competitionList) {
      defaultOptions.push({
        label: competitionList[item].tournamentName,
        value: competitionList[item].tournamentID,
        tournamentType: competitionList[item].tournamentType,
      });
    }
    return defaultOptions;
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    if (teamID) {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
      const rewardPayload = {};
      dispatch(
        RewardsDropdownList({
          url: "/GetRewardsMedalList",
          payload: rewardPayload,
        })
      );
      const eventPayload = {
        sportID: Number(teamID),
      };
      dispatch(
        eventDropdownList({
          url: "/GetEventListForRewards",
          payload: eventPayload,
        })
      );
      const competitionPayload = {
        sportID: Number(teamID),
      };
      dispatch(
        competitionDropdownList({
          url: "/GetCompetitionListForRewards",
          payload: competitionPayload,
        })
      );
    }
  }, [teamID]);

  React.useEffect(() => {
    const athlete: any = getDefaultAthleteOption(getAthleteList);
    setAthleteDataOption(athlete);
  }, [getAthleteList]);

  React.useEffect(() => {
    const reward: any = getDefaultRewardOption(rewardsTypeList);
    setRewardsDataOption(reward);
  }, [rewardsTypeList]);

  React.useEffect(() => {
    const event: any = getDefaultEventOption(eventList);
    setEventDataOption(event);
  }, [eventList]);

  React.useEffect(() => {
    const competition: any = getDefaultCompetitionOption(competitionList);
    setCompetitionDataOption(competition);
  }, [competitionList]);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  React.useEffect(() => {
    if (rewardType === "Team" || rewardType === "Athlete") {
      setValue("athleteName", "");
      let filterRole: any = [];
      if (
        getSportList &&
        getSportList?.data &&
        isArray(getSportList?.data) &&
        getSportList?.data.length > 0
      ) {
        filterRole = getSportList?.data?.find(
          (item: any) => item?.sportID === Number(teamID)
        );
      }
      setSportsName(filterRole);
    }
  }, [rewardType]);

  React.useEffect(() => {
    setValue("raceOrEvent", "");
  }, [raceOrEventSection, setValue]);

  React.useEffect(() => {
    if (
      (rewardsAddresponse && rewardsAddresponse.code === 200) ||
      (rewardsUpdateresponse && rewardsUpdateresponse.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");

      // notification
      if (!edit && process.env.ENABLE_NOTIFICATION === "yes") {
        const rewardLink = `${process.env.BASE_DOMAIN}teams/${getCurrentSport}/rewards/view/${rewardsAddresponse?.data?.rewardsID}`;
        const updatedMessage = notificationMessage
          .replace("[Link]", `<a href="${rewardLink}">click here</a>`)
          .replace("[Name]", rewardName || "Unknown Reward");
        const NotificationPayload: any = {
          moduleID: 129,
          sportID: Number(teamID),
          userID: String(athleteName) || "",
          name: rewardName,
          date: dayjs(dateOfAward).format("DD-MM-YYYY"),
          message: updatedMessage,
        };
        dispatch(
          addNotification({
            url: "/InsertNotification",
            payload: NotificationPayload,
          })
        );
      }

      dispatch(clearAddState());
      dispatch(clearRewardsUpdateState());
      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          dispatch(clearEditState());
          clearData();
        } else {
          router.push(`/teams/${getCurrentSport}/rewards`);
          clearData();
          dispatch(clearEditState());
        }
      }, 1000);
    } else if (
      (rewardsAddresponse && rewardsAddresponse.code === 500) ||
      (rewardsUpdateresponse && rewardsUpdateresponse.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddState());
      dispatch(clearRewardsUpdateState());
    } else if (
      (rewardsAddresponse && rewardsAddresponse.code === 409) ||
      (rewardsUpdateresponse && rewardsUpdateresponse.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddState());
      dispatch(clearRewardsUpdateState());
    }
  }, [rewardsAddresponse, rewardsUpdateresponse]);

  React.useEffect(() => {
    if (!Array.isArray(rewardsDataOption) || !rewardsEditresponse?.data?.[0]) {
      return;
    }
  
    const editData = rewardsEditresponse.data[0];
    const rewardValue = editData?.reward?.trim();
    const raceOrEvent = editData?.raceOrEvent;
    const raceOrEventSection = editData?.raceOrEventSection;
    if (!rewardValue) {
      let selectedItemType = "";
      if (raceOrEventSection === "competition") {
        const selectedCompetition = Array.isArray(competitionList)
          ? competitionList.find((item: any) => item?.tournamentID == raceOrEvent)
          : "";
        selectedItemType = selectedCompetition?.tournamentType || "";
      } else if (raceOrEventSection === "event") {
        const selectedEvent = Array.isArray(eventList)
          ? eventList.find((item: any) => item?.eventID == raceOrEvent)
          : "";
        selectedItemType = selectedEvent?.eventType || "";
      }
      if (selectedItemType) {
        const filtered = rewardsDataOption.filter(
          (reward: any) => reward?.type?.toLowerCase() === selectedItemType.toLowerCase()
        );
        setFilterRewardsList(filtered);
        setValue("reward", []);
      }
    } else {
      const rewardIds = rewardValue.split(",").map((id: string) => parseInt(id.trim(), 10));
      const filteredRewardsType = rewardsDataOption.find((reward: any) => 
        reward?.rewardsMedalID == rewardIds?.[0]
      );
  
      if (filteredRewardsType?.type) {
        const rewardTypeList = rewardsDataOption.filter(
          (reward: any) => reward?.type === filteredRewardsType?.type
        );
        setFilterRewardsList(rewardTypeList);
      }
    }
  }, [rewardsDataOption, rewardsEditresponse, competitionList, eventList]);
  
  React.useEffect(() => {
    if (!rewardsEditresponse || rewardsEditresponse?.code !== 200) return;
  
    const editData = rewardsEditresponse?.data?.[0];
    if (!editData) return;
    setValue("rewardName", editData.rewardName || "");
    setValue("rewardType", editData.rewardType || "");
    setValue("athleteName", Number(editData.athleteID) || "");
    setValue("raceOrEventSection", editData.raceOrEventSection || "");
    setValue("raceOrEvent", Number(editData.raceOrEvent) || "");
    setValue("dateOfAward", moment(editData.dateOfAward, "DD/MM/YYYY"));
    
    const rewardString = editData?.reward;
    if (rewardString?.trim()) {
      const rewardIds = rewardString
        .split(",")
        .map((id: string) => parseInt(id.trim(), 10))
        .filter((id: number) => !isNaN(id));
      
      const rewardsList = Array.isArray(rewardsDataOption) ? rewardsDataOption : [];
      const matchedRewards = rewardsList.filter((item: any) => 
        rewardIds.includes(Number(item?.value))
      );
      setValue("reward", matchedRewards);
    } else {
      setValue("reward", []);
    }
  
    setValue("result", editData.result || "");
    setValue("remarks", editData.remarks || "");
    setValue("priceMoney", editData.prizeMoney?.toString().trim() || "");
    setValue("other", editData.otherOption || "");
  
  }, [rewardsEditresponse, rewardsDataOption, competitionList, eventList]);
  
  const handleChangeRewards = (selectedOption: any | null): void => {
    setSelectedRewardsOption(selectedOption);
    if (selectedOption) {
      setIsRewardError(false);
    } else {
      setIsRewardError(true);
    }
  };

  return (
    <>
      <Fade in={true} timeout={1000}>
        <Grid container spacing={0}>
          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? `Rewards ${edit ? "Updated" : "Added"} successfully!`
                  : "Something went wrong"
              }
              severity={snackbarStatus === "success" ? "success" : "error"}
              open={snackbarOpen}
              onClose={handleSnackBarClose}
            />
          )}
          <Box sx={{ width: "100%", p: 5 }}>
            {rewardsEditresponse && rewardsEditresponse.loading ? (
              <EditFieldSkeleton isAvatar={false} />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {edit ? null : (
                  <Grid
                    container
                    spacing={2}
                    justifyContent={"space-between"}
                    pb={2}
                  >
                    <Grid item xs={6}>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "27.01px",
                          color: "#58585B",
                        }}
                        mb={1}
                      >
                        Estimated Time: 1.5 minutes
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={"right"}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ height: "48px", fontSize: "16px" }}
                        onClick={() => {
                          clearData();
                        }}
                        className="text-capitalize dubai-regular"
                      >
                        Clear form
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid
                  container
                  item
                  xs={12}
                  md={12}
                  spacing={2}
                  justifyContent={"space-between"}
                  component={"form"}
                >
                  <Grid item xs={12} md={5.75} mt={0.5}>
                    <CustomTextField
                      name="rewardName"
                      label="Reward Name"
                      placeholder="Enter Reward Name"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message: "Reward Name cannot exceed 50 characters",
                        },
                        required: "Reward Name is required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} mt={0.5}></Grid>

                  <Grid item xs={12} md={5.75}>
                    <CustomRadioGroup
                      name="rewardType"
                      control={control}
                      label="Rewarded To"
                      options={[
                        { value: "Athlete", label: "Athlete" },
                        { value: "Team", label: "Team" },
                      ]}
                      required={true}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5.75}
                    sx={{
                      pb: 1,
                    }}
                  >
                    <DropDown
                      name="athleteName"
                      control={control}
                      label="Athlete Name"
                      placeholder="Select Athlete"
                      options={athleteDataOption && athleteDataOption}
                      multiple={false}
                      variant="outlined"
                      required={true}
                      disabled={rewardType === "Team"}
                      rules={{
                        required: "Athlete Name is required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <CustomRadioGroup
                      name="raceOrEventSection"
                      control={control}
                      label="Activity"
                      options={[
                        { value: "event", label: "Event" },
                        { value: "competition", label: "Competition" },
                      ]}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      {raceOrEventSection === "event"
                        ? "Race/Event"
                        : "Competition"}
                      <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                        *
                      </span>
                    </Typography>
                    <>
                      <FormControl className="selectFieldContainer" fullWidth>
                        <Controller
                          name="raceOrEvent"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: `${raceOrEventSection === "event"
                              ? "Race/Event"
                              : "Competition"
                              } is required`,
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <Select
                                {...field}
                                displayEmpty
                                className="Text-field-customise"
                                IconComponent={() => (
                                  <ExpandMoreIcon
                                    style={{
                                      marginRight: "10px",
                                      color: "#b6afaf",
                                    }}
                                  />
                                )}
                                onChange={(e) => {
                                  const selectedOption = dropdownOptions.find(
                                    (option: any) =>
                                      option.value === e.target.value
                                  );
                                  field.onChange(e);
                                  getSelectedTournament(selectedOption);
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 300,
                                      overflowY: "auto",
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="" disabled>
                                  <Typography
                                    style={{
                                      color: error ? "#d32f2f" : "#b6afaf",
                                      height: 27,
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      lineHeight: "25.01px",
                                      textAlign: "left",
                                      marginLeft: 0,
                                    }}
                                    className="dubai-med"
                                  >
                                    {`Select ${raceOrEventSection === "event"
                                      ? "Race/Event"
                                      : "Competition"
                                      }`}
                                  </Typography>
                                </MenuItem>
                                {Array.isArray(dropdownOptions)
                                  ? dropdownOptions?.map((option: any) => (
                                    <MenuItem
                                      key={
                                        option.eventId ?? option.tournamentId
                                      }
                                      value={option.value}
                                    >
                                      <Typography
                                        style={{
                                          height: 27,
                                          fontSize: "16px",
                                          fontWeight: 500,
                                          lineHeight: "25.01px",
                                          textAlign: "left",
                                        }}
                                        className="dubai-med"
                                      >
                                        {option.label}
                                      </Typography>
                                    </MenuItem>
                                  ))
                                  : null}
                              </Select>
                              {error && (
                                <Typography
                                  sx={{
                                    color: "#d32f2f",
                                    fontSize: "12px",
                                    marginTop: "4px !important",
                                  }}
                                  className="dubai-med"
                                >
                                  {raceOrEventSection === "event"
                                    ? "Race/Event"
                                    : "Competition"}{" "}
                                  is required
                                </Typography>
                              )}
                            </>
                          )}
                        />
                      </FormControl>
                    </>
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <Box pt={2}>
                      <TrainingCampCustomDatePicker
                        control={control}
                        name="dateOfAward"
                        label="Date Of Award"
                        boxmb={0.8}
                        required={true}
                        minDate={moment().subtract(80, "years")}
                        maxDate={moment()}
                        className="Text-field-customise"
                        rules={{
                          required: "Date of Award is required",
                        }}
                      />
                    </Box>
                    <Box pt={2}>
                      <CustomTextField
                        name="result"
                        label="Result"
                        placeholder="Enter Result"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                            message: "Only Alphanumberic & hypens are allowed",
                          },
                          maxLength: {
                            value: 50,
                            message: "Result cannot exceed 50 characters",
                          },
                          required: "Result is required",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <FormWithSunEditor
                      name="remarks"
                      control={control}
                      minHeight={"200px"}
                      label="Remarks"
                      placeholder="Enter Remarks"
                    />
                  </Grid>

                  <Grid item xs={12} container alignItems="center" justifyContent="space-between" mt={1}>
                    <Typography variant="caption"
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        color: "#000000",
                        fontWeight: "500",
                        fontSize: "18px",
                        fontFamily: "29LT Bukra",
                      }}
                      className="bukra">
                      Rewards
                    </Typography>
                    <Typography variant="caption"
                      sx={{ color: "#58585B", fontWeight: "400" }}
                      className="dubai-regular"
                      fontSize={"16px"}>
                      <span style={{ color: "#E4002B" }}>*</span> Minimum one reward is required
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} md={5.75} mt={0.7}>
                    <Typography gutterBottom className="typography textfield-label bukra">
                      Trophy
                    </Typography>
                    <ReactSelect
                      control={control}
                      name="reward"
                      classNamePrefix="select"
                      handleChangeReactSelect={handleChangeRewards}
                      options={rewardsDataOption}
                      value={Array.isArray(SelectedRewardsOption) ? SelectedRewardsOption : []}
                      isDisabled={!rewardsDataOption}
                      placeholder={"Select Trophy"}
                      isClearable={true}
                      isMulti={true}
                      isError={isRewardError}
                      readonly={rewardsDataOption.length === 0}

                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} mt={0.5}>
                    <CustomTextField
                      name="priceMoney"
                      label="Price Money"
                      placeholder="Enter Price Money"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numberics are allowed",
                        },
                        maxLength: {
                          value: 9,
                          message: "Price Money cannot exceed 9 characters",
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} mt={0.5}>
                    <CustomTextField
                      name="other"
                      label="Other"
                      placeholder="Specify other reward"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message: "Other cannot exceed 50 characters",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 5,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      marginRight: "8px",
                      height: "48px",
                      borderRadius: "4px",
                      gap: "0px",
                      fontSize: "16px",
                    }}
                    onClick={handleCancel}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="text-capitalize dubai-med cancel-button"
                    sx={{
                      height: "48px",
                      borderRadius: "4px",
                      gap: "0px",
                      fontSize: "16px",
                    }}
                    disabled={
                      rewardsAddresponse.loading ||
                      rewardsUpdateresponse?.loading
                    }
                    onClick={handleSubmit(onSubmit)}
                  >
                    {rewardsAddresponse.loading ||
                      rewardsUpdateresponse?.loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : edit ? (
                      "Update Reward"
                    ) : (
                      "Create Reward"
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Grid>
      </Fade>
    </>
  );
};
export default RewardsAdd;
