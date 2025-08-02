"use client";
import CustomButton from "@/components/buttons/CustomButton";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import router from "next/router";
import EditIcon from "../../../../public/Edit-white.svg";
import CalendarGreyNewsSVG from "../../../../public/CalendarWhiteSVG.svg";
import PreviewSVG from "../../../../public/previewIcon.svg";
import DownloadSVG from "../../../../public/downloadSVG.svg";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useEffect, useRef, useState } from "react";
import { editRules } from "@/redux/slices/rules/RulesEditSlice";
import { useDispatch, useSelector } from "react-redux";
import EditSlider from "@/components/rules/edit/editSlider";
import { setLocalStorage } from "@/utils/helper";
import { RootState } from "@/redux/store";
import {
  clearRulesDeleteState,
  deleteRules,
} from "@/redux/slices/rules/RulesDeleteSlice";
import { isEmpty } from "lodash";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Axios from "../../../utils/axiosFileInstance";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

export default function ViewMous(props: any) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { mouAndPartnershipID } = router.query;
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();

  const tablePartyHeaders = [
    "Party Name",
    "Party Address",
    "Representative",
    "Designation",
  ];

  const editRulesData = useSelector((state: any) => {
    return state.rulesEdit;
  });

  const rulesDelete = useSelector((state: RootState) => state.rulesDelete);
  const mouData = editRulesData?.data?.[0] || {};

  const downloadPDF = () => {
    setLoading(true);
    const input = contentRef.current;
    if (!input) return;
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const topMargin = 10;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yPosition = topMargin;
      pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
      pdf.save(`${editRulesData?.data[0]?.title || "news_article"}.pdf`);
      setLoading(false);
    });
  };

  const downloadFile = async (filePath: any, fileName: any) => {
    setLoading(true);
    try {
      if (!filePath) {
        console.error("File path is missing");
        return;
      }
      const fileExtension = filePath?.split(".").pop().toLowerCase();
      const mimeTypes: any = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      const mimeType = mimeTypes[fileExtension] || "application/octet-stream";
      const response = await Axios.get(filePath, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Default name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const handleDownload = (filePath: any, fileName: any, paragraph: any) => {
    const fileNameData = fileName && fileName?.split("/").pop();
    if (isEmpty(filePath)) {
      downloadPDF();
    } else if (isEmpty(paragraph)) {
      downloadFile(filePath, fileNameData);
    } else {
      downloadPDF();
      downloadFile(filePath, fileNameData);
    }
  };

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.MousPartnershipView)) {
      if (mouAndPartnershipID || isUpdated) {
        const payload = {
          mouAndPartnershipID: Number(mouAndPartnershipID),
          section: "mou",
        };
        dispatch(
          editRules({ url: "/GetRulesAndAgreementsByID", payload: payload })
        );
      }
    } else {
      router.push("/");
    }
  }, [mouAndPartnershipID, isUpdated]);

  return (
    <>
      {isOpen && (
        <EditSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={"mou"}
        />
      )}
      {editRulesData && editRulesData.loading ? (
        <Grid
          container
          className="bg-white"
          mt={1}
          p={5}
          sx={{ marginTop: 1, height: "80vh", overflowY: "scroll" }}
        >
          <Grid item xs={8} />
          <Grid item xs={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", width: "30%" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "30%" }} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "50%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "30%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
          </Grid>
        </Grid>
      ) : (
        <>
          <Box
            className="bg-white"
            p={4}
            sx={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
              borderRadius: "10px",
            }}
            mt={1}
            height={"268px"}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {checkAccess(USER_PERMISSION.MousPartnershipEdit) ? (
                <CustomButton
                  sx={{
                    marginRight: 1,
                    backgroundColor: "transparent",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    border: "1px solid #FFFFFF",
                    "&:hover": {
                      border: "1px solid #FFFFFF",
                      color: "#FFFFFF",
                    },
                  }}
                  label="Edit"
                  variant="outlined"
                  size="large"
                  ButtonIcon={EditIcon}
                  iconPosition="start"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    handleEditData(mouAndPartnershipID);
                  }}
                />
              ) : null}
              {checkAccess(USER_PERMISSION.MousPartnershipDelete) ? (
                <ReusableDeleteDialog
                  css={true}
                  title={`MOUs & Partnership`}
                  confirmationMessage="Are you sure, Do you want to delete?"
                  successMessage="MOUs & Partnership Deleted Successfully"
                  name={`${editRulesData &&
                    editRulesData?.data[0] &&
                    editRulesData?.data[0]?.title
                    }`}
                  width="18px"
                  height="18px"
                  icon={<DeleteIcon />}
                  revertMessage={`Once the MOUs & Partnership is deleted, you cannot not revert.`}
                  deleteAction={(payload: any) =>
                    dispatch(
                      deleteRules({
                        url: "/DeleteRulesAndAgreementsByID",
                        payload,
                      })
                    )
                  }
                  fetchAfterDelete={() => {
                    router.back();
                  }}
                  deleteResponse={rulesDelete}
                  clearDeleteState={() => dispatch(clearRulesDeleteState())}
                  payload={{
                    mouAndPartnershipID:
                      editRulesData &&
                      editRulesData?.data[0] &&
                      editRulesData?.data[0]?.mouAndPartnershipID,

                    section: "mou",
                  }}
                  module="mou"
                />
              ) : null}
            </Box>
            <Box>
              <Box>
                <Typography
                  className="bukra webkit-line-clamp webkit-1 text-capitalize"
                  sx={{ fontSize: 20, color: "#FFFFFF" }}
                >
                  {mouData?.title}
                </Typography>
                <Box sx={{ display: "flex" }} mt={1}>
                  <CalendarGreyNewsSVG
                    style={{ with: "20px", height: "20px" }}
                  />
                  <Typography
                    className="dubai-regular"
                    sx={{
                      paddingX: 1,
                      fontSize: "16px",
                      lineHeight: "21px",
                      color: "#FFFFFF",
                    }}
                  >
                    {mouData?.fromDate}
                  </Typography>
                  <Typography
                    className="dubai-regular"
                    sx={{
                      paddingRight: 1,
                      fontSize: "16px",
                      lineHeight: "21px",
                      color: "#FFFFFF",
                    }}
                  >
                    {`-`}
                  </Typography>
                  <Typography
                    className="dubai-regular"
                    sx={{
                      fontSize: "16px",
                      lineHeight: "21px",
                      color: "#FFFFFF",
                    }}
                  >
                    {mouData?.toDate}
                  </Typography>
                </Box>
              </Box>
              <>
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#FFFFFF",
                    mb: 2,
                    mt: 2,
                  }}
                />
                {checkAccess(USER_PERMISSION.MousPartnershipDownload) ? (
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="outlined"
                      className="text-capitalize dubai-med"
                      sx={{
                        mr: 2,
                        borderRadius: "4px",
                        height: "44px",
                        color: "#008755",
                        border: "1px solid #FFFFFF",
                        backgroundColor: "#FFFFFF",
                      }}
                      startIcon={<PreviewSVG width="25px" height="25px" />}
                      onClick={() =>
                        window.open(mouData?.mouFilePath, "_blank")
                      }
                      disabled={isEmpty(mouData?.mouFilePath)}
                    >
                      Preview Document
                    </Button>
                    <Button
                      variant="outlined"
                      className="text-capitalize dubai-med"
                      sx={{
                        borderRadius: "4px",
                        height: "44px",
                        color: "#008755",
                        border: "1px solid #FFFFFF",
                        backgroundColor: "#FFFFFF",
                      }}
                      startIcon={<DownloadSVG width="25px" height="25px" />}
                      onClick={() =>
                        handleDownload(
                          editRulesData &&
                          editRulesData?.data[0] &&
                          editRulesData?.data[0]?.mouFilePath,
                          editRulesData &&
                          editRulesData?.data[0] &&
                          editRulesData?.data[0]?.mouFilePath,
                          editRulesData &&
                          editRulesData?.data[0] &&
                          editRulesData?.data[0]?.paragraph
                        )
                      }
                      disabled={
                        (isEmpty(editRulesData?.data[0]?.mouFilePath) &&
                          isEmpty(editRulesData?.data[0]?.paragraph)) ||
                        loading
                      }
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size="15px"
                            className="text-primary"
                          />
                          Downloading...
                        </>
                      ) : (
                        "Download Document"
                      )}
                    </Button>
                  </Box>
                ) : null}
              </>
            </Box>
          </Box>
          <Grid container spacing={2} mt={0.1}>
            <Grid item xs={12}>
              {editRulesData &&
                editRulesData?.data[0] &&
                editRulesData?.data[0]?.rulesAndAgreementPartyList &&
                editRulesData?.data[0]?.rulesAndAgreementPartyList?.length > 2 ? (
                <Card>
                  <CardHeader
                    avatar={<ListOutlinedIcon />}
                    title="Party Details"
                    className="primary-color card-header"
                  />
                  <CardContent sx={{ py: 0 }}>
                    <Grid item xs={12} md={12}>
                      <Box>
                        <TableContainer
                          sx={{
                            border: "1px solid rgba(88, 88, 91, 0.2)",
                            borderRadius: "4px",
                            mb: 2,
                          }}
                        >
                          <Table stickyHeader aria-label="team table">
                            <TableHead>
                              <TableRow>
                                {tablePartyHeaders.map((header: any) => (
                                  <TableCell
                                    key={header}
                                    align={"left"}
                                    sx={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      fontWeight: "bold",
                                      color: "#58585B",
                                      width:
                                        header === "Afternoon Training Plan"
                                          ? "50%"
                                          : "auto",
                                      p: 1.25,
                                    }}
                                    className="bukra"
                                  >
                                    {header}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {mouData &&
                                mouData?.rulesAndAgreementPartyList &&
                                mouData?.rulesAndAgreementPartyList?.length >
                                0 &&
                                mouData?.rulesAndAgreementPartyList?.map(
                                  (item: any, index: any) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        "&:nth-of-type(even)": {
                                          backgroundColor: "#EFFAF9",
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
                                            textTransform: "capitalize",
                                          }}
                                          className="dubai-regular"
                                        >
                                          {item?.partyName}
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
                                          className="dubai-regular"
                                        >
                                          {item?.partyAddress}
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
                                          className="dubai-regular"
                                        >
                                          {item?.representative}
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
                                          className="dubai-regular"
                                        >
                                          {item?.designation}
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          whiteSpace: "nowrap",
                                          p: 1.25,
                                        }}
                                      ></TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader
                    avatar={<ListOutlinedIcon />}
                    title="Party Details"
                    className="primary-color card-header"
                  />
                  <CardContent sx={{ py: 0 }}>
                    <Grid container spacing={2} alignItems="center">
                      {editRulesData &&
                        editRulesData?.data[0] &&
                        editRulesData?.data[0]?.rulesAndAgreementPartyList?.map(
                          (party: any, index: any) => (
                            <Grid item xs={6} md={6} key={index}>
                              <Card
                                sx={{
                                  p: 4,
                                  border: "1px solid #DEE2ED",
                                  boxShadow: "none",
                                }}
                              >
                                <Typography
                                  className="bukra-semi-bold"
                                  sx={{
                                    fontSize: 16,
                                    color: "#000000",
                                  }}
                                >
                                  Party {index + 1}
                                </Typography>
                                <Typography
                                  className="bukra-semi-bold text-capitalize"
                                  sx={{
                                    fontSize: 16,
                                    color: "#000000",
                                    pt: 1,
                                  }}
                                >
                                  {party.partyName}
                                </Typography>
                                <Typography
                                  className="dubai-regular"
                                  sx={{
                                    pt: 1,
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "21px",
                                    color: "#000000",
                                  }}
                                >
                                  {party.partyAddress}
                                </Typography>
                                <Typography
                                  className="bukra"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 15,
                                    color: "#58585B",
                                    pt: 2,
                                  }}
                                >
                                  Representative:
                                </Typography>
                                <Typography
                                  className="dubai-regular text-capitalize"
                                  sx={{
                                    pt: 0.5,
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "21px",
                                    color: "#58585B",
                                  }}
                                >
                                  {party.representative}
                                </Typography>
                                <Typography
                                  className="bukra"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 15,
                                    color: "#58585B",
                                    pt: 2,
                                  }}
                                >
                                  Designation:
                                </Typography>
                                <Typography
                                  className="dubai-regular text-capitalize"
                                  sx={{
                                    pt: 0.5,
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "21px",
                                    color: "#58585B",
                                  }}
                                >
                                  {party.designation}
                                </Typography>
                              </Card>
                            </Grid>
                          )
                        )}
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Grid>
            {!isEmpty(editRulesData?.data[0]?.paragraph) ? (
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    avatar={<ListOutlinedIcon />}
                    title="Mou Details"
                    className="primary-color card-header"
                  />
                  <CardContent sx={{ py: 0 }}>
                    <Typography
                      className="dubai-regular view-card-list-para"
                      ref={contentRef}
                    >
                      <RenderHtmlContent
                        content={
                          editRulesData &&
                          editRulesData?.data[0] &&
                          editRulesData?.data[0]?.paragraph
                        }
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : null}
          </Grid>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "384px", overflow: "scroll" }}>
                <CardHeader
                  avatar={<ListOutlinedIcon />}
                  title="Intent of MOU"
                  className="primary-color card-header"
                />
                <CardContent sx={{ py: 0 }}>
                  <Typography className="dubai-regular view-card-list-para">
                    <RenderHtmlContent content={mouData?.intentOfMou} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "384px", overflow: "scroll" }}>
                <CardHeader
                  avatar={<ListOutlinedIcon />}
                  title="Disclaimers"
                  className="primary-color card-header"
                />
                <CardContent sx={{ py: 0 }}>
                  <Typography className="dubai-regular view-card-list-para">
                    <RenderHtmlContent content={mouData?.disclaimers} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={0.5} mb={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "384px", overflow: "scroll" }}>
                <CardHeader
                  avatar={<ListOutlinedIcon />}
                  title="Risk Sharing"
                  className="primary-color card-header"
                />
                <CardContent sx={{ py: 0 }}>
                  <Typography className="dubai-regular view-card-list-para">
                    <RenderHtmlContent content={mouData?.risksSharing} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "384px", overflow: "scroll" }}>
                <CardHeader
                  avatar={<ListOutlinedIcon />}
                  title="Financials"
                  className="primary-color card-header"
                />
                <CardContent sx={{ py: 0 }}>
                  <Typography className="dubai-regular view-card-list-para">
                    <RenderHtmlContent content={mouData?.financialsIfAny} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
