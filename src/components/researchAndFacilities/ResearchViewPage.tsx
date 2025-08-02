import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Avatar,
  Link,
  Select,
  MenuItem,
  CardContent,
  useMediaQuery,
  CardHeader,
  Paper,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import CustomButton from "@/components/buttons/CustomButton";
import EditIcon from "../../../public/EditSVG.svg";
import BackIcon from "../../../public/backIcon.svg";
import ReusableDeleteDialog from "../Fields/ReusableDeleteDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import CalendarGreyNewsSVG from "../../../public/CalendarGreyNewsSVG.svg";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useDispatch, useSelector } from "react-redux";
import { editResearchAndFacilities } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";
import EditResearchFacilitiesSlider from "./edit/editResearchAndFacilitiesSlider";
import { isEmpty } from "lodash";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Axios from "../../utils/axiosFileInstance";
import {
  clearResearchDeleteState,
  deleteResearch,
} from "@/redux/slices/researchFacilities/researchDeleteSlice";
import { RootState } from "@/redux/store";
import { getCreatedByName } from "./utils";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ResearchViewInfo = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const researchDelete = useSelector(
    (state: RootState) => state.deleteResearch
  );
  const [isUpdated, setIsUpdated] = useState(false);
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight = () => {
    if (is4K) return "77vh";
    if (isFullHD) return "79vh";
    if (is3K) return "77vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "77vh";
    if (isLaptop) return "77vh";
    if (isTab) return "73vh";
    return "73vh";
  };
  const { researchID } = router.query;
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const editResearchData = useSelector((state: any) => {
    return state.editResearchAndFacilities;
  });

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.ResearchFacilitiesView)) {
      if (researchID || isUpdated) {
        const payload = {
          researchID: Number(researchID),
        };
        dispatch(
          editResearchAndFacilities({
            url: "/GetResearchByID",
            payload: payload,
          })
        );
      }
    } else {
      router.push("/");
    }
  }, [researchID, isUpdated]);

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
      pdf.save(`${editResearchData?.data[0]?.researchTitle || "research"}.pdf`);
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

  const handleDownload = (filePath: any, paragraph: any) => {
    const fileName = filePath.split("/").pop();
    if (isEmpty(filePath)) {
      downloadPDF();
    } else if (isEmpty(paragraph)) {
      downloadFile(filePath, fileName);
    } else {
      downloadPDF();
      downloadFile(filePath, fileName);
    }
  };

  return (
    <>
      {isOpen && (
        <EditResearchFacilitiesSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={"research"}
        />
      )}
      {editResearchData && editResearchData.loading ? (
        <Grid
          container
          className="bg-white"
          mt={1}
          p={5}
          sx={{ height: getPageContentHeight(), overflow: "scroll" }}
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
        <Box
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
            width: "100%",
          }}
        >
          <Box className="bg-white" mt={1} p={5} borderRadius="4px">
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                  gap={1}
                  sx={{
                    width: "fit-content",
                  }}
                >
                  {editResearchData &&
                    editResearchData?.data[0] &&
                    editResearchData?.data[0]?.sportsList
                      ?.slice(
                        0,
                        showAll
                          ? editResearchData?.data[0]?.sportsList.length
                          : 2
                      )
                      .map((item: any) => (
                        <Chip
                          key={item?.sportName}
                          label={item?.sportName}
                          icon={
                            <img
                              src={item?.sportProfile}
                              style={{
                                width: "20px",
                                height: "16px",
                                paddingTop: "4px",
                                objectFit: "cover",
                              }}
                              alt={item?.sportName}
                            />
                          }
                          sx={{
                            padding: "0px",
                            fontSize: "16px",
                            backgroundColor: "rgba(0, 135, 85, 0.03)",
                            color: "#008755",
                            lineHeight: "18px",
                            height: "24px",
                            ".MuiChip-label": {
                              padding: "8px",
                            },
                            border: "1px solid #008755",
                          }}
                          className="dubai-med webkit-line-clamp webkit-1"
                        />
                      ))}
                  {editResearchData &&
                    editResearchData?.data[0] &&
                    editResearchData?.data[0]?.sportsList?.length > 2 && (
                      <Avatar
                        sx={{
                          bgcolor: "#e0f7ec",
                          color: "#008755",
                          fontSize: "0.875rem",
                          width: 30,
                          height: 25,
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll
                          ? "x"
                          : `+${editResearchData?.data[0]?.sportsList.length - 2
                          }`}
                      </Avatar>
                    )}
                </Box>
                <Typography
                  className="bukra webkit-line-clamp webkit-1"
                  sx={{
                    fontSize: "20px",
                    lineHeight: "24px",
                    marginTop: "16px",
                  }}
                >
                  {editResearchData &&
                    editResearchData?.data[0] &&
                    editResearchData?.data[0]?.researchTitle}
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign={"right"}>
                {checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) ? (
                  <CustomButton
                    sx={{
                      marginRight: 1,
                      backgroundColor: "#FFFFFF",
                      fontSize: "16px",
                    }}
                    label="Edit"
                    variant="outlined"
                    size="large"
                    ButtonIcon={EditIcon}
                    iconPosition="start"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      handleEditData(researchID);
                    }}
                    module="news"
                  />
                ) : null}
                {checkAccess(USER_PERMISSION.ResearchFacilitiesDelete) ? (
                  <ReusableDeleteDialog
                    css={true}
                    title={`Research`}
                    confirmationMessage="Are you sure, Do you want to delete?"
                    successMessage="Research Deleted Successfully"
                    name={`${editResearchData &&
                      editResearchData?.data[0] &&
                      editResearchData?.data[0]?.researchTitle
                      }`}
                    width="18px"
                    height="18px"
                    icon={<DeleteIcon />}
                    revertMessage={`Once the Research is deleted, you cannot not revert.`}
                    deleteAction={(payload: any) =>
                      dispatch(
                        deleteResearch({
                          url: "/DeleteResearchByID",
                          payload,
                        })
                      )
                    }
                    fetchAfterDelete={() => {
                      router.push(`/researchAndFacilities`);
                    }}
                    deleteResponse={researchDelete}
                    clearDeleteState={() =>
                      dispatch(clearResearchDeleteState())
                    }
                    payload={{
                      researchID:
                        editResearchData &&
                        editResearchData?.data[0] &&
                        editResearchData?.data[0]?.researchID,
                    }}
                    module="news"
                  />
                ) : null}
              </Grid>
            </Grid>
            <Box>
              <Box mt={2}>
                <Typography
                  className="dubai-regular webkit-line-clamp webkit-2"
                  sx={{
                    color: "#58585B",
                    fontSize: 18,
                  }}
                  mt={2}
                >
                  <RenderHtmlContent
                    content={
                      editResearchData &&
                      editResearchData?.data[0] &&
                      editResearchData?.data[0]?.shortDescription
                    }
                  />
                </Typography>
                <Typography
                  className="dubai-regular"
                  sx={{
                    color: "#58585B",
                    fontSize: "16px",
                    lineHeight: "16px",
                  }}
                  mt={2}
                >
                  Created by
                </Typography>
                <Box display={"flex"} alignItems={"center"}>
                  <Typography className="bukra-semi-bold" fontSize={"14px"}>
                    {`${editResearchData?.data?.[0]?.createdFirstname || ""} 
           ${editResearchData?.data?.[0]?.createdMiddlename || ""} 
           ${editResearchData?.data?.[0]?.createdSurname || ""}`.trim()}{" "}
                    <span style={{ fontWeight: 500 }}>(Admin)</span>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex" }} mt={2}>
                  <CalendarGreyNewsSVG
                    style={{ with: "20px", height: "20px" }}
                  />
                  <Typography
                    className="dubai-regular"
                    sx={{
                      marginLeft: 0.5,
                      color: "#58585B",
                      fontSize: 16,
                    }}
                  >
                    {editResearchData &&
                      editResearchData?.data[0] &&
                      editResearchData?.data[0]?.createdDate}
                  </Typography>
                </Box>
              </Box>
              {checkAccess(USER_PERMISSION.FacilitiesDownload) ?
                (<Box
                  mt={3}
                  borderTop={"1px solid #E0E0E0"}
                  display={"flex"}
                  gap={2}
                  pt={3}
                >
                  <Button
                    variant="contained"
                    startIcon={<RemoveRedEyeOutlinedIcon />}
                    className="text-capitalize dubai-med"
                    sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
                    onClick={() =>
                      window.open(
                        editResearchData &&
                        editResearchData?.data[0] &&
                        editResearchData?.data[0]?.researchFilePath,
                        "_blank"
                      )
                    }
                    disabled={isEmpty(
                      editResearchData?.data[0]?.researchFilePath
                    )}
                  >
                    Preview Document
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadOutlinedIcon />}
                    className="text-capitalize dubai-med"
                    sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
                    onClick={() =>
                      handleDownload(
                        editResearchData &&
                        editResearchData?.data[0] &&
                        editResearchData?.data[0]?.researchFilePath,
                        editResearchData &&
                        editResearchData?.data[0] &&
                        editResearchData?.data[0]?.paragraph
                      )
                    }
                    disabled={
                      (isEmpty(editResearchData?.data[0]?.researchFilePath) &&
                        isEmpty(editResearchData?.data[0]?.paragraph)) ||
                      loading
                    }
                  >
                    Download
                  </Button>
                </Box>) : null}
            </Box>
          </Box>
          {!isEmpty(editResearchData?.data[0]?.paragraph) ? (
            <Card sx={{ mt: 1, px: 3 }}>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Research Details"
                className="primary-color card-header"
              />

              <CardContent sx={{ px: 5.5 }}>
                <Typography
                  className="dubai-med view-card-list-para"
                  ref={contentRef}
                >
                  <RenderHtmlContent
                    content={
                      editResearchData &&
                      editResearchData?.data[0] &&
                      editResearchData?.data[0]?.paragraph
                    }
                  />
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </Box>
      )}
    </>
  );
};

export default ResearchViewInfo;
