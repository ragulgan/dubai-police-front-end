import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, FormControl, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import DropDown from "@/components/Fields/DropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import FormWithSunEditor from "@/components/useFormSunEditor";
import ReactSelect from "react-select";
import CustomRadioButton from "./CustomRadioButton";
import CustomRadioButtonTeam from "./CustomRadioButtonTeam";
import { useEffect, useState } from "react";
import AddTimeSlotDialog from "./AddTimeSlotDialog";
import { useSelector } from "react-redux";

interface AddMatchDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onAgree?: () => void;
  onDisagree?: () => void;
  agreeLabel?: string;
  disagreeLabel?: string;
}

const AddMatchDialog: React.FC<AddMatchDialogProps> = ({
  open,
  onClose,
  title,
  description,
  onAgree,
  onDisagree,
  agreeLabel = "Agree",
  disagreeLabel = "Disagree",
}) => {
  const [dialogSlotOpen, setDialogSlotOpen] = useState(false);
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

  const onSubmit = () => {
  };

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

  const handleAddSlots = () => {
    setDialogSlotOpen(true);
  };

  const handleDialogDisagree = () => {
    setDialogSlotOpen(false);
    // router.push(`/programs`);
  };

  const handleDialogAgree = () => {
    // if (id) {
    //   onClose();
    // }
    setDialogSlotOpen(false);
  };

  // Add Match
  const addMatch = useSelector((state: any) => {
    return state.addMatch;
  });

  return (
    <>
      {dialogSlotOpen && (
        <AddTimeSlotDialog
          open={dialogSlotOpen}
          onClose={handleDialogAgree}
          title="Time Slot Form"
          description=""
          onAgree={handleDialogDisagree}
          onDisagree={handleDialogAgree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
        />
      )}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xl" // or false to remove the default max width limit
        PaperProps={{
          style: {
            width: '80%',
            height: '100%'
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" className="bukra">
          {title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={0}>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  item
                  xs={12}
                  md={12}
                  spacing={2}
                  justifyContent={"space-between"}
                  component={"form"}
                >
                  <Grid item xs={12} md={5.75}>
                    <CustomRadioGroup
                      name="competitionType"
                      control={control}
                      label="Competition Type"
                      options={[
                        { value: "Individual", label: "Individual" },
                        { value: "Team", label: "Team" },
                      ]}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} />
                  <Grid
                    item
                    xs={12}
                    md={5.75}
                    sx={{
                      pb: 1.5,
                    }}
                  >
                    <DropDown
                      name="tournamentFormat"
                      control={control}
                      label="Tournament Format"
                      placeholder="Select Tournament Format"
                      // options={athleteDataOption && athleteDataOption}
                      multiple={false}
                      variant="outlined"
                      required={true}
                      // disabled={rewardType === "Team"}
                      rules={{
                        required: "Tournament Format is required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} sx={{
                    pb: 1.5,
                  }}>
                    <CustomTextField
                      name="location"
                      label="Location"
                      placeholder="Enter Tournament Location"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message: "Tournament Location cannot exceed 50 characters",
                        },
                        required: "Tournament Location is required",
                      }}
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
                      name="teamA"
                      control={control}
                      label="Team A"
                      placeholder="Select Team"
                      // options={athleteDataOption && athleteDataOption}
                      multiple={false}
                      variant="outlined"
                      required={true}
                      // disabled={rewardType === "Team"}
                      rules={{
                        required: "Team A is required",
                      }}
                    />
                    <CustomRadioButtonTeam
                      name="competitionType"
                      control={control}
                      label="as"
                      options={[
                        { value: "Home", label: "Home" },
                        { value: "Away", label: "Away" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <CustomTextField
                      name="teamB"
                      label="Team B"
                      placeholder="Enter Team name"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message: "Team Name cannot exceed 50 characters",
                        },
                        required: "Team Name is required",
                      }}
                    />
                    <CustomRadioButtonTeam
                      name="competitionType"
                      control={control}
                      label="as"
                      options={[
                        { value: "Home", label: "Home" },
                        { value: "Away", label: "Away" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <CustomRadioButton
                      name="matchTime"
                      control={control}
                      label="Match Time"
                      options={[
                        { value: "OnlyOnce", label: "Only Once" },
                        { value: "Every", label: "Every" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75} />
                  <Grid item xs={12} md={5.75}>
                    <IconButton
                      sx={{
                        backgroundColor: "#FFFFFF",
                        color: "#58585B",
                        borderRadius: "5px",
                        border: "1px solid #0087554D",
                        width: "134px",
                        padding: "0px",
                        height: "40px",
                      }}
                      onClick={() => handleAddSlots()}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "100%",
                        }}
                        m={0}
                        className="dubai-med"
                      >
                        + Add time slot
                      </Typography>
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} md={5.75} />
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      marginRight: "8px",
                      height: "48px",
                      borderRadius: "4px",
                      gap: "0px",
                      fontSize: "16px",
                    }}
                    // onClick={handleCancel}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Back
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
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save & Continue
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMatchDialog;