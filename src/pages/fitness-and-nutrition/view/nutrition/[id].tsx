import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";

import CustomButton from "@/components/buttons/CustomButton";
// import BackIcon from "../../../../../../public/backIcon.svg";
import BackIcon from "../../../../../public/backIcon.svg";
import SpeedometerOverWeight from "../../../../../public/speedometerOverWeight.svg";
import SpeedometerLowWeight from "../../../../../public/speedometerLowWeight.svg";
import SpeedometerNormalWeight from "../../../../../public/speedometerNormalWeight.svg";
import SpeedometerHeavyWeight from "../../../../../public/speedometerHeavyWeight.svg";
import { useRouter } from "next/router";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { clearEditState } from "@/redux/slices/nutrition/PlanTemplateEditSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editNutrition } from "@/redux/slices/nutrition/NutritionEditSlice";
import NutritionDetailItemCard from "@/components/nutrition/view/NutrionDetailItemCard";
import NutritionChip from "@/components/nutrition/chip/NutritionChip";
import EditNutrition from "@/components/nutrition/form/editNutrition";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ViewNutrition = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sportID: any = urlParams.get("sportID");
  const router = useRouter();
  const { id, pageView } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Fitness & Nutrition",
      route: `/fitness-and-nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Nutrition",
      route: `/fitness-and-nutrition?module=nutrition&pageView=${pageView}`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/fitness-and-nutrition/view/nutrition/${id}`,
      currentPage: true,
      disabled: false,
    },
  ];

  const bmiTable = [
    { minHight: 152, maxHight: 155, averageWeight: "44-58 kg" },
    { minHight: 156, maxHight: 160, averageWeight: "47-61 kg" },
    { minHight: 161, maxHight: 165, averageWeight: "50-65 kg" },
    { minHight: 166, maxHight: 170, averageWeight: "54-69 kg" },
    { minHight: 171, maxHight: 175, averageWeight: "57-74 kg" },
    { minHight: 176, maxHight: 180, averageWeight: "60-78 kg" },
    { minHight: 181, maxHight: 185, averageWeight: "64-83 kg" },
    { minHight: 186, maxHight: 190, averageWeight: "67-87 kg" },
    { minHight: 191, maxHight: 200, averageWeight: "71-89 kg" },
  ];

  const getAverageWeight = () => {
    let averageWeight = bmiTable[2].averageWeight;

    if (nutritionData?.height) {
      const height = Number(nutritionData?.height);
      const average = bmiTable.filter(
        (item) => height >= item.minHight && height <= item.maxHight
      );
      if (average && average.length) {
        averageWeight = average[0].averageWeight;
      }
    }
    return averageWeight;
  };

  const getNutritionDetails = () => {
    const payload: any = {
      nutritionID: Number(id),
      sportID: Number(sportID),

    };
    dispatch(editNutrition(payload));
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.FitnessNutritionView)) {
      if (id && !showEditDialog) {
        getNutritionDetails();
      }
    } else {
      router.push('/access-denied')
    }
  }, [id, showEditDialog]);

  const editNutritionData = useSelector(
    (state: RootState) => state.editNutrition
  );

  const nutritionData: any = editNutritionData && editNutritionData.data;

  return (
    <>
      <Box p={1}
        sx={{
          height: "100vh",
          overflowX: "auto",
        }}
      >
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
              dispatch(clearEditState());
            }}
          />
        </Box>
        <Grid container mt={1}>
          <Grid
            item
            xs={12}
            display={"flex"}
            className="bg-white"
            borderRadius={1}
            p={3}
          >
            <Box width={"60%"}>
              <Typography
                className="bukra-semi-bold primary-color text-capitalize"
                fontSize={"24px"}
              >
                {nutritionData
                  ? `${nutritionData?.athleteFirstName} ${nutritionData?.athleteMiddleName} ${nutritionData?.athleteSurName}`
                  : ""}
              </Typography>
              <Box mt={1.5} display={"flex"}>
                <Typography
                  sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  borderRadius={"8px"}
                  width={"auto"}
                  className="dubai-regular"
                >
                  Start Date:{" "}
                  <span className="dubai-med">{nutritionData?.startDate}</span>
                  &nbsp;&nbsp; End Date:{" "}
                  <span className="dubai-med">{nutritionData?.endDate}</span>
                </Typography>
              </Box>
              <Box display={"flex"} alignItems={"center"} mt={1} gap={1}>
                <NutritionChip
                  bgColor="#E88F00"
                  label="Calories"
                  value={nutritionData.totalCalories}
                />
                <NutritionChip
                  bgColor="#00205B"
                  label="Proteins"
                  value={nutritionData.totalProteins}
                />
                <NutritionChip
                  bgColor="#008755"
                  label="Carbs"
                  value={nutritionData.totalCarbs}
                />
                <NutritionChip
                  bgColor="#E4002B"
                  label="Fats"
                  value={nutritionData.totalFats}
                />
                {checkAccess(1087) ? <Button
                  variant="outlined"
                  size="large"
                  className="dubai-med text-capitalize"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => {
                    router.push(
                      `/fitness-and-nutrition/view/nutrition/planTemplate/view?id=${Number(
                        nutritionData?.planID
                      )}&sportID=${sportID}`
                    );

                  }}
                >
                  View Plan
                </Button> : null}
              </Box>
              <Box display={"flex"} alignItems={"center"} mt={2} gap={2}>
                <NutritionDetailItemCard
                  label="Plan name"
                  value={nutritionData.planName}
                />
                <NutritionDetailItemCard
                  label="Weight"
                  value={nutritionData.weight}
                />
                <NutritionDetailItemCard
                  label="Height"
                  value={nutritionData.height}
                />
                <NutritionDetailItemCard label="Age" value={nutritionData.age} />
                <NutritionDetailItemCard
                  label="Gender"
                  value={nutritionData.gender}
                />
              </Box>
            </Box>
            <Box width={"40%"} textAlign={"center"}>
              {Number(nutritionData?.bmi < 18.5) ? (
                <SpeedometerLowWeight width="218px" height="134px" />
              ) : Number(
                nutritionData?.bmi >= 18.5 && nutritionData?.bmi <= 25
              ) ? (
                <SpeedometerNormalWeight width="218px" height="134px" />
              ) : Number(nutritionData?.bmi >= 25 && nutritionData?.bmi <= 30) ? (
                <SpeedometerOverWeight width="218px" height="134px" />
              ) : Number(nutritionData?.bmi >= 30) ? (
                <SpeedometerHeavyWeight width="218px" height="134px" />
              ) : (
                <SpeedometerLowWeight width="218px" height="134px" />
              )}
              <Typography
                sx={{
                  fontSize: "24px",
                  color: "#008755",
                  mt: -5,
                }}
                className="bukra-semi-bold"
              >
                {nutritionData?.bmi}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#58585B",
                  mt: 1,
                }}
                className="bukra"
              >
                BMI Value
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#58585B",
                  mt: 2,
                }}
                className="dubai-med"
              >
                Healthy weight for the height:{" "}
                <span style={{ fontSize: "18px", fontWeight: 700 }}>
                  {getAverageWeight()}
                </span>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} mt={1}>
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Nutritionist Comment"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  {nutritionData?.nutritionistComment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ViewNutrition;
