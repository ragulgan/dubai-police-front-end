import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Typography } from "@mui/material";
import Graduation from "../../../public/graduation.svg";
import FieldStudy from "../../../public/fieldStudy.svg";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MarkerSVG from "../../../public/MarkerSVG.svg";
import UniversitySvg from "../../../public/universitySvg.svg";
import _ from "lodash";
import axios from "axios";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

export default function QualificationMenu(props: any) {
  const { setQualificationList, qualificationList, data, module, profile } =
    props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const qualificationModule: any = {
    staff: [
      {
        name: "Academic Qualification",
        nodeName: "academicQualification",
        icon: <Graduation style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Field of Study",
        nodeName: "fieldOfStudy",
        icon: <FieldStudy style={{ width: 16, height: 16 }} />,
      },
      {
        name: "University Name",
        nodeName: "universityName",
        icon: <UniversitySvg style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Location",
        nodeName: "location",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
    ],
    athlete: [
      {
        name: "Academic Qualification",
        nodeName: "academicQualification",
        icon: <Graduation style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Field of Study",
        nodeName: "fieldOfStudy",
        icon: <FieldStudy style={{ width: 16, height: 16 }} />,
      },
      {
        name: "University Name",
        nodeName: "universityName",
        icon: <UniversitySvg style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Location",
        nodeName: "location",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
    ],
  };

  const certificateModule: any = {
    staff: [
      {
        name: "Coaching Certifications",
        nodeName: "coachingCertifications",
        icon: <Graduation style={{ width: 16, height: 16 }} />,
      },
      {
        name: "level",
        nodeName: "level",
        icon: <FieldStudy style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Issuing Organization",
        nodeName: "issuingOrganization",
        icon: <UniversitySvg style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Date Of Certification",
        nodeName: "dateOfCertification",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "expiryDate",
        nodeName: "expiryDate",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
    ],
    athlete: [
      {
        name: "Academic Qualification",
        nodeName: "academicQualification",
        icon: <Graduation style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Field of Study",
        nodeName: "fieldOfStudy",
        icon: <FieldStudy style={{ width: 16, height: 16 }} />,
      },
      {
        name: "University Name",
        nodeName: "universityName",
        icon: <UniversitySvg style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Location",
        nodeName: "location",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
    ],
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    setQualificationList(
      event.currentTarget.innerText
        ? event.currentTarget.innerText
        : profile === "qualification"
          ? "Qualification 1"
          : "Certification 1"
    );
    setAnchorEl(null);
  };

  const downloadCertificate = async (file: any) => {
    if (file[0]?.moduleID !== null) {
      try {
        const response = await axios.get(file[0].filePath, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file[0].fileName);
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{ borderColor: "#58585B", fontSize: "16px", color: "#000000" }}
        className="text-capitalize dubai-med"
        endIcon={<KeyboardArrowDownIcon />}
      >
        {qualificationList}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {profile === "qualification" ? (
          <>
            {data && data?.academicQualificationList?.length > 0
              ? data &&
              data?.academicQualificationList.map((item: any, index: any) => (
                <MenuItem onClick={handleClose}>
                  {`Qualification ${index + 1}`}
                </MenuItem>
              ))
              : null}
          </>
        ) : (
          <>
            {data && data?.certificationList?.length > 0
              ? data &&
              data?.certificationList.map((item: any, index: any) => (
                <MenuItem onClick={handleClose}>
                  {`Certification ${index + 1}`}
                </MenuItem>
              ))
              : null}
          </>
        )}
      </Menu>
      <Box sx={{ py: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.2)" }}>
        {profile === "qualification" ? (
          <>
            {qualificationModule[module].map((item: any, index: any) => (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: 15,
                      color: "#333333",
                      paddingLeft: 1,
                    }}
                    className="bukra-semi-bold"
                  >
                    {item.name}
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#58585B",
                    paddingLeft: 3,
                  }}
                  className="dubai-regular text-capitalize"
                >
                  {_.isEmpty(
                    data &&
                    data &&
                    data?.academicQualificationList[
                    qualificationList?.split(" ")[1] - 1
                    ][item.nodeName]
                  ) ||
                    (data &&
                      data?.academicQualificationList[
                      qualificationList?.split(" ")[1] - 1
                      ][item.nodeName] === " ") ? (
                    <>&nbsp;</>
                  ) : data?.academicQualificationList[
                    qualificationList?.split(" ")[1] - 1
                  ][item.nodeName] === "Y" ? (
                    "Yes"
                  ) : (
                    data?.academicQualificationList[
                    qualificationList?.split(" ")[1] - 1
                    ][item.nodeName]
                  )}
                </Typography>
              </>
            ))}
            {checkAccess( module === "staff" ? USER_PERMISSION.StaffSentiveDataView : USER_PERMISSION.AthleteSentiveDataView) && (
              data &&
                data?.academicQualificationList[
                  qualificationList?.split(" ")[1] - 1
                ]?.fileList.length > 0 ? (
                <Button
                  onClick={() =>
                    downloadCertificate(
                      data &&
                      data?.academicQualificationList[
                        qualificationList?.split(" ")[1] - 1
                      ]?.fileList
                    )
                  }
                  variant="outlined"
                  sx={{
                    borderColor: "#00205B",
                    fontSize: "16px",
                    color: "#00205B",
                    mt: 1,
                    py: 0,
                    bgcolor: "rgba(0, 32, 91, 0.04)",
                    borderRadius: "8px",
                  }}
                  className="text-capitalize dubai-med"
                  endIcon={<FileDownloadOutlinedIcon />}
                >
                  Download
                </Button>
              ) : null
            )}
          </>
        ) : (
          <>
            {certificateModule[module].map((item: any, index: any) => (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: 15,
                      color: "#333333",
                      paddingLeft: 1,
                    }}
                    className="bukra-semi-bold"
                  >
                    {item.name}
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#58585B",
                    paddingLeft: 3,
                  }}
                  className="dubai-regular text-capitalize"
                >
                  {_.isEmpty(
                    data &&
                    data &&
                    data?.certificationList[
                    qualificationList?.split(" ")[1] - 1
                    ][item.nodeName]
                  ) ||
                    (data &&
                      data?.certificationList[
                      qualificationList?.split(" ")[1] - 1
                      ][item.nodeName] === " ") ? (
                    <>&nbsp;</>
                  ) : data?.certificationList[
                    qualificationList?.split(" ")[1] - 1
                  ][item.nodeName] === "Y" ? (
                    "Yes"
                  ) : (
                    data?.certificationList[
                    qualificationList?.split(" ")[1] - 1
                    ][item.nodeName]
                  )}
                </Typography>
              </>
            ))}
            {checkAccess( module === "staff" ? USER_PERMISSION.StaffSentiveDataView : USER_PERMISSION.AthleteSentiveDataView) && (
              data &&
                data?.certificationList[qualificationList?.split(" ")[1] - 1]
                  ?.fileList.length > 0 ? (
                <Button
                  onClick={() =>
                    downloadCertificate(
                      data &&
                      data?.certificationList[
                        qualificationList?.split(" ")[1] - 1
                      ]?.fileList
                    )
                  }
                  variant="outlined"
                  sx={{
                    borderColor: "#00205B",
                    fontSize: "16px",
                    color: "#00205B",
                    mt: 1,
                    py: 0,
                    bgcolor: "rgba(0, 32, 91, 0.04)",
                    borderRadius: "8px",
                  }}
                  className="text-capitalize dubai-med"
                  endIcon={<FileDownloadOutlinedIcon />}
                >
                  Download
                </Button>
              ) : null
            )}
          </>
        )}
      </Box>
    </div>
  );
}
