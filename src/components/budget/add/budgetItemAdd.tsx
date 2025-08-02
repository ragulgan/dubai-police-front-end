"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  SnackbarCloseReason,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppAddButton from "@/components/buttons/AppAddButton";
import CustomTextField from "@/components/Fields/CustomTextField";
import { useForm } from "react-hook-form";
import { isEmpty, toLower } from "lodash";
import CustomSnackbar from "@/components/CustomSnackbar";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addBudgetItem } from "@/redux/slices/budget/budgetItemsAddSlice";
import { EditBudget } from "@/redux/slices/budget/budgetEditSlice";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const BudgetItemAdd = (props: any) => {
  const {
    setBudgetItem,
    budgetItem,
    module,
    id,
    teamID,
    budgetEditData,
    mode,
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [budgetAdd, setBudgetAdd] = useState<any>(false);
  const [replaceIndex, setReplaceIndex] = useState<any>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [updateBudgetItem, setUpdateBudgetItem] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [budgetSelected, setBudgetSelected] = useState<any>("");
  const headers = [
    "Item Name",
    "Amount per Item",
    "Quantity",
    "Item Total",
    "Actions",
  ];

  const totalAmount: any =
    budgetItem &&
    budgetItem.length > 0 &&
    budgetItem?.reduce((sum: any, item: any) => {
      return sum + parseFloat(item.amountPerItem) * parseFloat(item.quantity);
    }, 0);

  const { handleSubmit, control, setValue, reset } = useForm<any>({
    defaultValues: {
      itemName: "",
      amountPerItem: "",
      quantity: "",
    },
  });

  const handleBudgetItemAddOpen = () => {
    setBudgetAdd(true);
  };

  const handleBudgetItemAddClose = () => {
    setBudgetAdd(false);
    reset({
      itemName: "",
      amountPerItem: "",
      quantity: "",
    });
    setBudgetSelected("");
  };

  const handleEditBudgetItem = (budget: any, index: any) => {
    setReplaceIndex(index);
    setBudgetAdd(true);
    setBudgetSelected(budget);
    setValue("itemName", budget && budget?.itemName);
    setValue("amountPerItem", budget && budget?.amountPerItem);
    setValue("quantity", budget && budget?.quantity);
  };

  const handleDeleteBudget = (budget: any) => {
    setBudgetItem(
      budgetItem &&
      budgetItem.filter((data: any) => data.itemName !== budget?.itemName)
    );
    if (module === "view") {
      setUpdateBudgetItem(true);
    }
  };

  const onSubmit = (data: any) => {
    const error =
      budgetItem &&
      budgetItem.filter(
        (party: any) => toLower(party.itemName) === toLower(data?.itemName)
      );
    if (error && error.length > 0 && isEmpty(budgetSelected)) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    } else if (!isEmpty(budgetSelected) && !isEmpty(data)) {
      const error =
        budgetItem &&
        budgetItem.filter(
          (party: any) =>
            toLower(party.itemName) !== toLower(budgetSelected?.itemName)
        );
      const updateError =
        error &&
        error.filter(
          (party: any) => toLower(party.itemName) === toLower(data?.itemName)
        );
      if (updateError && updateError.length > 0) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        const updatedBudgetItems =
          budgetItem &&
          budgetItem.map((item: any, index: any) =>
            index === replaceIndex ? data : item
          );
        setSnackbarOpen(true);
        setSnackbarStatus("success");
        setBudgetItem(updatedBudgetItems);
        setBudgetSelected("");
        handleBudgetItemAddClose();
        setReplaceIndex("");
        if (module === "view") {
          setUpdateBudgetItem(true);
        }
      }
    } else {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setBudgetItem([...budgetItem, data]);
      handleBudgetItemAddClose();
      if (module === "view") {
        setUpdateBudgetItem(true);
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
  };

  useEffect(() => {
    setTimeout(() => {
      if (updateBudgetItem) {
        const payload: any = {
          budgetID: id,

          budgetItems: budgetItem && budgetItem,
          sportID: Number(teamID),
        };
        dispatch(
          addBudgetItem({
            url: "/UpdateBudgetItemsByID",
            payload: payload,
          })
        );
        const Editpayload = {
          budgetID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(EditBudget({ url: "/GetBudgetByID", payload: Editpayload }));
      }
      setUpdateBudgetItem(false);
    }, 1000);
  }, [updateBudgetItem]);

  useEffect(() => {
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

  return (
    <>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Budget item ${!isEmpty(budgetSelected) ? "Updated" : "Added"
              } successfully!`
              : `Budget item name already exists! Please add a different one.`
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid item xs={12} md={12}>
        <Box textAlign={"end"}>
          <Typography py={1} className="dubai-regular" fontSize={"16px"}>
            <span style={{ color: "#E4002B" }}>*</span> Please add at least one
            item to proceed with Budget Approval.
          </Typography>
        </Box>
        <Box
          mt={module === "view" ? 0 : 1}
          className="bg-white"
          border={module === "view" ? "none" : "1px solid #DEDEDE"}
          borderRadius={module === "view" ? 2 : 0}
        >
          <Box display={"flex"}>
            <Typography
              sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
              p={2}
              className="table-list-header bukra-semi-bold header-border-right"
            >
              Budget Items
            </Typography>
            <Typography
              p={2}
              sx={{ flexGrow: 2 }}
              className="table-count-header dubai-regular header-border-right"
            ></Typography>
            {budgetEditData &&
              budgetEditData?.data &&
              budgetEditData?.data[0] &&
              budgetEditData?.data[0]?.statusText === "Rejected"
              ? null
              : ((mode === "add" && checkAccess(USER_PERMISSION.BudgetAdd)) ||
                (mode === "edit" &&
                  checkAccess(USER_PERMISSION.BudgetEdit)) ||
                (mode === "view" &&
                  checkAccess(USER_PERMISSION.BudgetEdit))) && (
                <AppAddButton
                  label="Add item"
                  onClick={handleBudgetItemAddOpen}
                />
              )}
          </Box>
          <Box>
            <TableContainer>
              <Table stickyHeader aria-label="team table">
                <TableHead>
                  <TableRow>
                    {headers.map((header: any) => (
                      <TableCell
                        key={header}
                        align={"left"}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: 600,
                          fontSize: "13px",
                          width:
                            header === "Item Name"
                              ? "223px"
                              : header === "Amount per Item"
                                ? "196px"
                                : header === "Actions"
                                  ? "60px"
                                  : "164px",
                          p: 1.25,
                          color: "#000000",
                        }}
                        className="bukra"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgetItem &&
                    budgetItem.length > 0 &&
                    budgetItem.map((row: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: "#EDFFFC",
                          },
                        }}
                      >
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-med"
                          >
                            {row.itemName || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-med"
                          >
                            {row.amountPerItem || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-med"
                          >
                            {row.quantity || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-med"
                          >
                            AED{" "}
                            {(
                              row.quantity * row.amountPerItem
                            ).toLocaleString() || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                          <>
                            {(mode === "add" &&
                              checkAccess(USER_PERMISSION.BudgetAdd)) ||
                              (mode === "edit" &&
                                checkAccess(USER_PERMISSION.BudgetEdit)) ||
                              (mode === "view" &&
                                checkAccess(USER_PERMISSION.BudgetEdit)) ? (
                              <Tooltip title={"Edit"}>
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => {
                                    handleEditBudgetItem(row, index);
                                  }}
                                  sx={{
                                    width: "16px",
                                    height: "16px",
                                    mx: 1,
                                    color: "#05868E",
                                  }}
                                // disabled={
                                //   budgetEditData &&
                                //   budgetEditData?.data &&
                                //   budgetEditData?.data[0] &&
                                //   budgetEditData?.data[0]?.statusText ===
                                //     "Rejected"
                                // }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {(mode === "add" &&
                              checkAccess(USER_PERMISSION.BudgetAdd)) ||
                              (mode === "edit" &&
                                checkAccess(USER_PERMISSION.BudgetEdit)) ||
                              (mode === "view" &&
                                checkAccess(USER_PERMISSION.BudgetEdit)) ? (
                              <Tooltip title={"Delete"}>
                                <IconButton
                                  aria-label="view"
                                  sx={{ width: "16px", height: "16px" }}
                                  onClick={() => {
                                    handleDeleteBudget(row);
                                  }}
                                // disabled={
                                //   budgetEditData &&
                                //   budgetEditData?.data &&
                                //   budgetEditData?.data[0] &&
                                //   budgetEditData?.data[0]?.statusText ===
                                //     "Rejected"
                                // }
                                >
                                  <DeleteIcon
                                    sx={{
                                      color:
                                        //   budgetEditData &&
                                        //   budgetEditData?.data &&
                                        //   budgetEditData?.data[0] &&
                                        //   budgetEditData?.data[0]?.statusText ===
                                        //     "Rejected"
                                        //     ? "none"
                                        "#05868E",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </>
                        </TableCell>
                      </TableRow>
                    ))}
                  {budgetAdd && (
                    <TableRow
                      sx={{
                        backgroundColor: "#FFFFFF",
                        verticalAlign: "text-top",
                      }}
                    >
                      <TableCell
                        colSpan={1}
                        sx={{ whiteSpace: "nowrap", p: 1.25 }}
                      >
                        <CustomTextField
                          name="itemName"
                          control={control}
                          required={true}
                          placeholder="Item Name"
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 50,
                              message: "Item Name cannot exceed 50 characters",
                            },
                            required: "Item Name is required",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <CustomTextField
                          name="amountPerItem"
                          control={control}
                          required={true}
                          placeholder="Amount per Item"
                          rules={{
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "Only numbers are allowed",
                            },
                            maxLength: {
                              value: 7,
                              message:
                                "Amount Per Item cannot exceed 7 characters",
                            },
                            required: "Amount Per Item is required",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <CustomTextField
                          name="quantity"
                          control={control}
                          required={true}
                          placeholder="Quantity"
                          rules={{
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "Only numbers are allowed",
                            },
                            maxLength: {
                              value: 7,
                              message: "Quantity cannot exceed 7 characters",
                            },
                            required: "Quantity is required",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "nowrap", p: 1.25 }}
                      ></TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.25 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            mr: 1,
                            textTransform: "none",
                            width: "72px",
                            height: "40px",
                            borderRadius: "4px",
                            padding: "10px",
                            color: "#FFFFFF",
                            bgcolor: "#008755",
                            mt: 2,
                          }}
                          className="dubai-med"
                          onClick={handleSubmit(onSubmit)}
                        >
                          {!isEmpty(budgetSelected) ? "Update" : "Save"}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            mr: 1,
                            textTransform: "none",
                            width: "72px",
                            height: "40px",
                            borderRadius: "4px",
                            padding: "10px",
                            color: "#008755",
                            bgcolor: "#FFFFFF",
                            mt: 2,
                          }}
                          className="dubai-med"
                          onClick={handleBudgetItemAddClose}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  {budgetItem && budgetItem.length > 0 && (
                    <TableRow sx={{ backgroundColor: "#B1E4E333" }}>
                      <TableCell colSpan={1}></TableCell>
                      <TableCell
                        colSpan={2}
                        className="bukra"
                        sx={{
                          textAlign: "right",
                          fontSize: "16px",
                          lineHeight: "19.2px",
                          color: "#000000",
                          p: 2,
                        }}
                      >
                        Grand Total:
                      </TableCell>
                      <TableCell
                        className="bukra"
                        sx={{
                          textAlign: "left",
                          fontSize: "16px",
                          lineHeight: "19.2px",
                          color: "#008755",
                          p: 1,
                          width: { xs: "100%", sm: "auto" }
                        }}
                      >
                        AED {totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "none", md: "table-cell" }
                        }}
                        colSpan={1}></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default BudgetItemAdd;
