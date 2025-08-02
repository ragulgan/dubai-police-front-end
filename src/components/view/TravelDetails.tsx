"use client";
import { Box, Typography } from "@mui/material";
import CalendarSVG from "../../../public/CalendarSVG.svg";
import MarkerSVG from "../../../public/MarkerSVG.svg";
import Punctuality from "../../../public/Punctuality.svg";
import HotelName from "../../../public/hotelName.svg";
import _ from "lodash";

interface TravelDetailsProps {
  data?: any;
  module?: any;
}

const TravelDetails: React.FC<TravelDetailsProps> = ({ data, module }) => {
  const modules: any = {
    trainingCamp: [
      {
        name: "Departure Date",
        nodeName: "departureDate",
        icon: <CalendarSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Departure Time",
        nodeName: "departureTime",
        icon: <Punctuality style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Return Date",
        nodeName: "returnDate",
        icon: <CalendarSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Return Time",
        nodeName: "returnTime",
        icon: <Punctuality style={{ width: 16, height: 16 }} />,
      },
      {
        name: "City",
        nodeName: "travelCity",
        icon: <MarkerSVG style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Location",
        nodeName: "travelLocation",
        icon: <HotelName style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Hotel Name",
        nodeName: "hotelName",
        icon: <HotelName style={{ width: 16, height: 16 }} />,
      },
    ],
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
  return (
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
            className="dubai-med text-capitalize"
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
      <Box py={1} px={0.5}>
        <RenderEditorContent content="Training Camp Meetings Scheduled Daily" />
      </Box>
    </Box>
  );
};

export default TravelDetails;
