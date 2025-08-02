import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import EditIcon from "../../../../public/EditSVG.svg";
import BackIcon from "../../../../public/backIcon.svg";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import CustomButton from "@/components/buttons/CustomButton";
import CalendarGreyNewsSVG from "../../../../public/CalendarGreyNewsSVG.svg";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import { RootState } from "@/redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  editRules,
  clearRulesEditState,
} from "@/redux/slices/rules/RulesEditSlice";
import EditSlider from "@/components/rules/edit/editSlider";
import {
  deleteRules,
  clearRulesDeleteState,
} from "@/redux/slices/rules/RulesDeleteSlice";
import { isEmpty } from "lodash";
import axios from "axios";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

const ViewRules: React.FC = () => {
  const router = useRouter();
  const { rulesAndAgreementsID } = router.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "78vh";
    if (isFullHD) return "78vh";
    if (is3K) return "78vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "78vh";
    if (isLaptop) return "78vh";
    if (isTab) return "74vh";
    return "78vh";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dispatch: any = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const editRulesData = useSelector((state: any) => {
    return state.rulesEdit;
  });
  const rulesDelete = useSelector((state: RootState) => state.rulesDelete);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Rules & Agreements",
      route: `/rules`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/rules/view/${rulesAndAgreementsID}`,
      currentPage: true,
      disabled: false,
    },
  ];

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

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
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
      const response = await axios.get(filePath, {
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
    if (isEmpty(filePath)) {
      downloadPDF();
    } else if (isEmpty(paragraph)) {
      downloadFile(filePath, fileName);
    } else {
      downloadPDF();
      downloadFile(filePath, fileName);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.RulesAgreementsView)) {
      if (rulesAndAgreementsID || isUpdated) {
        const payload = {
          rulesAndAgreementsID: Number(rulesAndAgreementsID),
          section: "rules",
        };
        dispatch(
          editRules({ url: "/GetRulesAndAgreementsByID", payload: payload })
        );
      }
    } else {
      router.push("/");
    }
  }, [rulesAndAgreementsID, isUpdated]);

  useEffect(() => {
    return () => {
      dispatch(clearRulesEditState());
    };
  }, []);

  return (
    <Box p={1}>
      {isOpen && (
        <EditSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
        />
      )}
      {/* Breadcrump section */}
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
            height: "32px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => {
            router.back();
            dispatch(clearRulesEditState());
          }}
        />
      </Box>
      {editRulesData && editRulesData.loading ? (
        <Grid
          container
          className="bg-white"
          p={5}
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
          }}
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
          }}
        >
          <Box
            className="bg-white"
            p={5}
            sx={{
              marginTop: 1,
              borderTopRightRadius: "4px",
              borderTopLeftRadius: "4px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {checkAccess(USER_PERMISSION.RulesAgreementsEdit) ?
                <CustomButton
                  sx={{
                    marginRight: 1,
                    backgroundColor: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                  label="Edit"
                  variant="outlined"
                  size="large"
                  ButtonIcon={EditIcon}
                  iconPosition="start"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    handleEditData(rulesAndAgreementsID);
                  }}
                  module="news"
                /> : null
              }
              {
                checkAccess(USER_PERMISSION.RulesAgreementsDelete) ? <ReusableDeleteDialog
                  css={true}
                  title={`Rules & Agreements`}
                  confirmationMessage="Are you sure, Do you want to delete?"
                  successMessage="Rules & Agreements Deleted Successfully"
                  name={`${editRulesData &&
                    editRulesData?.data[0] &&
                    editRulesData?.data[0]?.title
                    }`}
                  width="18px"
                  height="18px"
                  icon={<DeleteIcon />}
                  revertMessage={`Once the Rules & Agreements is deleted, you cannot not revert.`}
                  deleteAction={(payload: any) =>
                    dispatch(
                      deleteRules({
                        url: "/DeleteRulesAndAgreementsByID",
                        payload,
                      })
                    )
                  }
                  fetchAfterDelete={() => {
                    router.push(`/rules`);
                  }}
                  deleteResponse={rulesDelete}
                  clearDeleteState={() => dispatch(clearRulesDeleteState())}
                  payload={{
                    rulesAndAgreementsID:
                      editRulesData &&
                      editRulesData?.data[0] &&
                      editRulesData?.data[0]?.rulesAndAgreementsID,

                    section: "rules",
                  }}
                  module="news"
                />
                  : null}
            </Box>
            <Box>
              <Box mt={1}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                  gap={1}
                >
                  {editRulesData &&
                    editRulesData?.data[0] &&
                    editRulesData?.data[0]?.sportsList
                      ?.slice(
                        0,
                        showAll ? editRulesData?.data[0]?.sportsList.length : 2
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
                            fontWeight: 500,
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
                  {editRulesData &&
                    editRulesData?.data[0] &&
                    editRulesData?.data[0]?.sportsList?.length > 2 && (
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
                        {/* +
                        {editRulesData &&
                          editRulesData?.data[0] &&
                          editRulesData?.data[0]?.sportsList.length - 2} */}
                        {showAll
                          ? "x"
                          : `+${editRulesData?.data[0]?.sportsList.length - 2}`}
                      </Avatar>
                    )}
                </Box>
              </Box>
              <Box mt={2}>
                <Typography
                  className="bukra webkit-line-clamp webkit-1"
                  sx={{ fontWeight: 500, fontSize: 20 }}
                >
                  {editRulesData &&
                    editRulesData?.data[0] &&
                    editRulesData?.data[0]?.title}
                </Typography>
                <Typography
                  className="dubai-regular webkit-line-clamp webkit-2"
                  sx={{
                    color: "#58585B",
                    fontWeight: 400,
                    fontSize: 18,
                  }}
                  mt={2}
                >
                  <RenderHtmlContent
                    content={
                      editRulesData &&
                      editRulesData?.data[0] &&
                      editRulesData?.data[0]?.shortDescription
                    }
                  />
                </Typography>
                <Typography
                  className="dubai-regular"
                  sx={{
                    color: "#58585B",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                  mt={2}
                >
                  Created by
                </Typography>
                <Box mt={1} display={"flex"} alignItems={"center"}>
                  <Avatar
                    alt="Dubai Police Team"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: "24px", height: "24px", bgcolor: "#58585B" }}
                  />
                  <Typography
                    className="bukra-semi-bold"
                    fontSize={"14px"}
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Dubai Police Team{" "}
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
                      fontWeight: 400,
                      fontSize: 16,
                    }}
                  >
                    {editRulesData &&
                      editRulesData?.data[0] &&
                      editRulesData?.data[0]?.createdBy}
                  </Typography>
                </Box>
              </Box>
              {checkAccess(USER_PERMISSION.RulesAgreementsDownload) ? (
                <Box
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
                        editRulesData &&
                        editRulesData?.data[0] &&
                        editRulesData?.data[0]?.rulesFilePath,
                        "_blank"
                      )
                    }
                    disabled={isEmpty(editRulesData?.data[0]?.rulesFilePath)}
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
                        editRulesData &&
                        editRulesData?.data[0] &&
                        editRulesData?.data[0]?.rulesFilePath,
                        editRulesData &&
                        editRulesData?.data[0] &&
                        editRulesData?.data[0]?.rulesFileName,
                        editRulesData &&
                        editRulesData?.data[0] &&
                        editRulesData?.data[0]?.paragraph
                      )
                    }
                    disabled={
                      (isEmpty(editRulesData?.data[0]?.rulesFilePath) &&
                        isEmpty(editRulesData?.data[0]?.paragraph)) ||
                      loading
                    }
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size="15px"
                          sx={{ color: "#FFFFFF" }}
                        />
                        Downloading...
                      </>
                    ) : (
                      "Download Document"
                    )}
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Box>
          {!isEmpty(editRulesData?.data[0]?.paragraph) ? (
            <Card sx={{ mt: 1, px: 3 }}>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Rules"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography
                  className="dubai-med view-card-list-para"
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
          ) : null}
        </Box >
      )}
    </Box >
  );
};

export default ViewRules;
