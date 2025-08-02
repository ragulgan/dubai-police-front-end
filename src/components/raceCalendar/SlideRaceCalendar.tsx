import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Tabs,
  styled,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import GeneralInfo from "./trainingPlan/GeneralInfo";
import TrainingInfo from "./trainingPlan/TrainingInfo";
import TournamentForm from "./TournamentForm";
import EventForm from "../Forms/EventForm";
import RemainderForm from "../Forms/RemainderForm";
import MeetingForm from "../Forms/MeetingForm";

interface SlideDialogProps {
  open: boolean;
  onClose: () => void; // Type the onClose as a function that returns nothing
  title: string;
  editData?: any;
  date?: any;
  setDate?: any;
  selectedSport?: any;
}

const SlideRaceCalendar: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  title,
  editData,
  date,
  setDate,
  selectedSport,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [trainingId, setTrainingId] = useState();
  const StyledTab = styled(Tab)<{ selected: boolean }>(
    ({ selected, disabled }) => ({
      flexGrow: 1,
      backgroundColor: selected ? "#008755" : "white",
      color: selected ? "#fff !important" : "#58585B99",
      fontFamily: "29LT Bukra !important",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "20px",
      pointerEvents: disabled ? "none" : "auto",
      opacity: disabled ? 0.6 : 1,
      "&:hover": {
        backgroundColor: selected ? "#006b43" : "#f0f0f0",
      },
    })
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const [allData, setAllData] = useState<any>({});
  const [showEdit, setShowEdit] = useState<any>();

  useEffect(() => {
    if (!_.isEmpty(editData)) {
      setShowEdit(true);
      setTabValue(0);
    } else {
      setShowEdit(false);
      setTabValue(0);
    }
  }, [editData]);

    useEffect(() => {
      return () => {
        setAllData("")
      };
    }, []);

  const TrainingTabView = () => {
    return (
      <Box mt={-2.1} px={0}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: "white",
            borderTop: `1px solid #58585B66`,
            borderBottom: `1px solid #58585B66`,
            "& .MuiTabs-indicator": { backgroundColor: "transparent" },
          }}
        >
          <StyledTab
            label="General Information"
            selected={tabValue === 0}
            className="text-capitalize bukra stepper-label-view"
            // disabled={iseditStaffDataLoading || iseditStaffError || getAthleteByIDLoading || getAthleteByIDError}
          />
          <StyledTab
            label={"Training Details"}
            selected={tabValue === 1}
            className="text-capitalize bukra stepper-label-view"
            disabled={showEdit ? false : true}
          />
        </Tabs>
        {tabValue === 0 ? (
          <Box mt={2} px={4}>
            <GeneralInfo
              onClose={onClose}
              editData={editData}
              setTabValue={setTabValue}
              setAllData={setAllData}
              allData={allData}
              setTrainingId={setTrainingId}
              date={date}
              setDate={setDate}
              selectedSport={selectedSport}
            />
          </Box>
        ) : (
          <Box mt={2} px={4}>
            <TrainingInfo
              onClose={onClose}
              editData={editData}
              setAllData={setAllData}
              allData={allData}
              setTabValue={setTabValue}
              trainingId={trainingId}
              setTrainingId={setTrainingId}
              selectedSport={selectedSport}
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        onClose();
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: 550,
          py: 2,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          paddingBottom: "6px",
          borderBottom: `1px solid #58585B66`,
        }}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {title === "tournament"
            ? !_.isEmpty(editData)
              ? "Update Tournament / Competition"
              : "Create Tournament / Competition"
            : title === "event"
            ? !_.isEmpty(editData)
              ? "Update Event"
              : "Create Event"
            : title === "reminder" || title === "remainder"
            ? !_.isEmpty(editData)
              ? "Update Reminder"
              : "Create Reminder"
            : title === "meeting"
            ? !_.isEmpty(editData)
              ? "Update Meeting"
              : "Create Meeting"
            : title === "training"
            ? !_.isEmpty(editData)
              ? "Update Training"
              : "Create Training"
            : ""}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        {title !== "training" ? (
          <Box mt={2} px={4}>
            {title === "tournament" ? (
              <TournamentForm
                onClose={onClose}
                editData={editData}
                date={date}
              />
            ) : title === "event" ? (
              <EventForm onClose={onClose} editData={editData} date={date} />
            ) : title === "remainder" || title === "reminder" ? (
              <RemainderForm
                onClose={onClose}
                editData={editData}
                date={date}
              />
            ) : title === "meeting" ? (
              <MeetingForm onClose={onClose} editData={editData} date={date} />
            ) : null}
          </Box>
        ) : (
          <TrainingTabView />
        )}
      </Box>
    </Drawer>
  );
};

export default SlideRaceCalendar;
