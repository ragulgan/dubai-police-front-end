"use client";
import { Box, Fade, Typography } from "@mui/material";
import LandLayerLocationSVG from "../../../public/LandLayerLocationSVG.svg";
import UserSVG from "../../../public/UserSVG.svg";
import BriefcaseSVG from "../../../public/BriefcaseSVG.svg";
import Department from "../../../public/department.svg";
import CalendarSVG from "../../../public/CalendarSVG.svg";
import Clock from "../../../public/Clock.svg";
import _ from "lodash";
import QualificationMenu from "./qualificationMenu";
import { useState } from "react";

interface ProfessionalInformationCardProps {
  data: any;
  module: any;
}

const ProfessionalInformationCard: React.FC<
  ProfessionalInformationCardProps
> = ({ data, module }) => {
  const modules: any = {
    staff: [
      // {
      //   name: _.isEmpty(data && data["coachingCertifications"])
      //     ? "--"
      //     : data && data["coachingCertifications"],
      //   nodeName: "dateOfCertificate",
      //   icon: <LandLayerLocationSVG style={{ width: 16, height: 16 }} />,
      // },
    ],
    athlete: [
      // {
      //   name: "Rank",
      //   nodeName: "rank",
      //   icon: <UserSVG style={{ width: 16, height: 16 }} />,
      // },
      {
        name: "Current Job Position",
        nodeName: "currentJobPosition",
        icon: <BriefcaseSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Current Job Location",
        nodeName: "currentJobLocation",
        icon: <LandLayerLocationSVG style={{ width: 16, height: 16 }} />,
      },
      // {
      //   name: "Department",
      //   nodeName: "department",
      //   icon: <Department style={{ width: 16, height: 16 }} />,
      // },
      // {
      //   name: "Date of Last Job Promotion",
      //   nodeName: "dateOfLastJobPromotion",
      //   icon: <CalendarSVG style={{ width: 16, height: 16 }} />,
      // },
      // {
      //   name: "Permission Type",
      //   nodeName: "permissionType",
      //   icon: <Clock style={{ width: 16, height: 16 }} />,
      // },
      {
        name: "Sports Category",
        nodeName: "sportsCategory",
        icon: <Department style={{ width: 16, height: 16 }} />,
      },
    ],
  };
  const [qualificationList, setQualificationList] =
    useState<any>("Certification 1");

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        {module && data?.certificationList?.length > 0 ? (
          <Box p={2}>
            <QualificationMenu
              setQualificationList={setQualificationList}
              qualificationList={qualificationList}
              data={data}
              module={module}
              profile="certificate"
            />
          </Box>
        ) : null}
        {modules[module].map((item: any, index: any) => (
          <Box sx={{ paddingLeft: 2, marginTop: 1 }} key={index}>
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
              {item.nodeName === "dateOfCertificate" ? (
                <>
                  Certification Date:{" "}
                  {_.isEmpty(data && data[item.nodeName]) ||
                  (data && data[item.nodeName] === " ") ? (
                    <>&nbsp;</>
                  ) : (
                    data && data[item.nodeName]
                  )}
                </>
              ) : item.nodeName === "permissionType" ? (
                <>
                  {_.isEmpty(data && data[item.nodeName]) ||
                  (data && data[item.nodeName] === " ") ? (
                    <>&nbsp;</>
                  ) : (
                    <>
                      {data && data[item.nodeName]} - {data?.permissionTime}
                    </>
                  )}
                </>
              ) : _.isEmpty(data && data[item.nodeName]) ||
                (data && data[item.nodeName] === " ") ? (
                <>&nbsp;</>
              ) : (
                data && data[item.nodeName]
              )}
            </Typography>
            {/* {_.isEmpty(data && data.permissionType) ? null: 
          item.nodeName === "permissionType" ?
          <Typography sx={{
              fontWeight: 400,
              fontSize: 16,
              color: "#00205B",
              px: 3,
              border:'1px solid #00205B',
              borderRadius:'8px',
              mx:3,
              textAlign:'center',
              mb:3,
              width:'75%'
            }}
            className="dubai-med">Approved by Mohammed Riyaz</Typography>: null} */}
          </Box>
        ))}
      </Box>
    </Fade>
  );
};

export default ProfessionalInformationCard;
