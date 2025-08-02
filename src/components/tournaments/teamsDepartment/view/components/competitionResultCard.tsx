import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import CalendarGrey from "../../../../../../public/CalendarGrey.svg";
import Location from "../../../../../../public/Location.svg";
import TrophyIcon from "../../../../../../public/svg/trophyIcon.svg";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";

const CompetitionResultCard = (props: any) => {
  const { data, module, cursor } = props;
  const router = useRouter();

  return (
    <Box
      sx={{
        outline: "1px solid rgba(0, 135, 85, 0.3)",
        borderLeft: data?.eventStatus === "Winner" ? "5px solid orange"  : "5px solid #e4002b",
        p: 2,
        bgcolor: "white",
        borderRadius: "10px",
        width: "100%",
        height: "87px",
        transition: "height 0.3s ease", // Smooth transition
        "&:hover": {
          height: "150px", // Increase height on hover
        },
        overflow: "hidden",
        cursor: cursor === "false" ? "" : "pointer",
      }}
      mb={1}
      onClick={() => {
        if (module === "result") {
          router.push(
            `/latest-results/view/${Number(data?.resultID)}?sportId=${Number(
              data?.sportID
            )}`
          );
        }
      }}
    >
      <Typography
        display="flex"
        flexDirection="row"
        sx={{
          fontSize: "16px",
          mt: 0.5,
        }}
        className="bukra-semi-bold"
      >
        <Chip
          key={data?.sportName}
          label={data?.sportName}
          icon={
            data?.sportName === "All" ? (
              <TrophyIcon
                style={{
                  width: "20px",
                  height: "16px",
                  paddingTop: "4px",
                }}
              />
            ) : (
              <img
                src={data?.sportImage}
                style={{
                  width: "20px",
                  height: "16px",
                  paddingTop: "4px",
                  objectFit: "cover",
                }}
                alt={data?.sportName}
              />
            )
          }
          sx={{
            padding: "0px",
            fontSize: "16px",
            backgroundColor: "rgba(0, 135, 85, 0.03)",
            color: "#008755",
            lineHeight: "18px",
            height: "24px",
            ".MuiChip-label": {
              padding: "8px",
            },
            border: "1px solid #008755",
            mr: 1,
            width: "fit-content",
          }}
          className="dubai-med webkit-line-clamp webkit-1"
        />
        {data?.eventStatus === "Winner" && (
          <Chip
            label={"Winner"}
            sx={{
              padding: "11px",
              backgroundColor: "#FFFAE8",
              color: "#000000",
              height: "20px",
              border: "1px solid #FFAF2F",
              fontSize: "12px",
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
            className="dubai-med"
          />
        )}
        {data?.eventStatus === "Lose" && (
          <Chip
            label={"Lose"}
            sx={{
              padding: "11px",
              backgroundColor: "	#ffe5e5",
              color: "#e4002b",
              height: "20px",
              border: "1px solid #e4002b",
              fontSize: "12px",
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
            className="dubai-med"
          />
        )}
      </Typography>
      <Typography
        variant="body2"
        mt={1.5}
        className="dubai-med text-capitalize"
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#000000",
        }}
      >
        {isEmpty(data?.selectWinner) ? (
          isEmpty(data?.tournamentName) ? (
            <>&nbsp;</>
          ) : (
            data?.tournamentName
          )
        ) : (
          data?.selectWinner
        )}
      </Typography>
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Location style={{ width: 20, height: 20 }} />
        <Typography
          className="dubai-regular"
          sx={{
            paddingX: 1,
            fontSize: "16px",
            lineHeight: "21px",
            color: "#58585B",
          }}
        >
          {isEmpty(data?.eventLocation) ? "Dubai" : data?.eventLocation}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <CalendarGrey style={{ width: 20, height: 20 }} />
        <Typography
          className="dubai-regular"
          sx={{
            paddingX: 1,
            fontSize: "16px",
            lineHeight: "21px",
            color: "#58585B",
          }}
        >
          {module === "result"
            ? `${data?.eventDate} ${data?.eventTime}`
            : data?.trainingStartDate}
        </Typography>
      </Box>
    </Box>
  );
};

export default CompetitionResultCard;