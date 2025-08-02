import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Box,
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
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CustomButton from "@/components/buttons/CustomButton";
import NewsBannerImg from "../../../../public/staticFoodImage.svg";
import NewsIconSVG from "../../../../public/NewsIconSVG.svg";
import CalendarGreyNewsSVG from "../../../../public/CalendarGreyNewsSVG.svg";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import EditSlider from "@/components/news/editSlider";
import { useEffect, useRef, useState } from "react";
import {
  editNews,
  clearNewsEditState,
} from "@/redux/slices/news/NewsEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import {
  deleteNews,
  clearNewsDeleteState,
} from "@/redux/slices/news/NewsDeleteSlice";
import { RootState } from "@/redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ViewNews: React.FC = () => {
  const router = useRouter();
  const { newsID } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const dispatch: any = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
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
    return "77vh";
  };

  const editNewsData = useSelector((state: any) => {
    return state.editNews;
  });
  const newsDelete = useSelector((state: RootState) => state.deleteNews);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "News",
      route: `/news`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/news/view/${newsID}`,
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
      pdf.save(
        `${editNewsData?.data?.[0]?.categoryTitle || "news_article"}.pdf`
      );
      setLoading(false);
    });
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
    if (checkAccess(USER_PERMISSION.NewsView)) {
      if (newsID || isUpdated) {
        const payload = {
          newsID: Number(newsID),
        };
        dispatch(editNews({ url: "/GetNewsByID", payload: payload }));
      }
    } else {
      router.push("/");
    }
  }, [newsID, isUpdated]);

  useEffect(() => {
    return () => {
      dispatch(clearNewsEditState());
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
            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => {
            router.back();
            dispatch(clearNewsEditState());
          }}
        />
      </Box>
      {editNewsData && editNewsData.loading ? (
        <Grid
          container
          className="bg-white"
          mt={1}
          p={5}
          sx={{
            marginTop: 0.5,
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
          <Grid item xs={12}>
            <Skeleton
              variant="rectangular"
              sx={{ height: "450px", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={6} mt={2}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "20%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "30%" }} />
          </Grid>
          <Grid item xs={6} mt={2}>
            <Box sx={{ placeItems: "end" }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "20%" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} mt={5}>
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
          {/* view section */}
          <Box
            className="bg-white"
            mt={1}
            p={5}
            sx={{
              marginTop: 1,
              height: getPageContentHeight(),
              overflowY: "scroll",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {checkAccess(USER_PERMISSION.NewsDownload) && (
                <Button
                  size="large"
                  sx={{ marginRight: 1, fontSize: "16px", fontWeight: 500 }}
                  variant="contained"
                  startIcon={loading ? null : <SaveAltIcon />}
                  className="text-capitalize dubai-med"
                  disabled={loading}
                  onClick={downloadPDF}
                >
                  {loading ? (
                    <>
                      <CircularProgress size="15px" sx={{ color: "#FFFFFF" }} />
                      Downloading...
                    </>
                  ) : (
                    "Download"
                  )}
                </Button>
              )}
              {checkAccess(USER_PERMISSION.NewsEdit) && (
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
                    handleEditData(newsID);
                  }}
                  module="news"
                />
              )}
              {checkAccess(USER_PERMISSION.NewsDelete) && (
                <ReusableDeleteDialog
                  css={true}
                  title={`News`}
                  confirmationMessage="Are you sure, Do you want to delete?"
                  successMessage="News Deleted Successfully"
                  name={`${editNewsData &&
                    editNewsData?.data &&
                    editNewsData?.data[0]?.articleTitle
                    }`}
                  width="18px"
                  height="18px"
                  icon={<DeleteIcon />}
                  revertMessage={`Once the News is deleted, you cannot not revert.`}
                  deleteAction={(payload: any) =>
                    dispatch(
                      deleteNews({
                        url: "/DeleteNewsByID",
                        payload,
                      })
                    )
                  }
                  fetchAfterDelete={() => {
                    router.back();
                  }}
                  deleteResponse={newsDelete}
                  clearDeleteState={() => dispatch(clearNewsDeleteState())}
                  payload={{
                    newsID:
                      editNewsData &&
                      editNewsData?.data &&
                      editNewsData?.data[0]?.newsID,
                  }}
                  module="news"
                />
              )}
            </Box>
            {/* News banner image */}
            <Box ref={contentRef}>
              <Box mt={3}>
                {isEmpty(
                  editNewsData &&
                  editNewsData?.data &&
                  editNewsData?.data[0]?.filePath
                ) ? (
                  <NewsBannerImg
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      height: "480px",
                    }}
                    className="static-image"
                  />
                ) : (
                  <img
                    src={
                      editNewsData &&
                      editNewsData?.data &&
                      editNewsData?.data[0]?.filePath
                    }
                    alt="New banner image"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      height: "480px",
                      borderRadius: "16px",
                    }}
                  />
                )}
              </Box>
              {/* Author section */}
              <Box
                mt={2}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* Author left */}
                <Box>
                  <Typography
                    className="dubai-regular"
                    sx={{ color: "#58585B" }}
                  >
                    Author
                  </Typography>
                  <Typography
                    className="bukra-semi-bold"
                    sx={{
                      color: "#000000",
                      fontSize: 14,
                    }}
                  >
                    {editNewsData &&
                      editNewsData?.data &&
                      editNewsData?.data[0]?.author}
                  </Typography>
                  <Box sx={{ display: "flex" }} mt={1}>
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
                      {editNewsData &&
                        editNewsData?.data &&
                        editNewsData?.data[0]?.newsDate}
                    </Typography>
                  </Box>
                </Box>

                {/* Author right */}
                <Box>
                  <CustomButton
                    sx={{
                      marginRight: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: "24px",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    label={
                      editNewsData &&
                      editNewsData?.data &&
                      editNewsData?.data[0]?.categoryTitle
                    }
                    module="news"
                    variant="outlined"
                    size="small"
                    ButtonIcon={NewsIconSVG}
                    iconPosition="start"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      router.push(
                        `/news/viewall/${editNewsData &&
                          editNewsData?.data &&
                          editNewsData?.data[0]?.categoryTitle === "Latest News"
                          ? "latestNews"
                          : editNewsData &&
                            editNewsData?.data &&
                            editNewsData?.data[0]?.categoryTitle ===
                            "Featured Article"
                            ? "featuredArticle"
                            : editNewsData &&
                              editNewsData?.data &&
                              editNewsData?.data[0]?.categoryTitle ===
                              "Club's News"
                              ? "clubNews"
                              : "news"
                        }`
                      );
                    }}
                  />
                </Box>
              </Box>
              {/* new body */}
              <Box mt={2}>
                <Typography
                  className="bukra"
                  sx={{ fontWeight: 500, fontSize: 18 }}
                >
                  {editNewsData &&
                    editNewsData?.data &&
                    editNewsData?.data[0]?.articleTitle}
                </Typography>
              </Box>
              <Box mt={3}>
                <RenderHtmlContent
                  content={
                    editNewsData &&
                    editNewsData?.data &&
                    editNewsData?.data[0]?.paragraph
                  }
                />
              </Box>
              <Box mt={1}>
                {editNewsData?.data?.[0]?.relatedLinks ? (
                  <Link
                    href={editNewsData.data[0].relatedLinks}
                    className="dubai-regular"
                    style={{ color: "#05868E", fontWeight: 400, fontSize: 18 }}
                    target="_blank"
                  >
                    {editNewsData.data[0].relatedLinks}
                  </Link>
                ) : null}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ViewNews;
