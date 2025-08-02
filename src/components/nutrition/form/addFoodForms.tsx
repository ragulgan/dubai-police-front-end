"use client";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  SnackbarCloseReason,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import _ from "lodash";
import CustomTextField from "../../Fields/CustomTextField";
import LoadingButton from "@mui/lab/LoadingButton";
import AddFoodImage from "../../../../public/ImageAddFood.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addFood, clearFoodAddState } from "@/redux/slices/food/FoodAddSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  editFood,
  clearFoodEditState,
} from "@/redux/slices/food/FoodEditSlice";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import {
  updateFood,
  clearFoodUpdateState,
} from "@/redux/slices/food/FoodUpdateSlice";
import { listFood } from "@/redux/slices/food/FoodListSlice";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  clearState,
  foodFileUpload,
} from "@/redux/slices/fileupload/foodFileUpload";
import { convertToBinaryFile } from "@/utils/helper";

const AddFoodForm: React.FC<any> = ({
  setForm,
  edit,
  setEdit,
  setClone,
  clone,
  foodId,
}) => {
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const dispatch: AppDispatch = useDispatch();
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const FoodAdd = useSelector((state: RootState) => state.addFood);
  const FoodEdit = useSelector((state: RootState) => state.editFood);
  const FoodUpdate = useSelector((state: RootState) => state.updateFood);
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const [image, setImage] = useState<any>("");
  const foodUpload = useSelector((state: any) => state.foodUpload);
  const { handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {
      foodQuantity: "",
      foodName: "",
      calories: "",
      proteins: "",
      carbs: "",
      fats: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    if (edit) {
      const payload = {
        ...formData,
        foodID: foodId,
        
      };
      dispatch(updateFood({ url: "/UpdateFoodById", payload }));
    } else {
      const payload = {
        ...formData,
        sportID: Number(teamId),
        
      };
      dispatch(addFood({ url: "/InsertFood", payload }));
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
  };

  const handleFileChange = (
    file: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    if (file) {
      setImage((prevData: any) => ({
        ...prevData,
        [flag]: {
          file,
          modulename,
          moduleId,
          section: flag,
          
        },
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageData((prevData: any) => ({
          ...prevData,
          ProfileImage:
            flag === DROPZONE_IMAGE_FLAG.NUTRITION
              ? result
              : prevData.ProfileImage,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (foodUpload.code === 200) {
      dispatch(clearState());
    }
  }, [foodUpload]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setForm("");
        setEdit(false);
        setClone(false);
        setSnackbarOpen(false);
        dispatch(clearFoodAddState());
        dispatch(clearFoodUpdateState());
        dispatch(clearFoodEditState());
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamId),
          
        };
        dispatch(listFood({ url: "/GetFoodList", payload }));
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (
      (FoodAdd && FoodAdd.code === 200 && FoodAdd.status === "succeeded") ||
      (FoodUpdate &&
        FoodUpdate.code === 200 &&
        FoodUpdate.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      const fileFlags = ["Food"];
      fileFlags.forEach((flag) => {
        const fileData = image?.[flag as keyof typeof image];
        if (fileData && fileData.file) {
          const formData = new FormData();
          formData.append("file", fileData.file);
          formData.append("moduleName", fileData.modulename);
          formData.append("moduleID", "1");
          formData.append(
            "foodID",
            FoodAdd.data.foodID || FoodUpdate.data.foodID
          );
          formData.append("section", fileData.section);
          formData.append("sportID", teamId);
          dispatch(foodFileUpload(formData));
        }
      });
    } else if (
      (FoodAdd && FoodAdd.code === 500 && FoodAdd.status === "succeeded") ||
      (FoodUpdate &&
        FoodUpdate.code === 500 &&
        FoodUpdate.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    }
  }, [FoodAdd, FoodUpdate]);

  useEffect(() => {
    if (edit || clone) {
      const payload = {
        sportID: Number(teamId),
        
        foodID: foodId,
      };
      dispatch(editFood({ url: "/GetFoodByID", payload }));
    }
  }, [edit, clone]);

  useEffect(() => {
    if (FoodEdit && FoodEdit.code === 200) {
      (async function () {
        const file = await convertToBinaryFile(FoodEdit?.data?.filePath);
        setImage({
          Food: {
            file: file && file,
            modulename: "Nutrition",
            section: "Food",
            
          },
        });
      })();
      setValue("foodQuantity", FoodEdit?.data?.foodQuantity);
      setValue("foodName", FoodEdit?.data?.foodName);
      setValue("calories", FoodEdit?.data?.calories);
      setValue("proteins", FoodEdit?.data?.proteins);
      setValue("carbs", FoodEdit?.data?.carbs);
      setValue("fats", FoodEdit?.data?.fats);
      setImageData({ ...imageData, ProfileImage: FoodEdit?.data?.filePath });
    }
  }, [FoodEdit]);

  return (
    <Fade in={true} timeout={1000}>
      {FoodEdit && FoodEdit.loading ? (
        <FieldSkeleton isAvatar={true} />
      ) : (
        <Grid container columnSpacing={5} rowSpacing={3} component={"form"}>
          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? `Food ${edit ? "Update" : "Added"} successfully!`
                  : "Something went wrong"
              }
              severity={snackbarStatus === "success" ? "success" : "error"}
              open={snackbarOpen}
              onClose={handleSnackBarClose}
            />
          )}
          <Grid item sm={12} lg={12}>
            <Typography
              variant="titleStyle"
              sx={{ fontSize: "14px" }}
              className="typography textfield-label bukra"
              mb={0.5}
            >
              Image
            </Typography>
            <Box>
              <Stack alignItems="flex-start">
                <div className="avatarContainer">
                  {imageData?.ProfileImage ? (
                    <img
                      src={imageData?.ProfileImage}
                      alt="ProfileImage"
                      width={"120px"}
                      height={"120px"}
                    />
                  ) : (
                    <AddFoodImage width={"120px"} height={"120px"} />
                  )}
                  <IconButton className="iconButton" component="label">
                    <CameraAltIcon className="cameraIcon" />
                    <FileUpload
                      onFileChange={(
                        file: any,
                        flag: any,
                        modulename: any,
                        moduleId: any
                      ) => handleFileChange(file, flag, modulename, moduleId)}
                      formatType={FILE_FORMAT_TYPE}
                      type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                      flag={DROPZONE_IMAGE_FLAG.NUTRITION}
                      // moduleId={id}
                      modulename={"Nutrition"}
                      setData={setImageData}
                      formData={imageData}
                    />
                  </IconButton>
                </div>
              </Stack>
            </Box>
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="foodQuantity"
              label={`Food Quantity (g)`}
              placeholder="Enter Food Quantity in multiple of 50"
              control={control}
              required={true}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              rules={{
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 4,
                  message: "Food Quantity cannot exceed 4 characters",
                },
                required: "Food Quantity is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="foodName"
              label={`Food Name`}
              placeholder="Enter Food Name"
              control={control}
              required={true}
              rules={{
                pattern: {
                  value: /^[a-zA-Z /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 50,
                  message: "Food Name cannot exceed 50 characters",
                },
                required: "Food Name is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="calories"
              label={`Calories (kcal)`}
              placeholder="Enter Calories"
              control={control}
              required={true}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              rules={{
                pattern: {
                  value: /^[0-9. /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 4,
                  message: "Calories cannot exceed 4 characters",
                },
                required: "Calories is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="proteins"
              label={`Proteins (g)`}
              placeholder="Enter Proteins"
              control={control}
              required={true}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              rules={{
                pattern: {
                  value: /^[0-9. /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 4,
                  message: "Proteins cannot exceed 4 characters",
                },
                required: "Proteins is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="carbs"
              label={`Carbs (g)`}
              placeholder="Enter Carbs"
              control={control}
              required={true}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              rules={{
                pattern: {
                  value: /^[0-9. /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 4,
                  message: "Carbs cannot exceed 4 characters",
                },
                required: "Carbs is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <CustomTextField
              name="fats"
              label={`Fats (g)`}
              placeholder="Enter Fats"
              control={control}
              required={true}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              rules={{
                pattern: {
                  value: /^[0-9. /]*$/,
                  message: "Invalid Format",
                },
                maxLength: {
                  value: 4,
                  message: "Fats cannot exceed 4 characters",
                },
                required: "Fats is required",
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12} textAlign={"end"} mt={5}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
              onClick={() => {
                setForm("");
                setEdit(false);
                setClone(false);
                dispatch(clearFoodEditState());
              }}
              className="cancel-button text-capitalize dubai-med"
              disabled={FoodUpdate?.loading || FoodAdd?.loading}
            >
              Back
            </Button>
            <LoadingButton
              type="submit"
              onClick={handleSubmit(onSubmit)}
              loading={FoodUpdate?.loading || FoodAdd?.loading}
              disabled={FoodUpdate?.loading || FoodAdd?.loading}
              variant="contained"
              className="text-capitalize dubai-med cancel-button"
              sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
            >
              {clone ? "Clone Food" : edit ? "Update" : "Save Food"}
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </Fade>
  );
};

export default AddFoodForm;
