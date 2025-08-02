"use client";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Doc from "../../../public/doc.svg";
import Pdf from "../../../public/pdf.svg";
import ImageSVG from "../../../public/ImageSVG.svg";
import Grid from "@mui/material/Grid";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Divider from "@mui/material/Divider";
import AlertDialog from "./uploadDialog";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "@/utils/theme";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import axios from "axios";
import _ from "lodash";
import { Attachment } from "@/interfaces/AppInterfaces";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";

interface UploadDocumentsProps {
  module: string;
  label: string;
  expanded: boolean;
  attachmentList: Attachment[];
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onFileChange: () => void;
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  module,
  label,
  expanded,
  attachmentList,
  onClick,
  onFileChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<null | Attachment>(null);
  const [tab, setTab] = useState<any>("All");
  const [filter, setFilter] = useState<any>([
    "profileimage",
    "ProfileImage",
    "profilefullimage",
    "ProfileFullImage",
    "passport",
    "Passport",
    "iddocument",
    "IDDocument",
    "certificate",
    "Certificate",
    "contractdocument",
    "ContractDocument",
    "level",
    "Level",
    "others",
    "Others",
    "individaulplans",
    "IndividaulPlans",
    "license",
    "License",
    "externalclubscontract",
    "ExternalClubsContract",
    "academicqualification",
    "AcademicQualification",
    "coachingcertificate",
    "CoachingCertificate",
    "Acknowledgement",
    "acknowledgement",
    "pledge",
    "Pledge",
    "certificateofgoodconductdoc",
    "certificateOfGoodConductDoc",
  ]);
  const documentChipList = [
    {
      label: "All",
      filter: [
        "profileimage",
        "ProfileImage",
        "profilefullimage",
        "ProfileFullImage",
        "passport",
        "Passport",
        "iddocument",
        "IDDocument",
        "certificate",
        "Certificate",
        "contractdocument",
        "ContractDocument",
        "level",
        "Level",
        "others",
        "Others",
        "individaulplans",
        "IndividaulPlans",
        "license",
        "License",
        "externalclubscontract",
        "ExternalClubsContract",
        "academicqualification",
        "AcademicQualification",
        "coachingcertificate",
        "CoachingCertificate",
        "Acknowledgement",
        "acknowledgement",
        "pledge",
        "Pledge",
        "certificateofgoodconductdoc",
        "certificateOfGoodConductDoc",
      ],
      value: attachmentList && attachmentList.length,
    },
    {
      label: "Personal",
      filter: [
        "profileimage",
        "passport",
        "iddocument",
        "profilefullimage",
        "ProfileImage",
        "Passport",
        "IDDocument",
        "ProfileFullImage",
      ],
      value:
        attachmentList &&
        attachmentList.filter(
          (item) =>
            item.documentSection === "iddocument" ||
            item.documentSection === "passport" ||
            item.documentSection === "profileimage" ||
            item.documentSection === "profilefullimage" ||
            item.documentSection === "ProfileImage" ||
            item.documentSection === "Passport" ||
            item.documentSection === "IDDocument" ||
            item.documentSection === "ProfileFullImage"
        ).length,
    },
    {
      label: "Employment",
      filter: [
        "contractdocument",
        "ContractDocument",
        "acknowledgement",
        "Acknowledgement",
        "pledge",
        "Pledge",
        "certificateofgoodconductdoc",
        "certificateOfGoodConductDoc",
      ],
      value:
        attachmentList &&
        attachmentList.filter(
          (item) =>
            item.documentSection === "contractdocument" ||
            item.documentSection === "ContractDocument" ||
            item.documentSection === "Acknowledgement" ||
            item.documentSection === "acknowledgement" ||
            item.documentSection === "pledge" ||
            item.documentSection === "Pledge" ||
            item.documentSection === "certificateofgoodconductdoc" ||
            item.documentSection === "certificateOfGoodConductDoc"
        ).length,
    },
    {
      label: "Education",
      filter: [
        "certificate",
        "academicqualification",
        "Certificate",
        "AcademicQualification",
      ],
      value:
        attachmentList &&
        attachmentList.filter(
          (item) =>
            item.documentSection === "certificate" ||
            item.documentSection === "academicqualification" ||
            item.documentSection === "Certificate" ||
            item.documentSection === "AcademicQualification"
        ).length,
    },
    {
      label: "Sport",
      filter: ["level", "coachingcertificate", "Level", "CoachingCertificate"],
      value:
        attachmentList &&
        attachmentList.filter(
          (item) =>
            item.documentSection === "level" ||
            item.documentSection === "coachingcertificate" ||
            item.documentSection === "Level" ||
            item.documentSection === "CoachingCertificate"
        ).length,
    },
    {
      label: "others",
      filter: [
        "others",
        "license",
        "individaulplans",
        "externalclubscontract",
        "Others",
        "License",
        "ExternalClubsContract",
        "IndividaulPlans",
      ],
      value:
        attachmentList &&
        attachmentList.filter(
          (item) =>
            item.documentSection === "others" ||
            item.documentSection === "license" ||
            item.documentSection === "individaulplans" ||
            item.documentSection === "externalclubscontract" ||
            item.documentSection === "Others" ||
            item.documentSection === "License" ||
            item.documentSection === "ExternalClubsContract" ||
            item.documentSection === "IndividaulPlans"
        ).length,
    },
  ];
  const is2K = useMediaQuery(theme.breakpoints.up("xl"));
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const handleTab = (value: any, filters: any) => {
    setTab(value);
    setFilter(filters);
  };
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: "rgb(55, 65, 81)",
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[300],
      }),
    },
  }));

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    currentItem: Attachment
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentItem(currentItem);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  const downloadFile = async () => {
    try {
      if (currentItem != null) {
        const response = await axios.get(currentItem.filePath, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", currentItem.fileName);
        document.body.appendChild(link);
        link.click();

        // Clean up
        if (link.parentNode) link.parentNode.removeChild(link);
        handleClose();
      }
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const delteAttachment = async () => {
    try {
      await axios.post(`${process.env.API_BASE_URL}/Sports/DeleteFilesByID`, {
        fileID: currentItem?.fileID,
        // have to make dynamic once AD logic implemented in BE
        moduleName: module,
        moduleID: currentItem?.moduleID ? Number(currentItem?.moduleID) : "",
        docSection: currentItem?.documentSection,
      });
      setAnchorEl(null);
      setDialogOpen(false);
      onFileChange();
    } catch (error) {
      console.error("Error delteing attachment:", error);
    }
  };

  const downloadAllDocuments = async (e: any) => {
    e.stopPropagation();
    const response = await axiosCallBlob.post(
      `${process.env.API_BASE_URL}/Sports/DownloadStaffsAllDocuments`,
      {
        moduleName: module,
        moduleID: attachmentList[0].moduleID
          ? Number(attachmentList[0].moduleID)
          : "",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AllDocuments.zip");
    document.body.appendChild(link);
    link.click();

    // Clean up
    if (link.parentNode) link.parentNode.removeChild(link);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="bukra" sx={{ mt: 2 }}>
          {"Do you want to delete this document?"}
        </DialogTitle>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDialogClose}
            className="dubai-med text-capitalize"
          >
            No, Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={delteAttachment}
            className="dubai-med text-capitalize"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        className="bg-white"
        sx={{
          marginTop: 1,
          padding: 1,
          borderRadius: "8px",
          borderBottomLeftRadius: expanded ? "0" : "8px",
          borderBottomRightRadius: expanded ? "0" : "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <Typography
          variant="subtitle1"
          sx={{
            padding: 1,
            fontSize: 18,
            color: "#008755",
            textWrap: "nowrap",
          }}
          className="bukra-semi-bold"
        >
          {label}
        </Typography>
        <Box textAlign={"end"} width={"80%"}>
          <AlertDialog onFileChange={onFileChange} module={module} />
          <Button
            disabled={attachmentList && !attachmentList.length}
            onClick={(e) => downloadAllDocuments(e)}
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            className="dubai-med text-capitalize"
          >
            Download all
          </Button>
        </Box>

        {!expanded && (
          <Box onClick={onClick}>
            <NavigateNextIcon sx={{ cursor: "pointer" }} />
          </Box>
        )}
        {expanded && (
          <Box onClick={onClick}>
            <ExpandMoreIcon sx={{ cursor: "pointer" }} />
          </Box>
        )}
      </Box>
      <Box px={4} className="bg-white">
        <Stack
          direction="row"
          columnGap={2}
          rowGap={1}
          sx={{
            flexWrap: "wrap",
            overflow: "visible",
          }}
        >
          {documentChipList.map((item, key) => (
            <Box
              onClick={() => handleTab(item.label, item.filter)}
              display={"flex"}
              key={key}
              sx={
                tab === item.label
                  ? {
                      color: "#FFFFFF",
                      backgroundColor: "#008755",
                      textAlign: "center",
                      minHeight: "40px",
                      alignItems: "center",
                      borderRadius: "27px",
                      cursor: "pointer",
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      color: "#008755",
                      border: "1px solid #008755",
                      textAlign: "center",
                      minHeight: "40px",
                      alignItems: "center",
                      borderRadius: "27px",
                      cursor: "pointer",
                    }
              }
              className="dubai-med"
              px={3}
            >
              {item.label}
              <span
                style={
                  tab === item.label
                    ? {
                        marginLeft: "6px",
                        width: "26px",
                        height: "20px",
                        borderRadius: "21px",
                        border: "1px solid #FFFFFF",
                        fontSize: "11px",
                        alignContent: "center",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        backgroundColor: "#FFFFFF",
                        color: "#008755",
                        textAlign: "center",
                        cursor: "pointer",
                      }
                    : {
                        marginLeft: "6px",
                        width: "26px",
                        height: "20px",
                        borderRadius: "21px",
                        border: "1px solid #008755",
                        fontSize: "11px",
                        alignContent: "center",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        textAlign: "center",
                        cursor: "pointer",
                      }
                }
                className="dubai-med"
              >
                {item.value}
              </span>
            </Box>
          ))}
        </Stack>
        <Grid container spacing={2} py={3}>
          {attachmentList && attachmentList.length ? (
            attachmentList
              .filter((item) => filter.includes(item.documentSection))
              .map((attachmentItem, index) => (
                <Grow
                  in={true}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(true ? { timeout: 500 + index * 200 } : {})}
                  key={index}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
                    key={attachmentItem.fileID}
                  >
                    <Box className="border-secondary" height={"238px"}>
                      <Box p={1} pb={0}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          {attachmentItem.extension == ".pdf" && (
                            <Pdf width={32} height={32} />
                          )}
                          {(attachmentItem.extension == ".doc" ||
                            attachmentItem.extension == ".docx") && (
                            <Doc width={32} height={32} />
                          )}
                          {(attachmentItem.extension == ".jpg" ||
                            attachmentItem.extension == ".jpeg" ||
                            attachmentItem.extension == ".png") && (
                            <ImageSVG width={32} height={32} />
                          )}
                          <Button
                            variant="text"
                            className="minWidth-0"
                            startIcon={<MoreHorizOutlinedIcon />}
                            id="upload-more"
                            aria-controls={open ? "upload-more" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            disableElevation
                            onClick={(e) => handleClick(e, attachmentItem)}
                          ></Button>
                          <StyledMenu
                            id="upload-more"
                            MenuListProps={{
                              "aria-labelledby": "demo-customized-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            className="upload-menu"
                          >
                            <MenuItem
                              disableRipple
                              className="menu-button dubai-med appbar-menu-list"
                              onClick={() => {
                                downloadFile();
                              }}
                            >
                              <DownloadOutlinedIcon className="primary-color" />
                              Download
                            </MenuItem>
                            <MenuItem
                              disableRipple
                              className="menu-button dubai-med appbar-menu-list"
                              onClick={handleClickOpen}
                            >
                              <DeleteOutlinedIcon className="primary-color" />
                              Delete
                            </MenuItem>
                          </StyledMenu>
                        </Box>
                        <Box my={2} height={"60px"}>
                          <Typography
                            className="dubai-med pdf-name"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {attachmentItem.fileName}
                          </Typography>
                          <Typography className="dubai-med pdf-date secondary-color">
                            {attachmentItem.fileSize}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />
                      <Box p={1}>
                        <Typography
                          className="dubai-med pdf-date secondary-color webkit-line-clamp"
                          sx={{ lineHeight: "27.01px" }}
                        >
                          {_.isEmpty(attachmentItem.description)
                            ? (() => {
                                const section =
                                  attachmentItem?.documentSection?.toLowerCase();
                                const sectionMap: any = {
                                  profileimage: "Attachment for profile image",
                                  profilefullimage:
                                    "Attachment for profile full image",
                                  passport: "Attachment for passport",
                                  iddocument: "Attachment for Emirates ID",
                                  certificate: "Attachment for License Details",
                                  contractdocument:
                                    "Attachment for Contract Document",
                                  level: "Attachment for Education",
                                  others: "Attachment for others",
                                  license: "Attachment for license",
                                  individaulplans:
                                    "Attachment for Individual Plans",
                                  externalclubscontract:
                                    "Attachment for external clubs Contract",
                                  academicqualification:
                                    "Attachment for Academic Qualification",
                                  coachingcertificate:
                                    "Attachment for Coaching Certificate",
                                  acknowledgement:
                                    "Attachment for Acknowledgement",
                                  pledge: "Attachment for Pledge",
                                  certificateofgoodconductdoc:
                                    "Attachment for Certificate of Good Conduct",
                                };
                                return sectionMap[section] || "Attachment";
                              })()
                            : attachmentItem.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grow>
              ))
          ) : (
            <>
              <Box p={3}>
                <Alert
                  className="dubai-med"
                  severity="info"
                >{`No attachment(s) found.`}</Alert>
              </Box>
            </>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default UploadDocuments;
