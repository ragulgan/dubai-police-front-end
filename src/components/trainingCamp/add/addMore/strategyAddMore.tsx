import CustomTextField from "@/components/Fields/CustomTextField";
import FormWithSunEditor from "@/components/useFormSunEditor";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Grid, Button } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TrainingCampCustomDateTimePicker from "../../trainingCampCustomDateTimePicker";
import moment from "moment";

const AddMore = (props: any) => {
  const {
    competitionData,
    setCompetitionData,
    campStartDate,
    campEndDate,
    control,
    watch,
  } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "competitions",
    keyName: "id",
  });

  const watchedCompetitions = watch("competitions");

  const lastCompetition =
    watchedCompetitions && watchedCompetitions[watchedCompetitions.length - 1];

  const hasEmptyValues =
    !lastCompetition.competitionName.trim() ||
    lastCompetition.competitionStartDate === null ||
    lastCompetition.competitionEndDate === null;

  useEffect(() => {
    setCompetitionData(watchedCompetitions);
  }, [watchedCompetitions, setCompetitionData]);

  return (
    <>
      {fields.map((item: any, index) => (
        <Fragment key={item.id}>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`competitions.${index}.competitionName`}
              label="Name"
              placeholder="Enter New Name"
              control={control}
              required
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9() /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
                required: "Name is required",
              }}
            />
          </Grid>
          <Grid container item xs={12} md={5.75} spacing={2}>
            <Grid item xs={6}>
              <TrainingCampCustomDateTimePicker
                control={control}
                name={`competitions.${index}.competitionStartDate`}
                label="Start Date and time"
                boxmb={0.8}
                required
                disabled={!campStartDate && !campEndDate}
                minDate={campStartDate}
                maxDate={
                  watch(`competitions.${index}.competitionEndDate`) ||
                  campEndDate
                }
                className="Text-field-customise"
                rules={
                  !campStartDate && !campEndDate
                    ? { required: "" }
                    : { required: "Start Date is required" }
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TrainingCampCustomDateTimePicker
                control={control}
                name={`competitions.${index}.competitionEndDate`}
                label="End Date and time"
                boxmb={0.8}
                required
                disabled={!campStartDate && !campEndDate}
                minDate={
                  watch(`competitions.${index}.competitionStartDate`) ||
                  campStartDate
                }
                maxDate={moment(campEndDate).endOf("day")}
                className="Text-field-customise"
                rules={
                  !campStartDate && !campEndDate
                    ? { required: "" }
                    : { required: "End Date is required" }
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={5.75}>
            <FormWithSunEditor
              name={`competitions.${index}.competitionOtherDetails`}
              control={control}
              minHeight={"200px"}
              label="Other Details"
            />
          </Grid>
          <Grid item xs={12} md={5.75} mt={3}>
            {competitionData && competitionData.length > 1 ? (
              <Button
                variant="text"
                color="error"
                onClick={() => remove(index)}
                className="text-capitalize"
              >
                <DeleteOutlinedIcon />
              </Button>
            ) : null}
          </Grid>
        </Fragment>
      ))}
      <Grid item xs={12} md={12}>
        <Button
          variant="text"
          className="dubai-med text-capitalize"
          sx={{ color: "#00426A" }}
          startIcon={<AddBoxOutlinedIcon />}
          onClick={() =>
            append({
              competitionName: "",
              competitionStartDate: null,
              competitionEndDate: null,
              competitionOtherDetails: "",
            })
          }
          disabled={(!campStartDate && !campEndDate) || hasEmptyValues}
        >
          Add more
        </Button>
      </Grid>
    </>
  );
};

export default AddMore;
