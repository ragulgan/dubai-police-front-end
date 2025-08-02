"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  InputBase,
  Skeleton,
  SnackbarCloseReason,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import _ from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import AddFoodImage from "../../../public/AddFood.svg";
import StaticFoodImage from "../../../public/staticFoodImage.svg";
import AddFoodForm from "./form/addFoodForms";
import CustomIconButton from "../buttons/CustomIconButton";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SelectPopover from "./selectPopover";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { listFood } from "@/redux/slices/food/FoodListSlice";
import { usePathname } from "next/navigation";
import { filterBySearchGnT } from "@/utils/helper";
import { clearFoodEditState } from "@/redux/slices/food/FoodEditSlice";
import {
  deleteFood,
  clearFoodDeleteState,
} from "@/redux/slices/food/FoodDeleteSlice";
import CustomSnackbar from "../CustomSnackbar";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  id: number;
  module?: string;
  setFormData?: any;
  formData?: any;
  mealTime?: any;
}

const AddFood: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  module,
  setFormData,
  formData,
  mealTime,
}) => {
  const [tabValue, setTabValue] = useState<any>("searchFood");
  const [form, setForm] = useState<any>("");
  const [edit, setEdit] = useState<any>(false);
  const [clone, setClone] = useState<any>(false);
  const [foodId, setFoodId] = useState<any>(false);
  const [searchText, setSearchText] = useState("");
  const [quantity, setQuantity] = useState<any>("");
  const [indexValue, setIndexValue] = useState<any>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moreOpen, setMoreOpen] = useState<any>(null);
  const dispatch: AppDispatch = useDispatch();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const FoodList = useSelector((state: RootState) => state.listFood);
  const FoodDelete = useSelector((state: RootState) => state.deleteFood);
  const [filteredList, setFilteredList] = useState<any>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleQuantityMinus = (index: any, foodId: any) => {
    const updatedList = filteredList.map((item: any) => {
      if (item.foodID === foodId) {
        const valueToAdd = 50;
        const foodQuantity = +item.foodQuantity;
        const roundToFive = (value: number) => parseFloat(value.toFixed(2));
        return {
          ...item,
          calories: roundToFive(
            (+item.calories / foodQuantity) * (foodQuantity - valueToAdd)
          ),
          carbs: roundToFive(
            (+item.carbs / foodQuantity) * (foodQuantity - valueToAdd)
          ),
          proteins: roundToFive(
            (+item.proteins / foodQuantity) * (foodQuantity - valueToAdd)
          ),
          fats: roundToFive(
            (+item.fats / foodQuantity) * (foodQuantity - valueToAdd)
          ),
          foodQuantity: foodQuantity - valueToAdd,
        };
      }
      return item;
    });
    setFilteredList(updatedList);
    const value: any = Number(
      document.getElementById(`foodQuantity-${index}`)?.innerText
    );
    setQuantity(() => Math.max(50, Number(value) - 50));
  };

  const handleQuantityPlus = (index: any, foodId: any) => {
    const updatedList = filteredList.map((item: any) => {
      if (item.foodID === foodId) {
        const valueToAdd = 50;
        const foodQuantity = +item.foodQuantity;
        const roundToFive = (value: number) => parseFloat(value.toFixed(2));
        return {
          ...item,
          calories: roundToFive(
            (+item.calories / foodQuantity) * (foodQuantity + valueToAdd)
          ),
          carbs: roundToFive(
            (+item.carbs / foodQuantity) * (foodQuantity + valueToAdd)
          ),
          proteins: roundToFive(
            (+item.proteins / foodQuantity) * (foodQuantity + valueToAdd)
          ),
          fats: roundToFive(
            (+item.fats / foodQuantity) * (foodQuantity + valueToAdd)
          ),
          foodQuantity: foodQuantity + valueToAdd,
        };
      }
      return item;
    });
    setFilteredList(updatedList);
    const value: any = Number(
      document.getElementById(`foodQuantity-${index}`)?.innerText
    );
    setQuantity(() => Math.max(0, Number(value) + 50));
  };

  const handleMore = (event: React.MouseEvent<HTMLElement>, id: any) => {
    setFoodId(id);
    setAnchorEl(event.currentTarget);
    setMoreOpen(true);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
    setMoreOpen(false);
  };

  const handleTab = (value: any) => {
    setTabValue(value);
    setForm("");
    setEdit(false);
    setClone(false);
    dispatch(clearFoodEditState());
  };

  const handleDelete = () => {
    const payload = {
      foodID: foodId,
    };
    dispatch(deleteFood({ url: "/DeleteFoodByID", payload }));
    handleCloseMore();
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

  const handleFoodAdd = (food: any) => {
    setFormData([
      ...formData,
      {
        foodQuantity: Number(food?.foodQuantity),
        foodName: food?.foodName,
        calories: Number(food?.calories),
        proteins: Number(food?.proteins),
        carbs: Number(food?.carbs),
        fats: Number(food?.fats),
        file: food?.filePath,
        foodID: food?.foodID,
        nutritionMenuPlanSection: mealTime && mealTime,
      },
    ]);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    let filteredList = filterBySearchGnT(FoodList.data, searchText.trim());
    setFilteredList(filteredList);
  }, [searchText]);

  useEffect(() => {
    if (FoodList?.code === 200 && formData && formData.length === 0) {
      setFilteredList(FoodList?.data);
    } else if (formData && formData.length > 0 && FoodList?.code === 200) {
      const selectedFoodIDs = formData
        .filter((food: any) => food.nutritionMenuPlanSection === mealTime)
        .map((food: any) => food.foodID);
      const filteredFoods =
        FoodList &&
        FoodList?.data.filter(
          (food: any) => !selectedFoodIDs.includes(food.foodID)
        );
      setFilteredList(filteredFoods);
    }
  }, [FoodList, formData]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen && FoodDelete.status === "succeeded") {
      timeoutId = setTimeout(() => {
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamID),
        };
        dispatch(listFood({ url: "/GetFoodList", payload }));
      }, 1000);
      dispatch(clearFoodDeleteState());
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 0,
      sportID: Number(teamID),
    };
    dispatch(listFood({ url: "/GetFoodList", payload }));
  }, []);

  useEffect(() => {
    if (
      FoodDelete &&
      FoodDelete.code === 200 &&
      FoodDelete.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
    } else if (
      FoodDelete &&
      FoodDelete.code === 500 &&
      FoodDelete.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    }
  }, [FoodDelete]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 550,
          py: 2,
        },
      }}
    >
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Food Deleted successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={"1px solid rgba(88, 88, 91, 0.4)"}
        pb={1.5}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {edit ? "Edit Food" : clone ? "Clone Food" : "Add Food"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <Box display={"flex"} borderBottom={"1px solid rgba(88, 88, 91, 0.4)"}>
          <Button
            sx={{
              p: 2,
              px: 3,
              borderRadius: "0px",
              fontSize: "16px",
              border: "0px",
            }}
            variant={tabValue === "searchFood" ? "contained" : "outlined"}
            className="text-capitalize dubai-regular"
            onClick={() => handleTab("searchFood")}
          >
            Search Food
          </Button>
          <Button
            sx={{
              p: 2,
              px: 3,
              borderRadius: "0px",
              fontSize: "16px",
              border: "0px",
              borderRight: "1px solid rgba(88, 88, 91, 0.4)",
            }}
            variant={tabValue === "manageFood" ? "contained" : "outlined"}
            className="text-capitalize dubai-regular"
            onClick={() => {
              handleTab("manageFood");
              setSearchText("");
            }}
          >
            Manage Food
          </Button>
        </Box>
        <Box p={3}>
          {tabValue === "manageFood" ? (
            form === "form" || clone || edit ? (
              <AddFoodForm
                setForm={setForm}
                edit={edit}
                clone={clone}
                setEdit={setEdit}
                setClone={setClone}
                setTabValue={setTabValue}
                foodId={foodId}
              />
            ) : (
              <>
                {FoodList && FoodList?.loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Box
                      border={"1px solid #008755"}
                      borderRadius={"16px"}
                      p={2}
                      display={"flex"}
                      mt={2}
                    >
                      <Skeleton
                        variant="rectangular"
                        width={104}
                        height={130}
                      />
                      <Box px={2} width={"240px"}>
                        <Box display={"flex"} alignItems={"center"} gap={0.5}>
                          {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                              variant="rectangular"
                              width={"57px"}
                              height={"45px"}
                            />
                          ))}
                        </Box>
                        <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                      </Box>
                      <Box width={"100px"}>
                        <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                        <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                        <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                      </Box>
                    </Box>
                  ))
                ) : FoodList && FoodList.data && FoodList.data.length === 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      placeContent: "center",
                      placeItems: "center",
                      alignContent: "center",
                      height: "70vh",
                    }}
                  >
                    <AddFoodImage width="200" height="144" />
                    <Button
                      variant="contained"
                      className="dubai-med text-capitalize"
                      sx={{
                        borderRadius: "0",
                        fontSize: "18px",
                        mt: 1,
                      }}
                      endIcon={<AddIcon />}
                      onClick={() => setForm("form")}
                    >
                      Create a New Food
                    </Button>
                    <Typography
                      className="dubai-med"
                      sx={{ color: "#58585B", mt: 1 }}
                    >
                      Add new food to your existing list.
                    </Typography>
                  </Box>
                ) : FoodList && FoodList.message === "Error" ? (
                  <Box p={3}>
                    <Alert className="dubai-med" severity="error">
                      Something went wrong
                    </Alert>
                  </Box>
                ) : (
                  <>
                    <Box textAlign={"end"}>
                      <Button
                        variant="contained"
                        className="dubai-med text-capitalize"
                        sx={{
                          borderRadius: "0",
                          fontSize: "18px",
                        }}
                        endIcon={<AddIcon />}
                        onClick={() => setForm("form")}
                      >
                        Create a New Food
                      </Button>
                    </Box>
                    {FoodList &&
                      FoodList.data &&
                      FoodList?.data?.map((food: any) => (
                        <Box
                          border={"1px solid #008755"}
                          borderRadius={"16px"}
                          p={2}
                          display={"flex"}
                          mt={2}
                        >
                          {food && _.isEmpty(food.filePath) ? (
                            <StaticFoodImage
                              style={{ objectFit: "cover" }}
                              width={104}
                              height={130}
                            />
                          ) : (
                            <img
                              src={food && food.filePath}
                              style={{ objectFit: "cover" }}
                              width={104}
                              height={130}
                            />
                          )}
                          <Box px={2} width={"240px"}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={0.5}
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
                                  {food && food.calories}
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
                                  {food && food.proteins}
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
                                  {food && food.carbs}
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
                                  {food && food.fats}
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
                              mt={2}
                              className="bukra webkit-line-clamp"
                              lineHeight={"27px"}
                              sx={{ fontWeight: "500" }}
                            >
                              {food && food.foodName}
                            </Typography>
                          </Box>
                          <Box textAlign={"end"} width={"120px"}>
                            <Box sx={{ placeItems: "end" }}>
                              <Typography
                                className="bukra"
                                sx={{
                                  border: "1px solid #008755",
                                  p: 1,
                                  borderRadius: "4px",
                                  width: "80px",
                                  textAlign: "center",
                                  color: "#008755",
                                }}
                              >
                                {food?.foodQuantity} g
                              </Typography>
                            </Box>
                            <Box mt={6}>
                              <CustomIconButton
                                icon={MoreVertOutlinedIcon}
                                onClick={(e: any) =>
                                  handleMore(e, food && food.foodID)
                                }
                                isSelected={false}
                                margin={false}
                              />
                              <SelectPopover
                                open={moreOpen}
                                onClose={handleCloseMore}
                                anchorEl={anchorEl}
                                setEdit={setEdit}
                                setClone={setClone}
                                setTabValue={setTabValue}
                                handleDelete={handleDelete}
                                FoodDelete={FoodDelete}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </>
                )}
              </>
            )
          ) : (
            <>
              <Box
                display={"flex"}
                alignItems={"center"}
                border={"1px solid #008755"}
                borderRadius={"4px"}
                p={0.5}
                bgcolor={"rgba(0, 135, 85, 0.03)"}
              >
                <SearchIcon
                  color="secondary"
                  sx={{ width: "24px", height: "24px" }}
                />
                <InputBase
                  className="dubai-med"
                  sx={{ ml: 1 }}
                  placeholder="Search Food Name"
                  inputProps={{ "aria-label": "Search Food Name" }}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                  }}
                />
              </Box>
              {FoodList && FoodList?.loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Box
                    border={"1px solid #008755"}
                    borderRadius={"16px"}
                    p={2}
                    display={"flex"}
                    mt={2}
                  >
                    <Skeleton variant="rectangular" width={104} height={130} />
                    <Box px={2} width={"240px"}>
                      <Box display={"flex"} alignItems={"center"} gap={0.5}>
                        {Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton
                            variant="rectangular"
                            width={"57px"}
                            height={"45px"}
                          />
                        ))}
                      </Box>
                      <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                    </Box>
                    <Box width={"100px"}>
                      <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                      <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                      <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                    </Box>
                  </Box>
                ))
              ) : FoodList && FoodList.status === "idle" ? (
                <></>
              ) : FoodList && FoodList.message === "Error" ? (
                <Box p={3}>
                  <Alert className="dubai-med" severity="error">
                    Something went wrong
                  </Alert>
                </Box>
              ) : (
                filteredList &&
                filteredList &&
                filteredList?.map((food: any, index: any) => (
                  <Box
                    border={"1px solid #008755"}
                    borderRadius={"16px"}
                    p={2}
                    display={"flex"}
                    mt={2}
                  >
                    {food && _.isEmpty(food.filePath) ? (
                      <StaticFoodImage
                        style={{ objectFit: "cover" }}
                        width={104}
                        height={130}
                      />
                    ) : (
                      <img
                        src={food && food.filePath}
                        style={{ objectFit: "cover" }}
                        width={104}
                        height={130}
                      />
                    )}
                    <Box px={2} width={"240px"}>
                      <Box display={"flex"} alignItems={"center"} gap={0.5}>
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
                            {food && food.calories}
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
                            {food && food.proteins}
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
                            {food && food.carbs}
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
                            {food && food.fats}
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
                        mt={2}
                        className="bukra webkit-line-clamp"
                        lineHeight={"27px"}
                        sx={{ fontWeight: "500" }}
                      >
                        {food && food.foodName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        className="dubai-med"
                        sx={{ fontSize: "16px", fontWeight: 400 }}
                      >
                        Quantity in gram
                      </Typography>
                      <Box
                        display={"flex"}
                        border={"1px solid #008755"}
                        borderRadius={"8px"}
                        mt={1}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            minWidth: "0px",
                            borderTopRightRadius: "0px",
                            borderBottomRightRadius: "0px",
                            px: 1.7,
                          }}
                          onClick={() => {
                            handleQuantityMinus(index, food?.foodID);
                            setIndexValue(index);
                          }}
                          disabled={
                            (indexValue === index && quantity === 50) ||
                            food?.foodQuantity <= 50
                          }
                        >
                          -
                        </Button>
                        <Typography
                          className="bukra"
                          width={"51px"}
                          height={"37px"}
                          sx={{
                            placeContent: "center",
                            textAlign: "center",
                          }}
                          id={`foodQuantity-${index}`}
                        >
                          {indexValue === index ? quantity : food?.foodQuantity}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            minWidth: "0px",
                            borderTopLeftRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            px: 1.5,
                          }}
                          onClick={() => {
                            handleQuantityPlus(index, food?.foodID);
                            setIndexValue(index);
                          }}
                          disabled={
                            (indexValue === index && quantity === 1000) ||
                            food?.foodQuantity >= 1000
                          }
                        >
                          +
                        </Button>
                      </Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"end"}
                        mt={3}
                      >
                        <Button
                          variant="contained"
                          className="dubai-med text-capitalize"
                          onClick={() => handleFoodAdd(food)}
                        >
                          Select
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddFood;
