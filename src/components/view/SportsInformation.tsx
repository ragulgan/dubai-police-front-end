"use client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Slide,
  Typography,
} from "@mui/material";
import Graduation from "../../../public/graduation.svg";
import FieldStudy from "../../../public/fieldStudy.svg";
import CoachExperience from "../../../public/coachExperience.svg";
import OrganisationSkill from "../../../public/organisationSkill.svg";
import AchievementSkill from "../../../public/achievementSkill.svg";
import Punctuality from "../../../public/Punctuality.svg";
import Availability from "../../../public/availability.svg";
import Monitor from "../../../public/monitor.svg";
import BrowserOpen from "../../../public/browserOpen.svg";
import HastagSVG from "../../../public/HastagSVG.svg";
import TeamFlag from "../../../public/TeamFlag.svg";
import UserSVG from "../../../public/UserSVG.svg";
import ExternalClub from "../../../public/ExternalClub.svg";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import CustomTextField from "../Fields/CustomTextField";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/router";
import {
  UpdateCoachCommentsByID,
  clearCoachCommentsUpdateState,
} from "@/redux/slices/athlete/coachCommentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import QualificationMenu from "./qualificationMenu";
interface SportsInformationProps {
  data: any;
  module: any;
}

const SportsInformation: React.FC<SportsInformationProps> = ({
  data,
  module,
}) => {
  const modules: any = {
    staff: [
      // {
      //   name: "Coaching Experience",
      //   nodeName: "coachingExperience",
      //   icon: <CoachExperience style={{ width: 16, height: 16 }} />,
      // },
      {
        name: "Skills",
        nodeName: "skills",
        icon: <OrganisationSkill style={{ width: 16, height: 16 }} />,
      },
      // {
      //   name: "Punctuality in Meetings",
      //   nodeName: "punctualityInMeetings",
      //   icon: <Punctuality style={{ width: 16, height: 16 }} />,
      // },
      // {
      //   name: "Availability on Training Sessions",
      //   nodeName: "availabilityOnTraining",
      //   icon: <Availability style={{ width: 16, height: 16 }} />,
      // },
    ],
    athlete: [
      {
        name: "Role in Sports",
        nodeName: "role",
        icon: <UserSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "National Team Member",
        nodeName: "nationalTeamMember",
        icon: <TeamFlag style={{ width: 16, height: 16 }} />,
      },
      {
        name: "External Club Affiliation",
        nodeName: "externalClubs",
        icon: <ExternalClub style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Source",
        nodeName: "source",
        icon: <HastagSVG style={{ width: 16, height: 16 }} />,
      },
    ],
  };
  const [openDialog, setDialogOpen] = useState(false);
  const handleComment = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { id, teamID } = router.query;
  const coachCommentsResponse = useSelector(
    (state: any) => state.coachComments
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [qualificationList, setQualificationList] =
    useState<any>("Qualification 1");
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      coachComments: "",
    },
  });

  useEffect(() => {
    setValue("coachComments", data?.coachComments);
  }, [data?.coachComments]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const payload: any = {
      athleteID: id,
      
      coachComments: data.coachComments,
    };
    dispatch(
      UpdateCoachCommentsByID({ url: "/UpdateCoachCommentsByID", payload })
    );
  };

  useEffect(() => {
    if (
      coachCommentsResponse &&
      coachCommentsResponse.code === 200 &&
      coachCommentsResponse.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearCoachCommentsUpdateState());
    } else if (
      coachCommentsResponse &&
      coachCommentsResponse.code === 500 &&
      coachCommentsResponse.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearCoachCommentsUpdateState());
    }
  }, [coachCommentsResponse]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        handleClose();
        setSnackbarOpen(false);
        const payload: any = {
          athleteID: id,
          sportID: teamID,
          
        };
        dispatch(editAthlete(payload));
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
          marginRight: "10px",
        }}
      />
    );
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="alert-dialog-title" className="bukra" sx={{ mt: 2 }}>
            {"Coach comments"}
          </DialogTitle>
          <DialogContent>
            <CustomTextField
              name="coachComments"
              control={control}
              label="Coach comments"
              rules={{
                required: "Coach comments is required",
                pattern: {
                  value: /^[a-zA-Z0-9. ]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 100,
                  message: "Coach comments cannot exceed 50 characters",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              className="dubai-med text-capitalize"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="dubai-med text-capitalize"
              disabled={coachCommentsResponse?.loading}
            >
              {coachCommentsResponse?.loading ? (
                <CircularProgress sx={{ color: "#FFFFFF" }} size="22px" />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Fade in={true} timeout={1000}>
        <Box>
          {module && data?.academicQualificationList?.length > 0 ? (
            <Box p={2}>
              <QualificationMenu
                setQualificationList={setQualificationList}
                qualificationList={qualificationList}
                data={data}
                module={module}
                profile="qualification"
              />
            </Box>
          ) : null}
          {modules[module].map((item: any, index: any) => (
            <Box sx={{ paddingLeft: 2, marginTop: 1 }} key={index}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {item.icon}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: 15,
                    color: "#333333",
                    paddingLeft: 1,
                  }}
                  className="bukra-semi-bold"
                >
                  {item.name}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#58585B",
                  paddingLeft: 3,
                }}
                className="dubai-regular text-capitalize"
              >
                {_.isEmpty(data && data[item.nodeName]) ||
                (data && data[item.nodeName] === " ") ? (
                  <>&nbsp;</>
                ) : data[item.nodeName] === "Y" ? (
                  "Yes"
                ) : item.nodeName === "availabilityOnTraining" ? (
                  <RenderEditorContent content={data[item.nodeName]} />
                ) : (
                  data[item.nodeName]
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      </Fade>
      <Box
        p={2}
        px={1}
        my={3}
        border={"1px dashed #26D07C"}
        sx={{ backgroundColor: "rgba(38, 208, 124, 0.1)" }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"start"}
        >
          <Typography
            className="bukra view-sports-head"
            color="#26D07C"
            width={"85%"}
          >
            {module === "athlete"
              ? "Coach comments"
              : "Previous Athlete Experience in Sport"}
          </Typography>
          {module === "athlete" ? (
            <IconButton sx={{ p: 0 }} onClick={handleComment}>
              <BrowserOpen width={18} height={18} />
            </IconButton>
          ) : null}
        </Box>
        <Typography
          mt={1}
          className="dubai-regular view-sports-list text-capitalize"
        >
          {module === "athlete"
            ? data && data?.coachComments
            : data && data.previousAthleteExperience}
        </Typography>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Coach comments updated successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleClose}
          />
        )}
      </Box>
    </>
  );
};

export default SportsInformation;
