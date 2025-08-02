import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TrainingCampNutritionPlanProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  data: any;
}

const TrainingCampNutritionPlan: React.FC<TrainingCampNutritionPlanProps> = ({
  label,
  expanded,
  onClick,
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

  const [selectedDay, setSelectedDay] = useState(0);
  const [sortedNutritionData, setSortedNutritionData] = useState([]);

  useEffect(() => {
    if (data?.nutritionPlanList?.length > 0) {
      const sortedData: any = [...data.nutritionPlanList].sort((a, b) => {
        const numA = parseInt(a.dayNutritionPlan.replace("Day ", ""));
        const numB = parseInt(b.dayNutritionPlan.replace("Day ", ""));
        return numA - numB;
      });
      setSortedNutritionData(sortedData);
    }
  }, [data]);

  const handleChange = (event: any, newValue: any) => {
    setSelectedDay(newValue);
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
      <Box sx={{ border: "1px solid #58585B33" }} borderRadius={"10px"}>
        <Box sx={{ maxWidth: "1400px" }}>
          <Tabs
            value={selectedDay}
            onChange={handleChange}
            variant="scrollable"
            sx={{
              borderRadius: "8px",
              padding: 2,
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {sortedNutritionData.map((day: any, index: any) => (
              <Tab
                key={day.nutritionPlanID}
                label={day.dayNutritionPlan}
                className="dubai-regular"
                sx={{
                  fontSize: "16px",
                  backgroundColor: selectedDay === index ? "#008755" : "#ddd",
                  color: selectedDay === index ? "#FFFFFF" : "#333",
                  borderRadius: "8px",
                  mx: 0.5,
                  width: "68px",
                  height: "33px",
                  minWidth: "68px",
                  minHeight: "33px",
                  padding: 0,
                  "&.Mui-selected": {
                    color: "#FFFFFF",
                  },
                }}
              />
            ))}
          </Tabs>
          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: "#58585B33",
              mb: 2,
            }}
          />
          <Box sx={{ padding: 2 }}>
            {sortedNutritionData.length > 0 && (
              <>
                {[
                  "morningNutritionPlan",
                  "afternoonNutritionPlan",
                  "dinnerNutritionPlan",
                ].map((mealType, index) => (
                  <Accordion
                    key={index}
                    defaultExpanded={mealType === "morningNutritionPlan"}
                    sx={{
                      backgroundColor: "#008755",
                      color: "white",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <AccordionSummary expandIcon={null}>
                      <Typography
                        className="dubai-med"
                        sx={{ fontWeight: 500 }}
                      >
                        {mealType.includes("morning")
                          ? "Morning (Breakfast)"
                          : mealType.includes("afternoon")
                          ? "Afternoon (Lunch)"
                          : "Evening (Dinner)"}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      {/* <IconButton size="small" sx={{ color: "white" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "white" }}>
                        <DeleteIcon />
                      </IconButton> */}
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        className="dubai-regular"
                        sx={{ fontSize: "16px" }}
                      >
                        {sortedNutritionData[selectedDay]?.[mealType] ||
                          "No data available"}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TrainingCampNutritionPlan;
