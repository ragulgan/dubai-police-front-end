"use client";

import { Box, Button, Fade, IconButton, Typography } from "@mui/material";
import Graduation from "../../../public/graduation.svg";
import FieldStudy from "../../../public/fieldStudy.svg";
import CoachExperience from "../../../public/coachExperience.svg";
import OrganisationSkill from "../../../public/organisationSkill.svg";
import AchievementSkill from "../../../public/achievementSkill.svg";
import Punctuality from "../../../public/Punctuality.svg";
import Availability from "../../../public/availability.svg";
import Monitor from "../../../public/monitor.svg";
import BrowserOpen from "../../../public/browserOpen.svg";
import Runningshoe from "../../../public/Runningshoe.svg";
import Jersey from "../../../public/Jersey.svg";
import Helmet from "../../../public/Helmet.svg";
import Glove from "../../../public/Glove.svg";
import Short from "../../../public/Short.svg";
import _ from "lodash";

interface PhysicalMeasurementsProps {
  data: any;
  module: any;
}

const PhysicalMeasurements: React.FC<PhysicalMeasurementsProps> = ({
  data,
  module,
}) => {
  const modules: any = {
    staff: [
      {
        name: "Academic Qualification",
        nodeName: "qualification",
        icon: <Graduation style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Field of Study",
        nodeName: "fieldOfStudy",
        icon: <FieldStudy style={{ width: 16, height: 16 }} />,
      },
      // {
      //   name: "Coaching Experience",
      //   nodeName: "coachingExperience",
      //   icon: <CoachExperience style={{ width: 16, height: 16 }} />,
      // },
      {
        name: "Organizational Skills",
        nodeName: "organizationalSkills",
        icon: <OrganisationSkill style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Leadership Skills",
        nodeName: "leadershipSkills",
        icon: <AchievementSkill style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Computer Skills",
        nodeName: "computerSkills",
        icon: <Monitor style={{ width: 16, height: 16 }} />,
      },
      // {
      //   name: "Punctuality in Meetings",
      //   nodeName: "punctualityInMeetings",
      //   icon: <Punctuality style={{ width: 16, height: 16 }} />,
      // },
      // {
      //   name: "Availability on Training Sessions",
      //   nodeName: "availabilityOnTraining",
      //   icon: <Availability style={{ width: 16, height: 16 }} />,
      // },
    ],
    athlete: [
      {
        name: "Shoe Size",
        nodeName: "sizeOfShoe",
        icon: <Runningshoe style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Jersey Size",
        nodeName: "sizeOfJersey",
        icon: <Jersey style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Helmet Size",
        nodeName: "sizeOfHelmet",
        icon: <Helmet style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Glove Size",
        nodeName: "sizeOfGloves",
        icon: <Glove style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Trouser Size",
        nodeName: "sizeOfTrousers",
        icon: <Short style={{ width: 16, height: 16 }} />,
      },
    ],
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box>
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
              {_.isEmpty(data && data[item.nodeName]) ||
              (data && data[item.nodeName] === " ") ? (
                <>&nbsp;</>
              ) : (
                data[item.nodeName]
              )}
            </Typography>
          </Box>
        ))}
      </Box>
    </Fade>
  );
};

export default PhysicalMeasurements;
