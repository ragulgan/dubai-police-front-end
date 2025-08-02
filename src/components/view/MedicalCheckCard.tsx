import { Box, Fade, Grid, Typography } from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import SettingsSVG from "../../../public/SettingsSVG.svg";
import XlsSVG from "../../../public/XlsSVG.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FitnessTest from "../widgets/FitnessTest";
import FieldTest from "../widgets/FieldTest";
import MedicalTest from "../widgets/MedicalTest";
import PerformanceTest from "../widgets/PerformaceTest";
import axios from "axios";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";

interface MedicalCheckCardProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  TestAndMedicalByIdAthelete: any;
}

const MedicalCheckCard: React.FC<any> = ({
  label,
  expanded,
  onClick,
  TestAndMedicalByIdAthelete,
  sportID,
  athleteId,
}) => {
  const downloadExcel = async () => {
    try {
      const response = await axiosCallBlob.post(
        `${process.env.API_BASE_URL}/Sports/ExportTestAndMedicalsByAthletID`,
        {
          sportID: Number(sportID),
          athleteID: Number(athleteId),
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TestAndMedicalChecks.xlsx");
      document.body.appendChild(link);
      link.click();
      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error(
        "An error occurred while downloading the Excel file:",
        error
      );
      alert("Failed to download the file. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        marginTop: 1,
        padding: 1,
        borderRadius: "8px",
        borderBottomLeftRadius: expanded ? "8px" : "8px",
        borderBottomRightRadius: expanded ? "8px" : "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomButton
            sx={{ marginRight: 2, backgroundColor: "#0087551A" }}
            label="Export to Excel"
            variant="outlined"
            size="small"
            ButtonIcon={XlsSVG}
            iconPosition="start"
            onClick={(e: any) => {
              downloadExcel();
              e.stopPropagation();
            }}
          />
          {expanded && (
            <span onClick={onClick}>
              <ExpandMoreIcon sx={{ cursor: "pointer" }} />
            </span>
          )}
        </Box>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <FitnessTest
              fitnessData={
                TestAndMedicalByIdAthelete?.militaryReadiness ?? []
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PerformanceTest
              performanceData={
                TestAndMedicalByIdAthelete?.performance ??
                []
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldTest
              fieldData={
                TestAndMedicalByIdAthelete?.field ?? []
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MedicalTest
              medicalData={
                TestAndMedicalByIdAthelete?.medical ?? []
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MedicalCheckCard;
