import { Chip, Tooltip } from "@mui/material";
import Advanced from "../../../public/athletesPerformanceLevel/Advanced.svg";
import Intermediate from "../../../public/athletesPerformanceLevel/Intermediate.svg";
import Beginner from "../../../public/athletesPerformanceLevel/Beginner.svg";

interface AthletePerformanceLevelChipProps {
  performanceLevel: string;
}

const AthletePerformanceLevelChip: React.FC<
  AthletePerformanceLevelChipProps
> = ({ performanceLevel }) => {
  //Advanced
  if (performanceLevel && performanceLevel.toLowerCase() === "advanced")
    return (
      <Tooltip title="Performance Level">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label="Advanced"
          variant="outlined"
          sx={{
            padding: 1,
            color: "#B15D15",
            borderColor: "#B15D15",
            backgroundColor: "#FFFDFB",
          }}
          icon={<Advanced style={{ width: 32, height: 32 }} />}
        />
      </Tooltip>
    );

  //Intermediate
  if (performanceLevel && performanceLevel.toLowerCase() === "intermediate")
    return (
      <Tooltip title="Performance Level">
        <Chip
          className="dubai-regular text-capitalize status-chip"
          label="Intermediate"
          variant="outlined"
          sx={{
            padding: 1,
            color: "#00426A",
            borderColor: "#00426A",
            backgroundColor: "#F6F8FE",
          }}
          icon={<Intermediate style={{ width: 32, height: 32 }} />}
        />
      </Tooltip>
    );

  // Beginner
  return (
    <Tooltip title="Performance Level">
      <Chip
        className="dubai-regular text-capitalize status-chip"
        label={"Beginner"}
        variant="outlined"
        sx={{
          padding: 1,
          color: "#008755",
          borderColor: "#008755",
          backgroundColor: "#FBFFFD",
        }}
        icon={<Beginner style={{ width: 14, height: 14 }} />}
      />
    </Tooltip>
  );
};

export default AthletePerformanceLevelChip;
