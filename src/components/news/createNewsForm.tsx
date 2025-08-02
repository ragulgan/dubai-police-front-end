"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  SnackbarCloseReason,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isNull } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import moment from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { usePathname } from "next/navigation";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { FileUploader } from "react-drag-drop-files";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import TrainingCampCustomDatePicker from "../trainingCamp/trainingCampCustomDatePicker";
import DropDown from "../Fields/DropDown";
import { useRouter } from "next/router";
import { listCategory } from "@/redux/slices/news/CategoryListSlice";
import { addNews, clearNewsAddState } from "@/redux/slices/news/NewsAddSlice";
import {
  updateNews,
  clearNewsUpdateState,
} from "@/redux/slices/news/NewsUpdateSlice";
import EditFieldSkeleton from "../trainingCamp/skeleton/editSkeletont";

const CreateNewsForm = (props: any) => {
  const { edit, editNewsData, id, onClose, setIsUpdated } = props;
  const fileTypes = ["JPG", "PNG"];
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [categoryDataOption, setcategoryDataOption] = useState<any>("");
  const newsAddData = useSelector((state: RootState) => state.addNews);
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const newsUpdateData = useSelector((state: any) => state && state.updateNews);
  const [formData, setFormData] = useState<any>({
    file: "",
    modulename: "Staff",
    moduleid: "1",
    section: "",

    description: "",
  });
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const getCategoryList = useSelector(
    (state: any) => state.categoryList && state.categoryList?.data
  );

  const { handleSubmit, control, reset, setValue } = useForm<any>({
    defaultValues: {
      articleTitle: null,
      newsDate: null,
      newsTime: null,
      category: null,
      author: "",
      relatedLinks: "",
      paragraph: null,
      shortDescription: "",
    },
  });

  const onSubmit = (data: any) => {
    if (edit) {
      const updatePayload: any = {
        articleTitle: data?.articleTitle,
        newsDate: dayjs(data?.newsDate).format("DD/MM/YYYY"),
        newsTime: data?.newsTime
          ? dayjs(data?.newsTime).format("hh:mm A")
          : null,
        category: String(data?.category),
        author: data?.author,
        relatedLinks: data?.relatedLinks,
        paragraph: data?.paragraph,
        shortDescription: data?.shortDescription,
        newsID: id,
      };
      dispatch(
        updateNews({
          url: "/UpdateNewsByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        articleTitle: data?.articleTitle,
        newsDate: dayjs(data?.newsDate).format("DD/MM/YYYY"),
        newsTime: isNull(data?.newsTime)
          ? ""
          : dayjs(data?.newsTime).format("hh:mm A"),
        category: String(data?.category),
        author: data?.author,
        relatedLinks: data?.relatedLinks,
        paragraph: data?.paragraph,
        shortDescription: data?.shortDescription,
      };
      dispatch(
        addNews({
          url: "/InsertNews",
          payload: payload,
        })
      );
    }
  };

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleChange = (file: any) => {
    if (file) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setImageData((prevData: any) => ({
              ...prevData,
              ProfileImage: result,
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setSnackbarOpen(true);
          setSnackbarStatus(
            `File size must below ${fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
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

  const handleReset = () => {
    reset({
      articleTitle: "",
      newsDate: null,
      newsTime: null,
      category: null,
      author: "",
      relatedLinks: "",
      paragraph: null,
      shortDescription: "",
    });
    setFormData({ file: "" });
    setImageData({});
  };

  const handleCancel = () => {
    if (edit) {
      onClose();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const payload = {};
    dispatch(listCategory({ url: "/GetNewsCategoryList", payload }));
  }, []);

  useEffect(() => {
    const category: any = getDefaultOption(getCategoryList);
    setcategoryDataOption(category);
  }, [getCategoryList]);

  const getDefaultOption = (CategoryList: any) => {
    const defaultOptions = [];
    for (const item in CategoryList) {
      defaultOptions.push({
        label: CategoryList[item].categoryTitle,
        value: CategoryList[item].categoryID,
      });
    }
    return defaultOptions;
  };

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

  useEffect(() => {
    if (
      (newsAddData && newsAddData.code === 200) ||
      (newsUpdateData && newsUpdateData.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      const data = new FormData();
      if (formData && formData.file) data.append("file", formData.file);
      data.append("modulename", "News");
      data.append(
        "moduleid",
        (newsAddData && newsAddData.data && newsAddData.data?.newsID) ||
        (newsUpdateData && newsUpdateData.data && newsUpdateData.data?.newsID)
      );
      data.append("section", "NewsImage");
      dispatch(singleFileUpload(data));
      dispatch(clearNewsUpdateState());
      dispatch(clearNewsAddState());
      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          setTimeout(() => {
            setIsUpdated(false);
          }, 1000);
        } else {
          router.back();
        }
      }, 1000);
    } else if (
      (newsAddData && newsAddData.code === 500) ||
      (newsUpdateData && newsUpdateData.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearNewsUpdateState());
      dispatch(clearNewsAddState());
    } else if (
      (newsAddData && newsAddData.code === 409) ||
      (newsUpdateData && newsUpdateData.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearNewsUpdateState());
      dispatch(clearNewsAddState());
    }
  }, [newsAddData, newsUpdateData]);

  useEffect(() => {
    if (editNewsData && editNewsData.code === 200) {
      setValue(
        "articleTitle",
        editNewsData &&
        editNewsData?.data[0] &&
        editNewsData?.data[0].articleTitle
      );
      setValue(
        "newsDate",
        moment(
          editNewsData &&
          editNewsData?.data[0] &&
          editNewsData?.data[0].newsDate,
          "DD/MM/YYYY"
        )
      );
      setValue(
        "newsTime",
        moment(
          editNewsData &&
          editNewsData?.data[0] &&
          editNewsData?.data[0].newsTime,
          "hh:mm A"
        )
      );
      setValue(
        "category",
        Number(
          editNewsData &&
          editNewsData?.data[0] &&
          editNewsData?.data[0].categoryID
        )
      );
      setValue(
        "author",
        editNewsData && editNewsData?.data[0] && editNewsData?.data[0].author
      );
      setValue(
        "relatedLinks",
        editNewsData &&
        editNewsData?.data[0] &&
        editNewsData?.data[0].relatedLinks
      );
      setValue(
        "shortDescription",
        editNewsData &&
        editNewsData?.data[0] &&
        editNewsData?.data[0].shortDescription
      );
      setValue(
        "paragraph",
        editNewsData && editNewsData?.data[0] && editNewsData?.data[0].paragraph
      );
      setImageData({
        ProfileImage:
          editNewsData &&
          editNewsData?.data[0] &&
          editNewsData?.data[0].filePath,
      });
    }
  }, [editNewsData]);

  useEffect(() => {
    if (singleUploadData?.code === 200) {
      dispatch(clearState());
    }
  }, [singleUploadData]);

  return (
    <>
      {editNewsData && editNewsData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `News ${edit ? "Updated" : "Added"} successfully!`
                    : "Something went wrong"
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems={{ xs: "top", md: "center" }}
              sx={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box width="100%">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item xs={12} md={12}>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        spacing={2}
                        justifyContent={"space-between"}
                      >
                        <Grid item xs={12} md={5.75}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontSize: "14px" }}
                            className="typography textfield-label bukra"
                            mt={1.5}
                            mb={0.5}
                          >
                            News Image
                          </Typography>
                          {imageData && imageData?.ProfileImage ? (
                            <Box onClick={handleFileUpload}>
                              <img
                                src={imageData?.ProfileImage}
                                alt="Upload Camp"
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  height: "300px",
                                  border: "1px dashed #008755",
                                  cursor: "pointer",
                                }}
                              />
                            </Box>
                          ) : null}
                          <Box
                            border={"1px dashed #008755"}
                            bgcolor={"rgba(0, 135, 85, 0.03)"}
                            className="upload-travel"
                            position={"relative"}
                            borderRadius={"8px"}
                            display={imageData?.ProfileImage ? "none" : ""}
                          >
                            <FileUploader
                              handleChange={handleChange}
                              name="file"
                              types={fileTypes}
                              className="upload-outline"
                              label={
                                formData && formData.file
                                  ? "Drag & drop or click here to change a file"
                                  : "Drag & drop or click here to select a file"
                              }
                              uploadedLabel={
                                "Drag & drop or click here to change a file"
                              }
                              disabled={singleUploadData.loading}
                            />
                            <BackupOutlinedIcon
                              style={{
                                position: "absolute",
                                top: "27%",
                                bottom: 0,
                                left: "45%",
                                right: 0,
                                cursor: "pointer",
                                height: "50px",
                                width: "50px",
                              }}
                              onClick={handleFileUpload}
                            />
                            <Box
                              textAlign={"center"}
                              position={"absolute"}
                              bottom={"30%"}
                              // left={"30%"}
                              className="dubai-regular secondary-color"
                              fontWeight={600}
                              fontSize={"14px"}
                              width={"100%"}
                            >
                              {formData && formData.file ? (
                                <Tooltip title={formData && formData.file && formData.file.name}>
                                  <Typography
                                    className={
                                      id && formData && formData.file
                                        ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                                        : "dubai-med webkit-line-clamp webkit-1"
                                    }
                                    sx={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      mt: 1,
                                    }}
                                  >
                                    {formData && formData.file && formData.file.name}
                                  </Typography>
                                </Tooltip>
                              ) : null}
                            </Box>
                          </Box>
                          <Typography
                            color="rgb(0, 66, 106)"
                            className="bukra"
                            fontSize={11}
                            fontWeight={400}
                            mt={0.5}
                          >
                            Recommended: 1110x478 PNG.
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          {edit ? null : (
                            <Grid
                              item
                              xs={12}
                              sx={{
                                textAlign: "end",
                              }}
                            >
                              <Button
                                variant="outlined"
                                className="text-capitalize dubai-med"
                                color="secondary"
                                sx={{ height: "45px" }}
                                onClick={handleReset}
                              >
                                Clear form
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="articleTitle"
                            label="Article Title"
                            placeholder="Enter New Article Title"
                            control={control}
                            required={true}
                            rules={{
                              maxLength: {
                                value: 100,
                                message:
                                  "Article Title cannot exceed 100 characters",
                              },
                              required: "Article Title is required",
                            }}
                          />
                        </Grid>
                        <Grid container item xs={12} md={5.75} spacing={2}>
                          <Grid item xs={6}>
                            <TrainingCampCustomDatePicker
                              control={control}
                              name="newsDate"
                              label="Publish Date"
                              boxmb={0.8}
                              required={true}
                              minDate={moment()}
                              maxDate={moment().add(10, "years")}
                              className="Text-field-customise"
                              rules={{
                                required: "Date is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <CustomTimePicker
                              control={control}
                              name="newsTime"
                              label="Time"
                              boxmb={0.7}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <DropDown
                            name="category"
                            control={control}
                            label="Category"
                            placeholder="Category"
                            options={categoryDataOption && categoryDataOption}
                            multiple={false}
                            variant="outlined"
                            required={true}
                            rules={{
                              required: "Category is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="author"
                            label="Author"
                            placeholder="Enter New Author"
                            control={control}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z() /]*$/,
                                message: "Invalid Format",
                              },
                              maxLength: {
                                value: 100,
                                message: "Author cannot exceed 100 characters",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75} mt={1}>
                          <CustomTextField
                            name="relatedLinks"
                            label="Related Links"
                            placeholder="Enter New Related Links"
                            control={control}
                            rules={{
                              pattern: {
                                value:
                                  /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*(\?[\w=&%-]*)?$/,
                                message: "Invalid URL format",
                              },
                              maxLength: {
                                value: 500,
                                message:
                                  "Related Links Name cannot exceed 500 characters",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75} mt={1}>
                          <CustomTextField
                            name="shortDescription"
                            label="Short Description"
                            placeholder="Enter New Short Description"
                            control={control}
                            rules={{
                              maxLength: {
                                value: 100,
                                message:
                                  "Short Description Name cannot exceed 100 characters",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <FormWithSunEditor
                            name="paragraph"
                            control={control}
                            minHeight={"200px"}
                            label="Paragraph"
                            module="news"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mr: 1 }}
                      onClick={handleCancel}
                      className="cancel-button text-capitalize dubai-med"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      disabled={newsAddData.loading || newsUpdateData?.loading}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {newsAddData.loading || newsUpdateData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : edit ? (
                        "Update"
                      ) : (
                        "Save & Publish"
                      )}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default CreateNewsForm;
