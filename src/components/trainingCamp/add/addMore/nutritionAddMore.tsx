import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomFormControlLabel from "@/components/Forms/CustomFormControlLabel";
import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useForm } from "react-hook-form";

const NutritionDayAddMore = (props: any) => {
  const {
    setApplyDaysForNutrition,
    applyDaysForNutrition,
    setNutritionPlanData,
    nutritionPlanData,
    getTrainingCampNutritionPlanData,
    nutritionPlanSelectedData,
    setNutritionPlanSelectedData,
    setResetForm,
    resetForm,
  } = props;

  const { handleSubmit, control, setValue, reset } = useForm<any>({
    defaultValues: {
      dayNutritionPlan: null,
      morningNutritionPlan: null,
      afternoonNutritionPlan: null,
      dinnerNutritionPlan: null,
    },
  });

  const onSubmit = (data: any) => {
    setNutritionPlanData([...nutritionPlanData, data]);
    setNutritionPlanSelectedData([]);
    setApplyDaysForNutrition(false);
  };

  useEffect(() => {
    setValue(
      "dayNutritionPlan",
      `Day ${
        getTrainingCampNutritionPlanData &&
        getTrainingCampNutritionPlanData.length === undefined
          ? 1
          : getTrainingCampNutritionPlanData.length + 1
      }`
    );
  }, [getTrainingCampNutritionPlanData]);

  useEffect(() => {
    if (nutritionPlanSelectedData && nutritionPlanSelectedData.length > 0) {
      setValue(
        "dayNutritionPlan",
        nutritionPlanSelectedData &&
          nutritionPlanSelectedData[0] &&
          nutritionPlanSelectedData[0].dayNutritionPlan
      );
      setValue(
        "morningNutritionPlan",
        nutritionPlanSelectedData &&
          nutritionPlanSelectedData[0] &&
          nutritionPlanSelectedData[0].morningNutritionPlan
      );
      setValue(
        "afternoonNutritionPlan",
        nutritionPlanSelectedData &&
          nutritionPlanSelectedData[0] &&
          nutritionPlanSelectedData[0].afternoonNutritionPlan
      );
      setValue(
        "dinnerNutritionPlan",
        nutritionPlanSelectedData &&
          nutritionPlanSelectedData[0] &&
          nutritionPlanSelectedData[0].dinnerNutritionPlan
      );
    }
  }, [nutritionPlanSelectedData]);

  useEffect(() => {
    if (resetForm) {
      setNutritionPlanData([]);
      reset({
        dayNutritionPlan: "Day 1",
        morningNutritionPlan: "",
        afternoonNutritionPlan: "",
        dinnerNutritionPlan: "",
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
          name="dayNutritionPlan"
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
          name="morningNutritionPlan"
          label="Morning"
          placeholder="Enter Nutrition Plan"
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
          name="afternoonNutritionPlan"
          label="Afternoon"
          placeholder="Enter Nutrition Plan"
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
      <Grid item xs={2.5}>
        <CustomTextField
          name="dinnerNutritionPlan"
          label="Dinner"
          placeholder="Enter Nutrition Plan"
          control={control}
          required={true}
          rules={{
            maxLength: {
              value: 100,
              message: "Dinner Plan cannot exceed 100 characters",
            },
            required: "Dinner Plan is required",
          }}
        />
      </Grid>
      <Grid item xs={2.5} mt={3.5}>
        {getTrainingCampNutritionPlanData &&
        getTrainingCampNutritionPlanData.length === 1 ? (
          <CustomFormControlLabel
            control={
              <CustomCheckbox
                checked={applyDaysForNutrition}
                onChange={() => {
                  if (applyDaysForNutrition) {
                    setApplyDaysForNutrition(false);
                  } else {
                    setApplyDaysForNutrition(true);
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
          {getTrainingCampNutritionPlanData &&
          getTrainingCampNutritionPlanData.length >= 1
            ? "Add Next Day"
            : "Add Day"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default NutritionDayAddMore;
