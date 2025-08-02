import CountAnimation from "@/components/common/CounterAnimation";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

const CardSection = (props: any) => {
  const {
    Icon,
    data,
    leftHead,
    leftContent,
    rightHead,
    rightContent,
    bgColor,
    bgImage,
  } = props;
  return (
    <Card
      sx={{
        backgroundColor: bgColor,
        color: "white",
        borderRadius: 2,
        px: 2,
        py: 1,
        height: "152px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage?.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: leftHead === "Medal" ? "60%" : "70%",
          zIndex: 1,
          mixBlendMode: leftHead === "Medal" ? "color-dodge" : "screen",
        }}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
        }}
        zIndex={5}
      >
        <Icon width="64px" height="64px" sx={{ color: bgColor }} />
      </Box>

      <Box display={"flex"} height={"100%"} justifyContent={"space-between"}>
        <Box
          sx={{ placeItems: "self-start", placeContent: "start", width: "50%" }}
          zIndex={5}
        >
          <Typography
            className="dubai-regular"
            sx={{
              fontSize: "18px",
            }}
          >
            {leftHead}
          </Typography>
          <Typography
            className="bukra-semi-bold"
            sx={{
              fontSize: "30px",
            }}
          >
            {leftContent === "attendance" ? (
              data && data[leftContent]
            ) : (
              <CountAnimation value={Number(data && data[leftContent])} />
            )}
          </Typography>
        </Box>
        <Box
          sx={{ placeItems: "self-end", placeContent: "end", width: "40%" }}
          zIndex={5}
        >
          <Typography
            textAlign="right"
            sx={{
              fontSize: "18px",
            }}
            className="dubai-regular"
          >
            {rightHead}
          </Typography>
          <Typography
            textAlign="right"
            className="bukra-semi-bold"
            sx={{
              fontSize: "30px",
            }}
          >
            <CountAnimation value={Number(data && data[rightContent])} />
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default CardSection;
