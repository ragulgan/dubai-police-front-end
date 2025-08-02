"use client";
import { Box, Typography } from "@mui/material";
import _ from "lodash";
import TotalCost from "../../../public/totalCost.svg";
import TicketCost from "../../../public/ticketCost.svg";
import AccommodationCost from "../../../public/accommodationCost.svg";
import TranspotationCost from "../../../public/transpotationCost.svg";
import RegistrationCost from "../../../public/registrationCost.svg";
import ShippingCost from "../../../public/shippingCost.svg";
import OtherCost from "../../../public/otherCost.svg";

interface EstimatedCostProps {
  data?: any;
  module?: any;
}

const EstimatedCost: React.FC<EstimatedCostProps> = ({ data, module }) => {
  const modules: any = {
    trainingCamp: [
      {
        name: "Total Cost",
        nodeName: "totalCost",
        icon: <TotalCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Ticket Cost",
        nodeName: "ticketsCost",
        icon: <TicketCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Accommodation Cost",
        nodeName: "accommodationCost",
        icon: <AccommodationCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Transportation Cost",
        nodeName: "transportationCost",
        icon: <TranspotationCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Registration Fees",
        nodeName: "registrationFees",
        icon: <RegistrationCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Shipping Fees",
        nodeName: "shippingFees",
        icon: <ShippingCost style={{ width: 16, height: 16 }} />,
      },
      {
        name: "Other Fees",
        nodeName: "otherExpenses",
        icon: <OtherCost style={{ width: 16, height: 16 }} />,
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
              `${data[item.nodeName]} AED`
            )}
          </Typography>
        </Box>
      ))}
      <Box py={1} px={0.5}>
        <RenderEditorContent content="Includes Meals and Transportation to Event" />
      </Box>
    </Box>
  );
};

export default EstimatedCost;
