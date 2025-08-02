"use client";
import { Typography } from "@mui/material";

interface ViewTestCardValueProps {
  label: string;
  value: string;
  isLink?: boolean;
}

const ViewTestCardValue: React.FC<any> = ({
  label,
  value,
  isLink,
  isLinkData,
}) => {
  const handleClick = () => {
    if (isLink && isLinkData) {
      window.open(isLinkData, "_blank");
    }
  };

  const formatValue = (value: any) => {
    if (!value) return "--";
    const formattedValues: { [key: string]: string } = {
      injured: "Injured",
      notFit: "Not Fit",
      recovering: "Recovering",
      fitToPlay: "Fit To Play",
    };
    return formattedValues[value] || value;
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: "15px",
          lineHeight: "22.95px",
          color: "#58585B",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "250px",
        }}
        className="bukra"
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          lineHeight: "22.95px",
          color: isLink ? "#05868E" : "#69696C",
          cursor: isLink ? "pointer" : "auto",
          ...(label === "Comments" || label === "Supporting Documents" || label === "Final Comments"
            ? {
              whiteSpace: "pre-line",
              width: "100%",
              wordBreak: "break-word",
              height: "100%"
            }
            : {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "250px",
            }),
        }}
        onClick={handleClick}
        className="dubai-regular"
      >
        {formatValue(value)}
      </Typography>
    </>
  );
};

export default ViewTestCardValue;
