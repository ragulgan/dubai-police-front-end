"use client";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {
  Box,
  Button,
  Grid,
  Grow,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomIconButton from "../buttons/CustomIconButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { usePathname } from "next/navigation";
import AddFood from "./addFood";
import { clearFoodEditState } from "@/redux/slices/food/FoodEditSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import _ from "lodash";

export default function RecipeReviewCard(props: any) {
  const { setFormData, formData, setError, error } = props;
  const currentNav = usePathname();
  const viewTemplate = currentNav?.split("/")[5];
  const [expanded, setExpanded] = useState<any>({ 0: true });
  const theme = useTheme();
  const is2K = useMediaQuery(theme.breakpoints.up("xl"));
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const nutritionTemplate = ["BreakFast", "Lunch", "Dinner", "Snacks"];
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState<any>(null);
  const [hasValue, setHasValue] = useState<any>([]);
  const [caloriesBreakfast, setBreakfastCalories] = useState<any>("0");
  const [mealTime, setMealTime] = useState<any>("");
  const [protiensBreakfast, setBreakfastProtiens] = useState<any>("0");
  const [carbsBreakfast, setBreakfastCarbs] = useState<any>("0");
  const [fatsBreakfast, setBreakfastFats] = useState<any>("0");
  const [caloriesLunch, setLunchCalories] = useState<any>("0");
  const [protiensLunch, setLunchProtiens] = useState<any>("0");
  const [carbsLunch, setLunchCarbs] = useState<any>("0");
  const [fatsLunch, setLunchFats] = useState<any>("0");
  const [caloriesDinner, setDinnerCalories] = useState<any>("0");
  const [protiensDinner, setDinnerProtiens] = useState<any>("0");
  const [carbsDinner, setDinnerCarbs] = useState<any>("0");
  const [fatsDinner, setDinnerFats] = useState<any>("0");
  const [caloriesSnack, setSnackCalories] = useState<any>("0");
  const [protiensSnack, setSnackProtiens] = useState<any>("0");
  const [carbsSnack, setSnackCarbs] = useState<any>("0");
  const [fatsSnack, setSnackFats] = useState<any>("0");
  const dispatch: AppDispatch = useDispatch();
  const handleExpandClick = (key: any) => {
    setExpanded((prev: any) => ({ [key]: !prev[key] }));
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    dispatch(clearFoodEditState());
    setMealTime("");
  };

  const handleAddFood = (item: any) => {
    setIsOpen(true);
    setisEditData("nutrition");
    setMealTime(item);
  };

  const handleFoodRemove = (value: any) => {
    setFormData(
      formData?.filter(
        (item: any) =>
          !(
            item.foodQuantity === value?.foodQuantity &&
            item.foodName === value?.foodName &&
            item.calories === value?.calories &&
            item.proteins === value?.proteins &&
            item.carbs === value?.carbs &&
            item.fats === value?.fats &&
            item.file === value?.file &&
            item.foodID === value?.foodID &&
            item.nutritionMenuPlanSection === value?.nutritionMenuPlanSection
          )
      )
    );
  };

  useEffect(() => {
    if (formData && formData) {
      const allHaveFoodQuantity = formData.every((item: any) =>
        item.hasOwnProperty("foodQuantity")
      );
      setHasValue(allHaveFoodQuantity);
      setBreakfastCalories(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "BreakFast")
          .reduce((sum: any, item: any) => sum + Number(item.calories), 0)
      );
      setBreakfastProtiens(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "BreakFast")
          .reduce((sum: any, item: any) => sum + Number(item.proteins), 0)
      );
      setBreakfastCarbs(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "BreakFast")
          .reduce((sum: any, item: any) => sum + Number(item.carbs), 0)
      );
      setBreakfastFats(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "BreakFast")
          .reduce((sum: any, item: any) => sum + Number(item.fats), 0)
      );
      setLunchCalories(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Lunch")
          .reduce((sum: any, item: any) => sum + Number(item.calories), 0)
      );
      setLunchProtiens(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Lunch")
          .reduce((sum: any, item: any) => sum + Number(item.proteins), 0)
      );
      setLunchCarbs(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Lunch")
          .reduce((sum: any, item: any) => sum + Number(item.carbs), 0)
      );
      setLunchFats(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Lunch")
          .reduce((sum: any, item: any) => sum + Number(item.fats), 0)
      );
      setDinnerCalories(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Dinner")
          .reduce((sum: any, item: any) => sum + Number(item.calories), 0)
      );
      setDinnerProtiens(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Dinner")
          .reduce((sum: any, item: any) => sum + Number(item.proteins), 0)
      );
      setDinnerCarbs(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Dinner")
          .reduce((sum: any, item: any) => sum + Number(item.carbs), 0)
      );
      setDinnerFats(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Dinner")
          .reduce((sum: any, item: any) => sum + Number(item.fats), 0)
      );
      setSnackCalories(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Snacks")
          .reduce((sum: any, item: any) => sum + Number(item.calories), 0)
      );
      setSnackProtiens(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Snacks")
          .reduce((sum: any, item: any) => sum + Number(item.proteins), 0)
      );
      setSnackCarbs(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Snacks")
          .reduce((sum: any, item: any) => sum + Number(item.carbs), 0)
      );
      setSnackFats(
        formData
          .filter((item: any) => item?.nutritionMenuPlanSection === "Snacks")
          .reduce((sum: any, item: any) => sum + Number(item.fats), 0)
      );
      const newErrors: any = {};
      if (
        formData &&
        formData.filter(
          (item: any) => item?.nutritionMenuPlanSection === "BreakFast"
        ).length > 0
      ) {
        newErrors.BreakFast = "";
      }
      if (
        formData &&
        formData.filter(
          (item: any) => item?.nutritionMenuPlanSection === "Lunch"
        ).length > 0
      ) {
        newErrors.Lunch = "";
      }
      if (
        formData &&
        formData.filter(
          (item: any) => item?.nutritionMenuPlanSection === "Dinner"
        ).length > 0
      ) {
        newErrors.Dinner = "";
      }
      if (
        formData &&
        formData.filter(
          (item: any) => item?.nutritionMenuPlanSection === "Snacks"
        ).length > 0
      ) {
        newErrors.Snacks = "";
      }
      const errorValue: any = { ...error, newErrors };
      setError({ ...error, ...errorValue.newErrors });
    }
  }, [formData]);

  return (
    <>
      {isOpen && isEditData && (
        <AddFood
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"nutrition"}
          setFormData={setFormData}
          formData={formData}
          mealTime={mealTime}
        />
      )}
      {nutritionTemplate &&
        nutritionTemplate.map((item, key) => (
          <Card
            sx={{
              maxWidth: "100%",
              backgroundColor: "rgba(0, 135, 85, 0.03)",
              mt: 2,
            }}
            key={key}
          >
            <CardActions
              sx={{
                border: "1px solid #008755",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                borderRadius: !expanded[key] ? "4px" : "",
              }}
            >
              <Box display={"flex"} alignItems={"center"} width={"80%"}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  {item}
                </Typography>
                {error && error[item] ? (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "19.2px",
                      textAlign: "left",
                      color: "#d32f2f",
                      ml: 2,
                    }}
                    className="dubai-med"
                    id={error[item]}
                  >
                    {error[item]}
                  </Typography>
                ) : null}
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Box
                  width={"77px"}
                  height={"45px"}
                  bgcolor={"#E88F00"}
                  borderRadius={"4px"}
                  display={"grid"}
                  alignContent={"center"}
                  textAlign={"center"}
                  sx={{ placeContent: "center" }}
                >
                  <Typography
                    className="bukra-semi-bold"
                    sx={{
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  >
                    {Math.round(
                      item === "BreakFast"
                        ? caloriesBreakfast
                        : item === "Lunch"
                          ? caloriesLunch
                          : item === "Dinner"
                            ? caloriesDinner
                            : item === "Snacks"
                              ? caloriesSnack
                              : 0
                    )}
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
                  width={"77px"}
                  height={"45px"}
                  bgcolor={"#00205B"}
                  borderRadius={"4px"}
                  display={"grid"}
                  alignContent={"center"}
                  textAlign={"center"}
                  sx={{ placeContent: "center" }}
                >
                  <Typography
                    className="bukra-semi-bold"
                    sx={{
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  >
                    {Math.round(
                      item === "BreakFast"
                        ? protiensBreakfast
                        : item === "Lunch"
                          ? protiensLunch
                          : item === "Dinner"
                            ? protiensDinner
                            : item === "Snacks"
                              ? protiensSnack
                              : null)}
                  </Typography>
                  <Typography
                    className="dubai-regular"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 400,
                      fontSize: "12px",
                    }}
                  >
                    Protiens
                  </Typography>
                </Box>
                <Box
                  width={"77px"}
                  height={"45px"}
                  bgcolor={"#008755"}
                  borderRadius={"4px"}
                  display={"grid"}
                  alignContent={"center"}
                  textAlign={"center"}
                  sx={{ placeContent: "center" }}
                >
                  <Typography
                    className="bukra-semi-bold"
                    sx={{
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  >
                    {Math.round(
                      item === "BreakFast"
                        ? carbsBreakfast
                        : item === "Lunch"
                          ? carbsLunch
                          : item === "Dinner"
                            ? carbsDinner
                            : item === "Snacks"
                              ? carbsSnack
                              : null)}
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
                  width={"77px"}
                  height={"45px"}
                  bgcolor={"#E4002B"}
                  borderRadius={"4px"}
                  display={"grid"}
                  alignContent={"center"}
                  textAlign={"center"}
                  sx={{ placeContent: "center" }}
                >
                  <Typography
                    className="bukra-semi-bold"
                    sx={{
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  >
                    {Math.round(
                      item === "BreakFast"
                        ? fatsBreakfast
                        : item === "Lunch"
                          ? fatsLunch
                          : item === "Dinner"
                            ? fatsDinner
                            : item === "Snacks"
                              ? fatsSnack
                              : null)}
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
              <CustomIconButton
                icon={
                  !expanded[key] ? ArrowForwardIosOutlinedIcon : ExpandMoreIcon
                }
                isSelected={expanded[key]}
                onClick={() => handleExpandClick(key)}
              />
            </CardActions>
            <Collapse in={expanded[key]} timeout="auto" unmountOnExit>
              <CardContent
                sx={{
                  border: "1px solid #008755",
                  borderTop: "0px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              >
                <Grid container gap={2}>
                  {hasValue && formData && formData.length > 0
                    ? formData &&
                    formData
                      .filter(
                        (value: any) =>
                          value?.nutritionMenuPlanSection === item
                      )
                      .map((formData: any, index: any) => (
                        <Grow
                          in={true}
                          style={{ transformOrigin: "0 0 0" }}
                          {...(true ? { timeout: 500 + index * 200 } : {})}
                          key={index}
                        >
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={4}
                            lg={4}
                            xl={is8K ? 2.4 : is4K ? 2.4 : is2K ? 3 : 3}
                            height={290}
                            borderRadius={"4px"}
                            border={"1px solid #008755"}
                            bgcolor={"#ffffff"}
                            p={1}
                            key={index}
                          >
                            <Box
                              height={"137px"}
                              borderRadius={"4px"}
                              width={"100%"}
                              sx={{
                                backgroundImage: `url(
                                    ${_.isEmpty(formData?.filePath) &&
                                    _.isEmpty(formData?.file)
                                    ? "/staticFoodImage.svg"
                                    : formData?.filePath || formData?.file
                                  })`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                ...(_.isEmpty(formData?.filePath) &&
                                  _.isEmpty(formData?.file) && {
                                  borderRadius: "4px",
                                  backgroundPosition: "center",
                                }),
                              }}
                              position={"relative"}
                            >
                              {viewTemplate === "view" ? null : (
                                <Button
                                  variant="contained"
                                  color="error"
                                  sx={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    minWidth: "0px",
                                    position: "absolute",
                                    right: "8px",
                                    top: "8px",
                                    padding: 0,
                                    backgroundColor: "#E4002B",
                                  }}
                                  onClick={() => handleFoodRemove(formData)}
                                >
                                  <ClearOutlinedIcon />
                                </Button>
                              )}
                              <Box
                                color={"#00426A"}
                                bgcolor={"#ffffff"}
                                width={"50px"}
                                height={"23px"}
                                className="dubai-med"
                                borderRadius={"4px"}
                                textAlign={"center"}
                                fontSize={"14px"}
                                bottom={"8px"}
                                left={"8px"}
                                position={"absolute"}
                              >
                                {formData?.foodQuantity} g
                              </Box>
                            </Box>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={1}
                              justifyContent={"space-between"}
                              mt={1}
                            >
                              <Box
                                width={"57px"}
                                height={"45px"}
                                bgcolor={"#E88F00"}
                                borderRadius={"4px"}
                                display={"grid"}
                                alignContent={"center"}
                                textAlign={"center"}
                                sx={{ placeContent: "center" }}
                              >
                                <Typography
                                  className="bukra-semi-bold"
                                  sx={{
                                    color: "#ffffff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {Math.round(formData?.calories)}
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
                                width={"57px"}
                                height={"45px"}
                                bgcolor={"#00205B"}
                                borderRadius={"4px"}
                                display={"grid"}
                                alignContent={"center"}
                                textAlign={"center"}
                                sx={{ placeContent: "center" }}
                              >
                                <Typography
                                  className="bukra-semi-bold"
                                  sx={{
                                    color: "#ffffff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {Math.round(formData?.proteins)}
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
                                width={"57px"}
                                height={"45px"}
                                bgcolor={"#008755"}
                                borderRadius={"4px"}
                                display={"grid"}
                                alignContent={"center"}
                                textAlign={"center"}
                                sx={{ placeContent: "center" }}
                              >
                                <Typography
                                  className="bukra-semi-bold"
                                  sx={{
                                    color: "#ffffff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {Math.round(formData?.carbs)}
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
                                width={"57px"}
                                height={"45px"}
                                bgcolor={"#E4002B"}
                                borderRadius={"4px"}
                                display={"grid"}
                                alignContent={"center"}
                                textAlign={"center"}
                                sx={{ placeContent: "center" }}
                              >
                                <Typography
                                  className="bukra-semi-bold"
                                  sx={{
                                    color: "#ffffff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {Math.round(formData?.fats)}
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
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontWeight: 500,
                                lineHeight: "27px",
                                mt: 1,
                              }}
                              className="dubai-med webkit-line-clamp"
                            >
                              {formData?.foodName}
                            </Typography>
                          </Grid>
                        </Grow>
                      ))
                    : null}

                  {viewTemplate != "view" &&
                    formData &&
                    formData.filter(
                      (value: any) => value?.nutritionMenuPlanSection === item
                    ).length < 9 ? (
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={is8K ? 2.4 : is4K ? 2.4 : is2K ? 3 : 3}
                      height={290}
                      borderRadius={"4px"}
                      border={"1px solid #008755"}
                      bgcolor={"#ffffff"}
                      display={"grid"}
                      alignContent={"center"}
                      sx={{ placeContent: "center", placeItems: "center" }}
                    >
                      <>
                        <Tooltip title="Add food items">
                          <Button
                            variant="outlined"
                            sx={{
                              width: "64px",
                              height: "64px",
                              borderStyle: "dashed",
                              borderRadius: "50%",
                            }}
                            onClick={() => handleAddFood(item)}
                          >
                            <AddOutlinedIcon />
                          </Button>
                        </Tooltip>
                        <Typography className="bukra-semi-bold" mt={2}>
                          Add Foodhh
                        </Typography>
                      </>
                    </Grid>
                  ) : null}
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        ))}
    </>
  );
}
