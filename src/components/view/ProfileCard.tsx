"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import ViewPageNavSmall from "../nav/ViewPageNavSmall";
import PersonalDetailsCard from "./PersonalDetailsCard";
import ContractDetailsCard from "./ContractDetailsCard";
import SportsInformation from "./SportsInformation";
import ProfessionalInformationCard from "./ProfessionalInformationCard";
import CircularProgressAvatar from "./CircularProgressAvatar";
import EditSVG from "../../../public/EditSVG.svg";
import CustomButton from "../buttons/CustomButton";
import SlideDialog from "../SlideDialog";
import RoleChip from "../chips/RoleChip";
import PhysicalMeasurements from "./PhysicalMeasurements";

interface ProfileCardProps {
  data: any;
  module: any;
  id?: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ data, module, id }) => {
  const [section, setSection] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  return (
    <>
      <SlideDialog
        open={showEditDialog}
        id={id}
        onClose={() => setShowEditDialog(false)}
        module={module}
      />
      <Box
        sx={{
          borderRadius: "8px",
          backgroundColor: "white",
          mt: 1,
        }}
      >
        {module === "athlete" ? (
          <Box>
            <ViewPageNavSmall
              label="Personal & Contact Details"
              expanded={section == 1}
              onClick={() => toggleSection(1)}
              module={module}
            />
            {section == 1 && <PersonalDetailsCard data={data} module={module} />}
            <ViewPageNavSmall
              label="Contract Details"
              expanded={section == 2}
              onClick={() => toggleSection(2)}
              module={module}
            />
            {section == 2 && <ContractDetailsCard data={data} module={module} />}
            <ViewPageNavSmall
              label="Physical Measurements"
              expanded={section == 3}
              onClick={() => toggleSection(3)}
              module={module}
            />
            {section == 3 && <PhysicalMeasurements data={data} module={module} />}
            <ViewPageNavSmall
              label="Professional Information"
              expanded={section == 4}
              onClick={() => toggleSection(4)}
              module={module}
            />
            {section == 4 && <ProfessionalInformationCard data={data} module={module} />}
            <ViewPageNavSmall
              label="Sport Information"
              expanded={section == 5}
              onClick={() => toggleSection(5)}
              module={module}
            />
            {section == 5 && <SportsInformation data={data} module={module} />}
          </Box>
        ) : (
          <Box>
            <ViewPageNavSmall
              label="Personal & Contact Details"
              expanded={section == 1}
              onClick={() => toggleSection(1)}
              module={module}
            />
            {section == 1 && <PersonalDetailsCard data={data} module={module} />}
            <ViewPageNavSmall
              label="Contract Details"
              expanded={section == 2}
              onClick={() => toggleSection(2)}
              module={module}
            />
            {section == 2 && <ContractDetailsCard data={data} module={module} />}
            <ViewPageNavSmall
              label="Education & Experience"
              expanded={section == 3}
              onClick={() => toggleSection(3)}
              module={module}
            />
            {section == 3 && <SportsInformation data={data} module={module} />}
            <ViewPageNavSmall
              label="Sport certification"
              expanded={section == 4}
              onClick={() => toggleSection(4)}
              module={module}
            />
            {section == 4 && <ProfessionalInformationCard data={data} module={module} />}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProfileCard;