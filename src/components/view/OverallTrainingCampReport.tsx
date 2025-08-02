import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React from "react";
import ResultAchivedCampSlider from "../trainingCamp/view/resultAchived";

interface OverallTrainingCampReportProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  id: any;
  data?: any;
}

const OverallTrainingCampReport: React.FC<OverallTrainingCampReportProps> = ({
  label,
  expanded,
  onClick,
  id,
  data,
}) => {
  const sectionContainerStyle = {
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    padding: 1,
    borderRadius: "8px",
    borderBottomLeftRadius: expanded ? "8px" : "8px",
    borderBottomRightRadius: expanded ? "8px" : "8px",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const topBarButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const tabStyle = {
    fontFamily: "Dubai",
    fontSize: "16px",
    fontWeight: 500,
    textAlign: "left",
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px dashed #26D07C",
          borderRadius: "4px",
          backgroundColor: "rgba(38, 208, 124, 0.1)",
          fontSize: "16px",
          fontWeight: 500,
          color: "#58585B",
        }}
        className="dubai-med"
      />
    );
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={sectionContainerStyle}>
      <Box sx={topBarStyle} onClick={onClick}>
        <Typography
          variant="subtitle1"
          className="bukra-semi-bold"
          sx={{
            padding: 1,
            fontSize: 18,
            color: "#008755",
          }}
        >
          {label}
        </Typography>
        <Box sx={topBarButtonContainerStyle}>
          {expanded && (
            <span onClick={onClick}>
              <ExpandMoreIcon sx={{ cursor: "pointer" }} />
            </span>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Tab
                color="textSecondary"
                sx={tabStyle}
                className="dubai-med"
                label="PROBLEMS ENCOUNTERED"
                value="1"
              />
              <Tab
                color="textSecondary"
                sx={tabStyle}
                className="dubai-med"
                label="POSITIVE ASPECTS"
                value="2"
              />
              <Tab
                color="textSecondary"
                sx={tabStyle}
                className=" dubai-med"
                label="AREAS FOR IMPROVEMENT"
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <RenderEditorContent content={data?.problemsEncountered} />
          </TabPanel>
          <TabPanel value="2">
            <RenderEditorContent content={data?.positiveAspects} />
          </TabPanel>
          <TabPanel value="3">
            <RenderEditorContent content={data?.areasForImprovement} />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default OverallTrainingCampReport;
