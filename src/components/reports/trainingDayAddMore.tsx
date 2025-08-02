import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomFormControlLabel from "@/components/Forms/CustomFormControlLabel";
import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

const TrainingDayAddMore = (props: any) => {
  const {
    applyDaysForTraining,
    setApplyDaysForTraining,
    getTrainingCampTrainingPlanData,
    setTrainingPlanData,
    trainingPlanData,
    trainingPlanSelectedData,
    setTrainingPlanSelectedData,
    setResetForm,
    resetForm,
  } = props;
  const { handleSubmit, control, setValue, reset } = useForm<any>({
    defaultValues: {
      dayNo: null,
      morning: null,
      afternoon: null,
    },
  });

  const onSubmit = (data: any) => {
    console.log({data},'=================');
    
    setTrainingPlanData([...trainingPlanData, data]);
    setTrainingPlanSelectedData([]);
    setApplyDaysForTraining(false);
  };

  useEffect(() => {
    console.log({getTrainingCampTrainingPlanData});
    
    setValue(
      "dayNo",
      
        getTrainingCampTrainingPlanData &&
        getTrainingCampTrainingPlanData.length === undefined
          ? 1
          : getTrainingCampTrainingPlanData.length + 1
    
      // `Day ${
      //   getTrainingCampTrainingPlanData &&
      //   getTrainingCampTrainingPlanData.length === undefined
      //     ? 1
      //     : getTrainingCampTrainingPlanData.length + 1
      // }`
    );
  }, [getTrainingCampTrainingPlanData]);

  useEffect(() => {
    if (trainingPlanSelectedData && trainingPlanSelectedData.length > 0) {
      setValue(
        "dayNo",
        trainingPlanSelectedData &&
          trainingPlanSelectedData[0] &&
          trainingPlanSelectedData[0].dayNo
      );
      setValue(
        "morning",
        trainingPlanSelectedData &&
          trainingPlanSelectedData[0] &&
          trainingPlanSelectedData[0].morning
      );
      setValue(
        "afternoon",
        trainingPlanSelectedData &&
          trainingPlanSelectedData[0] &&
          trainingPlanSelectedData[0].afternoon
      );
    }
  }, [trainingPlanSelectedData]);

  useEffect(() => {
    if (resetForm) {
      setTrainingPlanData([]);
      reset({
        dayNo: "Day 1",
        morning: "",
        afternoon: "",
      });
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);

  return (
    <Grid
      container
      item
      spacing={2}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid item xs={1.5}>
        <CustomTextField
          name="dayNo"
          label="Day"
          placeholder="Enter a Day"
          control={control}
          required={true}
          rules={{
            maxLength: {
              value: 20,
              message: "Day cannot exceed 20 characters",
            },
            required: "Day is required",
          }}
          disabled={true}
        />
      </Grid>
      <Grid item xs={2.5}>
        <CustomTextField
          name="morning"
          label="Morning"
          placeholder="Enter Training Plan"
          control={control}
          required={true}
          rules={{
            maxLength: {
              value: 100,
              message: "Morning Plan cannot exceed 100 characters",
            },
            required: "Morning Plan is required",
          }}
        />
      </Grid>
      <Grid item xs={2.5}>
        <CustomTextField
          name="afternoon"
          label="Afternoon"
          placeholder="Enter Training Plan"
          control={control}
          required={true}
          rules={{
            maxLength: {
              value: 100,
              message: "Afternoon Plan cannot exceed 100 characters",
            },
            required: "Afternoon Plan is required",
          }}
        />
      </Grid>
      <Grid item xs={2.5} mt={3.5}>
        {getTrainingCampTrainingPlanData &&
        getTrainingCampTrainingPlanData.length === 1 ? (
          <CustomFormControlLabel
            control={
              <CustomCheckbox
                checked={applyDaysForTraining}
                onChange={() => {
                  if (applyDaysForTraining) {
                    setApplyDaysForTraining(false);
                  } else {
                    setApplyDaysForTraining(true);
                  }
                }}
              />
            }
            label="Apply for all Days"
            className="dubai-med"
          />
        ) : null}
      </Grid>
      <Grid item xs={12} md={12}>
        <Button
          variant="text"
          className="dubai-med text-capitalize"
          sx={{ color: "#00426A" }}
          startIcon={<AddBoxOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          {getTrainingCampTrainingPlanData &&
          getTrainingCampTrainingPlanData.length >= 1
            ? "Add Next Day"
            : "Add Day"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default TrainingDayAddMore;
