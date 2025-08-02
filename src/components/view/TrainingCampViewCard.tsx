"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import ViewPageNavSmall from "../nav/ViewPageNavSmall";
import SlideDialog from "../SlideDialog";
import MainLongTermGoals from "./MainLongTermGoals";
import MainShortTermGoals from "./MainShortTermGoals";
import MainStrategy from "./MainStrategy";
import TravelDetails from "./TravelDetails";
import EstimatedCost from "./EstimatedCost";

interface ProfileCardProps {
  data?: any;
  module?: any;
  id?: any;
}

const TrainingCampViewCard: React.FC<ProfileCardProps> = ({
  data,
  module,
  id,
}) => {
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
        }}
      >
        <Box>
          <ViewPageNavSmall
            label="Main Long-Term Goal"
            expanded={section == 1}
            onClick={() => toggleSection(1)}
            module={module}
          />
          {section == 1 && <MainLongTermGoals data={data} module={module} />}
          <ViewPageNavSmall
            label="Main Short-Term Goals"
            expanded={section == 2}
            onClick={() => toggleSection(2)}
            module={module}
          />
          {section == 2 && <MainShortTermGoals data={data} module={module} />}
          <ViewPageNavSmall
            label="Main Strategy"
            expanded={section == 3}
            onClick={() => toggleSection(3)}
            module={module}
          />
          {section == 3 && <MainStrategy data={data} module={module} />}
          <ViewPageNavSmall
            label="Travel Details"
            expanded={section == 4}
            onClick={() => toggleSection(4)}
            module={module}
          />
          {section == 4 && (
            <TravelDetails data={data} module={"trainingCamp"} />
          )}
          <ViewPageNavSmall
            label="Estimated Cost"
            expanded={section == 5}
            onClick={() => toggleSection(5)}
            module={module}
          />
          {section == 5 && <EstimatedCost data={data} module={module} />}
        </Box>
      </Box>
    </>
  );
};

export default TrainingCampViewCard;
