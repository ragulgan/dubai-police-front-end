"use client";
import {
  Box,
  Button,
  Grid,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "../Fields/CustomTextField";
import RecipeReviewCard from "./accordianCard";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addNutritionTemplate,
  clearNutritionTemplateAddState,
} from "@/redux/slices/nutrition/NutritionTemplateAddSlice";
import CustomSnackbar from "../CustomSnackbar";
import _ from "lodash";
import {
  editPlanTemplate,
  clearEditState,
} from "@/redux/slices/nutrition/PlanTemplateEditSlice";
import {
  updateNutritionTemplate,
  clearNutritionTemplateUpdateState,
} from "@/redux/slices/nutrition/NutritionPlanUpdateSlice";

const CreateNutritionForm = () => {
  const router = useRouter();
  const currentNav = usePathname();
  const viewTemplate = currentNav?.split("/")[5];
  const { id, sportID }: any = router?.query;
  const teamID = currentNav?.split("/")[2];
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>([]);
  const [calories, setCalories] = useState<any>("0");
  const [protiens, setProtiens] = useState<any>("0");
  const [carbs, setCarbs] = useState<any>("0");
  const [fats, setFats] = useState<any>("0");
  const [error, setError] = useState<any>({});
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const NutritionTemplateAdd = useSelector(
    (state: RootState) => state.addNutritionTemplate
  );
  const NutritionTemplateUpdate = useSelector(
    (state: RootState) => state.updateNutritionTemplate
  );
  const NutritionTemplateEdit = useSelector(
    (state: RootState) => state.editPlanTemplate
  );

  const { handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {
      nutritionPlanName: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (value: any) => {
    const newErrors: any = {};
    if (
      formData &&
      formData.filter(
        (item: any) => item?.nutritionMenuPlanSection === "Snacks"
      ).length === 0
    ) {
      newErrors.Snacks = "Please select a food in snacks";
      const element = document.getElementById("Please select a food in snacks");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
    if (
      formData &&
      formData.filter(
        (item: any) => item?.nutritionMenuPlanSection === "Dinner"
      ).length === 0
    ) {
      newErrors.Dinner = "Please select a food in dinner";
      const element = document.getElementById("Please select a food in dinner");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
    if (
      formData &&
      formData.filter((item: any) => item?.nutritionMenuPlanSection === "Lunch")
        .length === 0
    ) {
      newErrors.Lunch = "Please select a food in lunch";
      const element = document.getElementById("Please select a food in lunch");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
    if (
      formData &&
      formData.filter(
        (item: any) => item?.nutritionMenuPlanSection === "BreakFast"
      ).length === 0
    ) {
      newErrors.BreakFast = "Please select a food in breakfast";
      const element = document.getElementById(
        "Please select a food in breakfast"
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
    setError(newErrors);
    if (_.isEmpty(newErrors)) {
      if (id) {
        const payload = {
          ...value,
          sportID: Number(teamID),

          nutritionPlanID: id,
          nutritionMenuPlan: formData.map(({ file, ...rest }: any) => rest),
        };
        dispatch(
          updateNutritionTemplate({ url: "/UpdateNutritionPlanById", payload })
        );
      } else {
        const payload = {
          ...value,
          sportID: Number(teamID),

          nutritionMenuPlan: formData.map(({ file, ...rest }: any) => rest),
        };
        dispatch(
          addNutritionTemplate({ url: "/InsertNutritionPlan", payload })
        );
      }
    }
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    dispatch(clearNutritionTemplateAddState());
    router.push(`/teams/${teamID}/nutrition/planTemplate`);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        dispatch(clearNutritionTemplateAddState());
        dispatch(clearNutritionTemplateUpdateState());
        router.push(`/teams/${teamID}/nutrition/planTemplate`);
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (formData && formData) {
      setCalories(
        formData.reduce((sum: any, item: any) => sum + Number(item.calories), 0)
      );
      setProtiens(
        formData.reduce((sum: any, item: any) => sum + Number(item.proteins), 0)
      );
      setCarbs(
        formData.reduce((sum: any, item: any) => sum + Number(item.carbs), 0)
      );
      setFats(
        formData.reduce((sum: any, item: any) => sum + Number(item.fats), 0)
      );
    }
  }, [formData]);

  useEffect(() => {
    if (
      (NutritionTemplateAdd &&
        NutritionTemplateAdd.code === 200 &&
        NutritionTemplateAdd.status === "succeeded") ||
      (NutritionTemplateUpdate &&
        NutritionTemplateUpdate.code === 200 &&
        NutritionTemplateUpdate.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
    } else if (
      (NutritionTemplateAdd &&
        NutritionTemplateAdd.code === 500 &&
        NutritionTemplateAdd.status === "succeeded") ||
      (NutritionTemplateUpdate &&
        NutritionTemplateUpdate.code === 500 &&
        NutritionTemplateUpdate.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    }
  }, [NutritionTemplateAdd, NutritionTemplateUpdate]);

  useEffect(() => {
    if (id) {
      const payload: any = {
        nutritionPlanID: Number(id),
        sportID: Number(teamID) || Number(sportID),
      };
      dispatch(editPlanTemplate(payload));
    } else if (id && viewTemplate) {
      const payload: any = {
        nutritionPlanID: Number(id),
        sportID: Number(teamID) || Number(sportID),
      };
      dispatch(editPlanTemplate(payload));
    }
  }, [id, viewTemplate]);

  useEffect(() => {
    if (NutritionTemplateEdit && NutritionTemplateEdit?.code === 200) {
      setValue(
        "nutritionPlanName",
        NutritionTemplateEdit?.data?.nutritionPlanName
      );
      setFormData(NutritionTemplateEdit?.data?.menuPlanList);
    }
  }, [NutritionTemplateEdit]);

  useEffect(() => {
    return () => {
      setFormData([]);
      dispatch(clearEditState());
    };
  }, []);

  return (
    <Grid container columnSpacing={2}>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Nutrition Template ${id ? "Updated" : "Added"} successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid item xs={12}>
        <CustomTextField
          name="nutritionPlanName"
          label="Plan Name"
          placeholder="Enter New Plan Name"
          control={control}
          required={true}
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 /]*$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 100,
              message: "Plan Name cannot exceed 100 characters",
            },
            required: "Plan Name is required",
          }}
          disabled={viewTemplate === "view"}
        />
      </Grid>
      <Grid item xs={10}>
        <RecipeReviewCard
          setFormData={setFormData}
          formData={formData}
          error={error}
          setError={setError}
        />
      </Grid>
      <Grid item xs={2} mt={2}>
        <Box
          bgcolor="rgba(0, 135, 85, 0.03)"
          height={290}
          border={"1px solid #008755"}
          borderRadius={"4px"}
        >
          <Typography
            sx={{
              fontSize: "18px",
              lineHeight: "19.2px",
              textAlign: "left",
              p: 2,
              borderBottom: "1px solid #008755",
            }}
            className="bukra-semi-bold"
          >
            Total
          </Typography>
          <Box p={2} pt={1}>
            <Box
              width={"100%"}
              height={"45px"}
              bgcolor={"#E88F00"}
              borderRadius={"4px"}
              display={"grid"}
              alignContent={"center"}
              textAlign={"center"}
              sx={{ placeContent: "center" }}
              mt={1}
            >
              <Typography
                className="bukra-semi-bold"
                sx={{
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
              {Math.round(calories)}
              </Typography>
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                Calories
              </Typography>
            </Box>
            <Box
              width={"100%"}
              height={"45px"}
              bgcolor={"#00205B"}
              borderRadius={"4px"}
              display={"grid"}
              alignContent={"center"}
              textAlign={"center"}
              sx={{ placeContent: "center" }}
              mt={1}
            >
              <Typography
                className="bukra-semi-bold"
                sx={{
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                {Math.round(protiens)}
              </Typography>
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                Proteins
              </Typography>
            </Box>
            <Box
              width={"100%"}
              height={"45px"}
              bgcolor={"#008755"}
              borderRadius={"4px"}
              display={"grid"}
              alignContent={"center"}
              textAlign={"center"}
              sx={{ placeContent: "center" }}
              mt={1}
            >
              <Typography
                className="bukra-semi-bold"
                sx={{
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                {Math.round(carbs)}
              </Typography>
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                Carbs
              </Typography>
            </Box>
            <Box
              width={"100%"}
              height={"45px"}
              bgcolor={"#E4002B"}
              borderRadius={"4px"}
              display={"grid"}
              alignContent={"center"}
              textAlign={"center"}
              sx={{ placeContent: "center" }}
              mt={1}
            >
              <Typography
                className="bukra-semi-bold"
                sx={{
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                {Math.round(fats)}
              </Typography>
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                Fats
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      {viewTemplate === "view" ? null : (
        <Grid item sm={12} lg={12} textAlign={"end"} mt={5}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mr: 1 }}
            disabled={
              NutritionTemplateAdd?.loading || NutritionTemplateUpdate?.loading
            }
            onClick={() => {
              if (id) {
                router.back();
                dispatch(clearEditState());
                setFormData([]);
              } else {
                router.back();
                setFormData([]);
                dispatch(clearEditState());
              }
            }}
            className="cancel-button text-capitalize dubai-med"
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            onClick={handleSubmit(onSubmit)}
            loading={
              NutritionTemplateAdd?.loading || NutritionTemplateUpdate?.loading
            }
            variant="contained"
            className="text-capitalize dubai-med cancel-button"
            disabled={
              NutritionTemplateAdd?.loading || NutritionTemplateUpdate?.loading
            }
            sx={{ height: "48px", fontSize: "16px" }}
          >
            {id ? "Update Template" : "Save Template"}
          </LoadingButton>
        </Grid>
      )}
    </Grid>
  );
};

export default CreateNutritionForm;
