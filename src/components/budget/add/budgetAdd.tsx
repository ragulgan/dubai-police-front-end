"use client";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { Button, CircularProgress, SnackbarCloseReason } from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import BudgetItemAdd from "./budgetItemAdd";
import {
  addBudget,
  clearBudgetAddState,
} from "@/redux/slices/budget/budgetAddSlice";
import { addBudgetItem } from "@/redux/slices/budget/budgetItemsAddSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  UpdateBudget,
  clearBudgetUpdateState,
} from "@/redux/slices/budget/budgetUpdateSlice";
import moment from "moment";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";

interface BudgetProps {
  edit?: any;
  id?: any;
  budgetEditData?: any;
  mode?: any;
}

const BudgetAdd: React.FC<BudgetProps> = ({ edit, id, budgetEditData, mode }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { teamID } = router.query;
  const [budgetItem, setBudgetItem] = React.useState<any>([]);
  const budgetAddData = useSelector((state: RootState) => state.budgetsAdd);
  const budgetsUpdate = useSelector((state: RootState) => state.budgetsUpdate);
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");

  const { handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {
      budgetType: null,
      budgetName: "",
      createdBy: "Dubai Police Admin",
      budgetCreatedDate: moment(),
      budgetDescription: "",
    },
  });

  const onSubmit = (data: any) => {
    if (edit) {
      const payload: any = {
        ...data,
        budgetCreatedDate: moment(data && data?.budgetCreatedDate).format(
          "DD/MM/YYYY"
        ),

        sportID: Number(teamID),
        budgetID: id,
      };
      dispatch(
        UpdateBudget({
          url: "/UpdateBudgetByID",
          payload: payload,
        })
      );
    } else {
      const payload: any = {
        ...data,
        budgetCreatedDate: moment(data && data?.budgetCreatedDate).format(
          "DD/MM/YYYY"
        ),

        sportID: Number(teamID),
      };
      dispatch(
        addBudget({
          url: "/InsertBudget",
          payload: payload,
        })
      );
    }
  };

  const handleCancel = () => {
    router.back();
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

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  React.useEffect(() => {
    if (
      (budgetAddData && budgetAddData.code === 200) ||
      (budgetsUpdate && budgetsUpdate.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearBudgetAddState());
      dispatch(clearBudgetUpdateState());
      const payload: any = {
        budgetID:
          (budgetAddData &&
            budgetAddData.data &&
            budgetAddData.data?.budgetID) ||
          id,

        budgetItems: budgetItem && budgetItem,
        sportID: Number(teamID),
      };
      dispatch(
        addBudgetItem({
          url: edit ? "/UpdateBudgetItemsByID" : "/InsertBudgetItems",
          payload: payload,
        })
      );
      setTimeout(() => {
        router.push(`/teams/${teamID}/budget`);
      }, 1000);
    } else if (
      (budgetAddData && budgetAddData.code === 500) ||
      (budgetsUpdate && budgetsUpdate.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearBudgetAddState());
      dispatch(clearBudgetUpdateState());
    } else if (
      (budgetAddData && budgetAddData.code === 409) ||
      (budgetsUpdate && budgetsUpdate.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearBudgetAddState());
        dispatch(clearBudgetUpdateState());
      }, 2000);
    }
  }, [budgetAddData, budgetsUpdate]);

  React.useEffect(() => {
    if (budgetEditData && budgetEditData?.code === 200) {
      setValue(
        "budgetType",
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetType
      );
      setValue(
        "budgetName",
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetName
      );
      setValue(
        "createdBy",
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.createdby
      );
      setValue(
        "budgetDescription",
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetDescription
      );
      setValue(
        "budgetCreatedDate",
        moment(
          budgetEditData &&
          budgetEditData?.data &&
          budgetEditData?.data[0] &&
          budgetEditData?.data[0]?.budgetCreatedDate,
          "DD/MM/YYYY"
        )
      );
      setBudgetItem(
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetItemList
      );
    }
  }, [budgetEditData]);

  return (
    <>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Budget ${edit ? "Updated" : "Added"} successfully!`
              : (budgetAddData && budgetAddData?.message) ||
              (budgetsUpdate && budgetsUpdate?.message)
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid container spacing={0}>
        <Box
          sx={{
            width: "100%",
            paddingTop: "20px",
            paddingLeft: "48px",
            paddingRight: "48px",
          }}
        >
          {budgetEditData && budgetEditData?.loading ? (
            <EditFieldSkeleton isAvatar={false} />
          ) : (
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
                <Grid item xs={12} md={5.75} mt={0.5}>
                  <CustomRadioGroup
                    name="budgetType"
                    control={control}
                    label="Budget Type"
                    options={[
                      { value: "Provisional", label: "Provisional" },
                      { value: "Actual", label: "Actual" },
                    ]}
                    required={true}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <CustomTextField
                    name="budgetName"
                    label="Budget Name"
                    placeholder="Budget Name"
                    control={control}
                    required={true}
                    rules={{
                      pattern: {
                        value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                        message: "Only Alphanumberic & hypens are allowed",
                      },
                      maxLength: {
                        value: 50,
                        message: "Budget cannot exceed 50 characters",
                      },
                      required: "Budget is required",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <CustomTextField
                    name="createdBy"
                    label="Created By"
                    placeholder="Created By"
                    control={control}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <TrainingCampCustomDatePicker
                    control={control}
                    name="budgetCreatedDate"
                    label="Budget Created Date"
                    boxmb={0.8}
                    // defaultValue={dayjs().format("DD/MM/YYYY")}
                    className="Text-field-customise"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <FormWithSunEditor
                    name="budgetDescription"
                    control={control}
                    minHeight={"200px"}
                    label="Budget Description"
                    rules={{
                      required: "Budget Description is required",
                    }}
                  />
                </Grid>
                <BudgetItemAdd
                  setBudgetItem={setBudgetItem}
                  budgetItem={budgetItem}
                  mode={mode}
                />
              </Grid>
              <Grid item xs={12} md={12} my={4} textAlign={"right"}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginRight: "8px",
                    height: "48px",
                    borderRadius: "4px",
                    gap: "0px",
                    fontSize: "16px",
                  }}
                  onClick={handleCancel}
                  className="cancel-button text-capitalize dubai-med"
                >
                  Cancel
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
                  disabled={
                    budgetAddData.loading ||
                    budgetsUpdate?.loading ||
                    budgetItem?.length === 0
                  }
                  onClick={handleSubmit(onSubmit)}
                >
                  {budgetAddData.loading || budgetsUpdate?.loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : edit ? (
                    "Update"
                  ) : (
                    "Submit For Approval"
                  )}
                </Button>
              </Grid>
            </form>
          )}
        </Box>
      </Grid>
    </>
  );
};
export default BudgetAdd;
