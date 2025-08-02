import { Box, Grid, Typography } from "@mui/material";
import TestPadSVG from "../../../public/TestPadSVG.svg";

const cardLeft = { fontWeight: 500, fontSize: 16, color: "#58585B" };

interface MedicalTestProps {
  medicalData: any;
}

const MedicalTest: React.FC<MedicalTestProps> = ({ medicalData }) => {
  return (
    <>
      <Box
        sx={{ border: 1, borderColor: "#B1E4E3", borderRadius: 2, padding: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              backgroundColor: "#54E28E4D",
              padding: 2,
            }}
          >
            <TestPadSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                padding: 1,
                fontSize: 18,
                color: "#000000",
              }}
              className="bukra"
            >
              {"Medical Test"}
            </Typography>
          </Box>
        </Box>
        {medicalData && Array.isArray(medicalData) && medicalData.length > 0
          ? medicalData.map((result: any) => (
              <Grid container spacing={1} paddingTop={1} key={result.id}>
                <Grid item xs={5} md={5}>
                  <Typography
                    variant="caption"
                    sx={cardLeft}
                    className="dubai-med"
                  >
                    {result.testName}
                  </Typography>
                </Grid>
                <Grid item xs={7} md={7}>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 16, color: "#000000" }}
                    className="dubai-med"
                  >
                    {result.testResult ? result.testResult : "--"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      marginLeft: 1,
                      fontSize: 12,
                      color: "#008755",
                    }}
                    className="dubai-med"
                  >
                    {result.unitOfMeasurement
                      ? `(${result.unitOfMeasurement === "custom" ? result.customUnitOfMeasurement : result.unitOfMeasurement})`
                      : "--"}
                  </Typography>
                </Grid>
              </Grid>
            ))
          : null}
      </Box>
    </>
  );
};

export default MedicalTest;
