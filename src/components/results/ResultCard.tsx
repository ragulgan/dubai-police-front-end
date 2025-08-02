import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditIcon from "../../../public/EditSVG.svg";
import Location from "../../../public/Location.svg";
import CalendarGrey from "../../../public/calendarResult.svg";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface ResultCardProps {
  eventName: any;
  eventLocation: string;
  eventDate: string;
  eventTime?: any;
  comments?: any;
  homeTeamName: any;
  awayTeamName: any;
  selectWinner: any;
  onViewClick?: () => void;
  onEditClick?: () => void;
  module?: any;
}

const ResultCard: React.FC<ResultCardProps> = ({
  eventName,
  eventLocation,
  eventDate,
  eventTime,
  comments,
  homeTeamName,
  awayTeamName,
  selectWinner,
  onViewClick,
  onEditClick,
  module,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return (
      <div>
        Comments:{" "}
        {plainText
          ? plainText.length > 40
            ? `${plainText.slice(0, 40)}...`
            : plainText
          : "--"}
      </div>
    );
  };

  return (
    <Card
      sx={{
        maxHeight: "431px",
        width: "411px",
        border: "1px solid #0087554D",
        borderRadius: "10px",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
        padding: "3px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 1,
          padding: 2,
        }}
      />
      <CardContent sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          sx={{
            fontFamily: "29LT Bukra",
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            textAlign: "left",
          }}
          className="bukra"
        >
          {eventName && eventName.length > 40
            ? `${eventName.slice(0, 40)}...`
            : eventName}
        </Typography>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start !important"
          mt={1}
          mb={1}
        >
          <Location width={"20px"} height={"20px"} />
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "16px",
              color: "#58585B",
              textAlign: "left",
              marginRight: "3px",
              marginLeft: "5px",
              paddingTop: "2px",
            }}
            className="dubai-regular"
          >
            {eventLocation}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start !important"
          mt={1}
          mb={1}
        >
          <CalendarGrey width={"20px"} height={"20px"} />
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "24px",
              color: "#58585B",
              textAlign: "left",
              marginRight: "3px",
              marginLeft: "5px",
            }}
            className="dubai-regular"
          >
            {eventDate}
          </Typography>
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid #B1DACB",
            marginBottom: 2,
            marginTop: 2,
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          mt={4}
        >
          <Stack alignItems="center" position="relative" height="160px">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#FFE5CC",
                color: "#000000",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Dubai",
                  fontWeight: 700,
                  fontSize: "32px",
                  color: "#000000",
                }}
                className="dubai-med"
              >
                {getInitials(homeTeamName)}
              </Typography>
            </Avatar>
            <Typography
              sx={{
                fontFamily: "Dubai",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000",
                marginTop: "7px",
              }}
              className="dubai-med"
            >
              {homeTeamName && homeTeamName.length > 40
                ? `${homeTeamName.slice(0, 40)}...`
                : homeTeamName}
            </Typography>
            {selectWinner === homeTeamName ? (
              <Box display="flex" justifyContent="center" mt={1} mb={2}>
                <Chip
                  label={"Winner"}
                  sx={{
                    padding: "0px",
                    backgroundColor: "#FFFAE8",
                    color: "#000000",
                    height: "20px",
                    border: "1px solid #FFAF2F",
                    borderRadius: "4px",
                    ".MuiChip-label": {
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "18px",
                      textAlign: "left",
                      paddingY: "7px",
                      paddingX: "10px",
                    },
                  }}
                />
              </Box>
            ) : null}
          </Stack>

          <Typography
            sx={{
              fontFamily: "Dubai",
              fontWeight: 700,
              fontSize: "28px",
              color: "#000000",
              paddingBottom: "75px",
            }}
            className="dubai-med"
          >
            V/S
          </Typography>
          <Stack alignItems="center" position="relative" height="160px">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#F3F3F3",
                color: "#000000",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Dubai",
                  fontWeight: 700,
                  fontSize: "32px",
                  color: "#000000",
                }}
                className="dubai-med"
              >
                {getInitials(awayTeamName)}
              </Typography>
            </Avatar>
            <Typography
              sx={{
                fontFamily: "Dubai",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000000",
                marginTop: "7px",
              }}
              className="dubai-med"
            >
              {awayTeamName && awayTeamName.length > 40
                ? `${awayTeamName.slice(0, 40)}...`
                : awayTeamName}
            </Typography>
            {selectWinner === awayTeamName ? (
              <Box display="flex" justifyContent="center" mt={1} mb={2}>
                <Chip
                  label={"Winner"}
                  sx={{
                    padding: "0px",
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    fontSize: "12px",
                    backgroundColor: "#FFFAE8",
                    color: "#000000",
                    lineHeight: "18px",
                    height: "20px",
                    ".MuiChip-label": {
                      py: "7px",
                      px: "10px",
                    },
                    border: "1px solid #FFAF2F",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            ) : null}
          </Stack>
        </Stack>

        <Box
          sx={{
            height: "38px",
            padding: "7px 10px",
            gap: "8px",
            borderRadius: "6px",
            opacity: 1,
            backgroundColor: "#AEAECA1A",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Dubai",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px",
              color: "#58585B",
            }}
            className="dubai-med"
          >
            <RenderEditorContentHtml content={comments} />
          </Typography>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          marginTop={2}
          marginLeft={0}
        >
          {(checkAccess(USER_PERMISSION.ResultView) &&
            module !== "latest-result") ||
          (checkAccess(USER_PERMISSION.LatestResultsView) &&
            module === "latest-result") ? (
            <IconButton
              sx={{
                backgroundColor: "#008755",
                color: "white",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
                width: "50%",
                padding: "4px 8px",
                minHeight: "48px",
              }}
              onClick={onViewClick}
            >
              <VisibilityIcon />
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
                ml={1}
                className="dubai-med"
              >
                View
              </Typography>
            </IconButton>
          ) : null}
          {(checkAccess(USER_PERMISSION.ResultEdit) &&
            module !== "latest-result") ||
          (checkAccess(USER_PERMISSION.LatestResultsEdit) &&
            module === "latest-result") ? (
            <IconButton
              sx={{
                backgroundColor: "transparent",
                color: "#008755",
                border: "1px solid #008755",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#fff",
                },
                width: "50%",
                padding: "4px 8px",
                minHeight: "48px",
              }}
              className="dubai-med"
              onClick={onEditClick}
            >
              <EditIcon width={"18px"} height={"18px"} />
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
                ml={1}
                className="dubai-med"
              >
                Edit
              </Typography>
            </IconButton>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
