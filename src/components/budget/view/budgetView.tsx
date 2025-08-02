import {
  Box,
  Button,
  Grid,
  Skeleton,
  SnackbarCloseReason,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import CustomButton from "@/components/buttons/CustomButton";
import XlsSVG from "../../../../public/XlsSVG.svg";
import EditIcon from "@mui/icons-material/Edit";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import BudgetItemAdd from "../add/budgetItemAdd";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStatusBudget,
  clearBudgetUpdateStatusState,
} from "@/redux/slices/budget/budgetUpdateStatusSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import { EditBudget } from "@/redux/slices/budget/budgetEditSlice";
import StatusRejectDialog from "./statusRejectDialog";
import StatusChip from "@/components/statusChip";
import Axios from "../../../utils/axiosFileInstance";
import { checkAccess } from "@/utils/acessscheck";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { USER_PERMISSION } from "@/utils/constants";

const BudgetView = (props: any) => {
  const { id, budgetEditData, teamID } = props;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [budgetItem, setBudgetItem] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const budgetsUpdateStatus = useSelector(
    (state: RootState) => state.budgetsUpdateStatus
  );
  const isMobile = useMediaQuery("(max-width:768px)");

  const downloadBudgetExcel = async () => {
    setDownloading(true);
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportBudgetListByID`,
        {
          sportID: Number(teamID),
          budgetID: Number(
            budgetEditData &&
            budgetEditData?.data &&
            budgetEditData?.data[0] &&
            budgetEditData?.data[0]?.budgetID
          ),

        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetName
        }.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      setDownloading(false);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
    }
  };

  const handleApproveBudget = (budgetID: any) => {
    const payload = {
      budgetID: budgetID,
      status: 1,
      rejectedReason: "",

    };
    dispatch(
      updateStatusBudget({ url: "/UpdateBudgetStatus", payload: payload })
    );
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
    if (budgetEditData && budgetEditData?.code === 200) {
      setBudgetItem(
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetItemList
      );
    }
  }, [budgetEditData]);

  useEffect(() => {
    if (
      budgetEditData &&
      budgetEditData?.data &&
      budgetEditData?.data[0] &&
      budgetEditData?.data[0]?.statusText === "Rejected" &&
      budgetsUpdateStatus &&
      budgetsUpdateStatus?.code === 200
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("reasonSuccess");
      dispatch(clearBudgetUpdateStatusState());
      const payload = {
        budgetID: Number(id),
        sportID: Number(teamID),

      };
      dispatch(EditBudget({ url: "/GetBudgetByID", payload: payload }));
    } else if (budgetsUpdateStatus && budgetsUpdateStatus?.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearBudgetUpdateStatusState());
      const payload = {
        budgetID: Number(id),
        sportID: Number(teamID),

      };
      dispatch(EditBudget({ url: "/GetBudgetByID", payload: payload }));
    } else if (budgetsUpdateStatus && budgetsUpdateStatus?.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearBudgetUpdateStatusState());
    }
  }, [budgetsUpdateStatus]);

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
            snackbarStatus === "reasonSuccess"
              ? `Reject reason for budget status updated successfully!`
              : snackbarStatus === "success"
                ? `Budget status updated successfully!`
                : `Budget status updated failed.`
          }
          severity={
            snackbarStatus === "success"
              ? "success"
              : snackbarStatus === "reasonSuccess"
                ? "success"
                : "error"
          }
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      {budgetEditData && budgetEditData?.loading ? (
        <Grid
          container
          className="bg-white"
          mt={1}
          p={1}
          sx={{ marginTop: 0.5, height: "80vh", overflow: "scroll" }}
          spacing={1}
        >
          <Grid item xs={12}>
            <Skeleton
              variant="rectangular"
              sx={{ height: "250px", borderRadius: "8px" }}
            />
          </Grid>
          <TableSkeleton />
        </Grid>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                borderRadius={"8px"}
                height={"325px"}
                sx={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
                }}
                p={2}
                position={"relative"}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    paddingRight: "3px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                >
                  <Grid item xs={8}>
                    <Tooltip
                      title={
                        budgetEditData &&
                        budgetEditData?.data &&
                        budgetEditData?.data[0] &&
                        budgetEditData?.data[0]?.budgetName
                      }
                    >
                      <Typography
                        sx={{
                          fontSize: "24px",
                          lineHeight: "24.2px",
                          color: "#FFFFFF",
                          paddingTop: "10px",
                        }}
                        className="bukra-semi-bold webkit-line-clamp webkit-1"
                      >
                        {budgetEditData &&
                          budgetEditData?.data &&
                          budgetEditData?.data[0] &&
                          budgetEditData?.data[0]?.budgetName}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  {/* 1046 means access to edit budget */}
                  {checkAccess(USER_PERMISSION.BudgetEdit) ? <Grid item xs={4} textAlign={"right"}>
                    {/* {budgetEditData &&
                      budgetEditData?.data &&
                      budgetEditData?.data[0] &&
                      budgetEditData?.data[0]?.statusText !== "Rejected" && ( */}
                    <CustomButton
                      sx={{
                        backgroundColor: "transparent",
                        fontSize: { xs: "14px", md: "16px" },
                        border: "1px solid #FFFFFF",
                        color: "#FFFFFF",
                      }}
                      label="Edit Budget"
                      variant="outlined"
                      size="large"
                      ButtonIcon={EditIcon}
                      iconPosition="start"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        router.push(`/teams/${teamID}/budget/edit/${id}`);
                      }}
                    />
                    {/* )} */}
                  </Grid> : null}
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        lineHeight: "150%",
                        color: "#FFFFFF",
                        paddingTop: "0px",
                      }}
                      className="dubai-regular webkit-line-clamp webkit-2"
                    >
                      <RenderHtmlContent
                        content={
                          budgetEditData &&
                          budgetEditData?.data &&
                          budgetEditData?.data[0] &&
                          budgetEditData?.data[0]?.budgetDescription
                        }
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign={"right"}>
                    <Button
                      variant="outlined"
                      className="text-capitalize dubai-med export-button"
                      sx={{
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        border: "1px solid #FFFFFF",
                        color: "#FFFFFF",
                        height: "44px",
                      }}
                      startIcon={<XlsSVG style={{
                        width: isMobile ? "18px" : "25px",
                        height: "25px",
                      }} />}
                      onClick={downloadBudgetExcel}
                      disabled={downloading}
                    >
                      {downloading ? "Downloading..." : "Export to Excel"}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "18px",
                          lineHeight: "22.95px",
                        }}
                      >
                        Budget Created Date
                      </Typography>
                      <Typography
                        className="dubai-bold"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "18px",
                          lineHeight: "22.95px",
                        }}
                      >
                        {budgetEditData &&
                          budgetEditData?.data &&
                          budgetEditData?.data[0] &&
                          budgetEditData?.data[0]?.budgetCreatedDate}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Box width={"70%"} display={"flex"} gap={2}>
                        <Typography
                          px={2}
                          py={2}
                          borderRadius={"8px"}
                          width="fit-content"
                          className="bukra"
                          sx={{
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#FFFFFF",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          Created By
                          <Typography
                            className="dubai-med"
                            pt={1}
                            sx={{
                              fontSize: "16px",
                              lineHeight: "22.95px",
                              color: "#FFFFFF",
                            }}
                          >
                            {budgetEditData &&
                              budgetEditData?.data &&
                              budgetEditData?.data[0] &&
                              budgetEditData?.data[0]?.createdby}
                          </Typography>
                        </Typography>
                        <Typography
                          px={2}
                          py={2}
                          borderRadius={"8px"}
                          width="fit-content"
                          className="bukra"
                          sx={{
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#FFFFFF",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          Budget Type
                          <Typography
                            className="dubai-med"
                            pt={1}
                            sx={{
                              fontSize: "16px",
                              lineHeight: "22.95px",
                              color: "#FFFFFF",
                            }}
                          >
                            {budgetEditData &&
                              budgetEditData?.data &&
                              budgetEditData?.data[0] &&
                              budgetEditData?.data[0]?.budgetType}
                          </Typography>
                        </Typography>
                        <Typography
                          px={2}
                          py={2}
                          borderRadius={"8px"}
                          width="fit-content"
                          className="bukra"
                          sx={{
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#FFFFFF",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          Grand Total
                          <Typography
                            className="dubai-med"
                            pt={1}
                            sx={{
                              fontSize: "16px",
                              lineHeight: "22.95px",
                              color: "#FFFFFF",
                            }}
                          >
                            {budgetEditData &&
                              budgetEditData?.data &&
                              budgetEditData?.data[0] &&
                              budgetEditData?.data[0]?.grandTotal}
                          </Typography>
                        </Typography>
                      </Box>
                      <Box
                        width={"30%"}
                        textAlign={"end"}
                        sx={{ placeContent: "end" }}
                      >
                        {budgetEditData &&
                          budgetEditData?.data &&
                          budgetEditData?.data[0] &&
                          budgetEditData?.data[0]?.statusText === "Pending" && (
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent={"end"}
                              alignItems={"end"}
                            >
                              {checkAccess(USER_PERMISSION.BudgetApproval) ? <StatusRejectDialog
                                budgetEditData={budgetEditData}
                              /> : null}
                              {budgetEditData &&
                                budgetEditData?.data &&
                                budgetEditData?.data[0] &&
                                budgetEditData?.data[0]?.statusText ===
                                "Approved" ? null
                                : checkAccess(USER_PERMISSION.BudgetApproval) && (
                                  <Button
                                    variant="contained"
                                    className="text-capitalize dubai-regular"
                                    sx={{
                                      fontSize: "16px",
                                      bgcolor: "rgba(255, 255, 255, 0.1)",
                                      color: "#FFFFFF",
                                      height: "48px",
                                    }}
                                    onClick={() =>
                                      handleApproveBudget(
                                        budgetEditData &&
                                        budgetEditData?.data &&
                                        budgetEditData?.data[0] &&
                                        budgetEditData?.data[0]?.budgetID
                                      )
                                    }
                                  >
                                    Approve
                                  </Button>
                                )}
                            </Stack>
                          )}
                        {budgetEditData &&
                          budgetEditData?.data &&
                          budgetEditData?.data[0] &&
                          budgetEditData?.data[0]?.statusText ===
                          "Rejected" && (
                            <>
                              <Stack
                                direction="row"
                                spacing={2}
                                justifyContent={"end"}
                                alignItems={"center"}
                              >
                                <Typography className="bukra tertiary-color">
                                  Status
                                </Typography>
                                <Box className="reject-chip">
                                  <StatusChip status="Rejected" />
                                </Box>
                              </Stack>
                              <StatusRejectDialog
                                budgetEditData={budgetEditData}
                                setSnackbarOpen={setSnackbarOpen}
                                setSnackbarStatus={setSnackbarStatus}
                                status={"Reject"}
                              />
                            </>
                          )}
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <BudgetItemAdd
              setBudgetItem={setBudgetItem}
              budgetItem={budgetItem}
              module={"view"}
              teamID={teamID}
              id={id}
              budgetEditData={budgetEditData}
              mode="view"
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default BudgetView;
