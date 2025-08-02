"use client";
import { Box, Typography, useMediaQuery } from "@mui/material";
import LetterPadGreen from "../../../public/LetterPadGreen.svg";
import PerformanceGreen from "../../../public/PerformanceGreen.svg";
import FieldTestGreen from "../../../public/FieldTestGreen.svg";
import MedicalTestGreen from "../../../public/MedicalTestGreen.svg";
import { getTestName } from "@/utils/helper";

interface TestLangingPageCardProps {
  testType: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TestLangingPageCard: React.FC<TestLangingPageCardProps> = ({
  testType,
  onClick,
}) => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getCardHeight = () => {
    if (is4K) return "400px";
    if (isFullHD) return "300px";
    if (is3K) return "300px";
    if (is2K) return "250px";
    if (isLaptopL) return "250px";
    if (isLaptop) return "250px";
    if (isTab) return "250px";
    return "250px";
  };

  return (
    <div onClick={onClick}>
      <Box
        sx={{
          borderWidth: 1,
          borderColor: "#008755",
          borderStyle: "solid",
          borderRadius: 1,
          cursor: "pointer",
          display: "grid",
          width: "100%",
          height: getCardHeight(),
          placeContent: "center",
          placeItems: "center",
          "&:hover": {
            backgroundColor: "rgba(38, 208, 124, 0.04)",
          },
        }}
      >
        <Box
          sx={{
            borderWidth: 1,
            borderColor: "#008755",
            borderStyle: "solid",
            borderRadius: 1,
            bgcolor: "rgba(38, 208, 124, 0.04)",
            height: "80px",
            width: "80px",
            display: "grid",
            placeContent: "center",
          }}
        >
          {testType === "militaryReadiness" && (
            <LetterPadGreen style={{ width: 34, height: 45 }} />
          )}
          {testType === "performance" && (
            <PerformanceGreen style={{ width: 37, height: 37 }} />
          )}
          {testType === "field" && (
            <FieldTestGreen style={{ width: 34, height: 45 }} />
          )}
          {testType === "medical" && (
            <MedicalTestGreen style={{ width: 38, height: 37 }} />
          )}
        </Box>
        <Typography
          sx={{
            marginTop: 2,
            fontSize: "18px",
            lineHeight: "21.6px",
            color: "#000000",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="bukra"
        >
          {getTestName(String(testType))}
        </Typography>
      </Box>
    </div>
  );
};

export default TestLangingPageCard;
