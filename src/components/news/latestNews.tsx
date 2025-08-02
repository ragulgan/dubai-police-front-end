import React from "react";
import LatestNewsLogo from "../../../public/LatestNews.svg";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CardView from "./cardView";
import { useRouter } from "next/router";
import RenderHtmlContent from "../common/RenderHtmlContent";

const LatestNews = (props: any) => {
  const { listNewsData } = props;
  const router = useRouter();
  const is2K = useMediaQuery("(min-width:1535px)");
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  return (
    <Box px={5}>
      {listNewsData && listNewsData.length === 0 ? null : (
        <>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box width={"50%"} display={"flex"} alignItems={"center"}>
              <LatestNewsLogo style={{ width: "40px", height: "40px" }} />
              <Typography
                className="bukra-semi-bold primary-color"
                sx={{ fontSize: "24px", ml: 1 }}
              >
                Latest News
              </Typography>
            </Box>
            <Box width={"50%"} textAlign={"end"}>
              <Button
                variant="text"
                className="dubai-med text-capitalize"
                onClick={() => router.push(`/news/viewall/latestNews`)}
              >
                View All
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2} mt={1}>
            {/* <Grid item xs={5}>
              <Box
                borderRadius={"8px"}
                height={"220px"}
                display={"grid"}
                sx={{
                  textAlign: "center",
                  alignContent: "center",
                  placeItems: "center",
                  backgroundImage: `url(Tournament1.svg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "bottom",
                  position: "relative",
                }}
              >
                <Box
                  position={"absolute"}
                  bgcolor={"rgba(6, 18, 77, 0.8)"}
                  borderRadius={"8px"}
                  height={"220px"}
                  width={"100%"}
                />
                <Box
                  width={"80%"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Avatar
                    src="/static/images/avatar/1.jpg"
                    sx={{
                      border: "3px solid #ffffff",
                      width: "64px",
                      height: "64px",
                    }}
                  />
                  <Avatar
                    src="/static/images/avatar/2.jpg"
                    sx={{
                      border: "3px solid #ffffff",
                      width: "74px",
                      height: "74px",
                    }}
                  />
                  <Avatar
                    src="/static/images/avatar/3.jpg"
                    sx={{
                      border: "3px solid #ffffff",
                      width: "64px",
                      height: "64px",
                    }}
                  />
                </Box>
                <Typography
                  className="bukra-semi-bold"
                  color="#ffffff"
                  sx={{ fontSize: "22px", mt: 2, zIndex: 999 }}
                >
                  Monthly Awards
                </Typography>
              </Box>
              <Box
                borderRadius={"8px"}
                height={"220px"}
                mt={1}
                display={"grid"}
                sx={{
                  alignContent: "end",
                  backgroundImage: `url(Tournament1.svg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <Box
                  position={"absolute"}
                  bgcolor={"#258A1C"}
                  borderRadius={"8px"}
                  height={"220px"}
                  width={"100%"}
                  sx={{ opacity: "0.8" }}
                />
                <Typography
                  className="bukra-semi-bold webkit-line-clamp webkit-2"
                  color="#ffffff"
                  sx={{ fontSize: "19px", mb: 2, zIndex: 999 }}
                  width={"85%"}
                  pl={2}
                  pb={5}
                >
                  ADNOC Pro League Fantasy Sees Growing Participation Ahead of..
                </Typography>
              </Box>
            </Grid> */}
            <Grid item xs={12}>
              <Card
                sx={{
                  height: "450px",
                  width: "100%",
                  backgroundImage: `url(${
                    listNewsData && listNewsData[0]?.filePath
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover .hover-title": {
                    opacity: 1,
                  },
                }}
                onClick={() =>
                  router.push(
                    `news/view/${listNewsData && listNewsData[0]?.newsID}`
                  )
                }
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    p: 2,
                    textAlign: "start",
                    height: "406px",
                    background:
                      "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                    width: "100%",
                    alignContent: "end",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    className="bukra-semi-bold webkit-line-clamp webkit-2"
                    fontSize={"28px"}
                    fontWeight={600}
                  >
                    {listNewsData && listNewsData[0]?.articleTitle}
                  </Typography>
                  <Typography className="dubai-regular" fontSize={"16px"}>
                    {listNewsData && listNewsData[0]?.newsDate}
                  </Typography>
                  <Typography
                    className="dubai-regular webkit-line-clamp webkit-2"
                    fontSize={"16px"}
                    lineHeight={"25.6px"}
                    width={"80%"}
                    mt={2}
                  >
                    <RenderHtmlContent
                      content={listNewsData && listNewsData[0]?.paragraph}
                    />
                  </Typography>
                </Box>
              </Card>
            </Grid>
            {listNewsData &&
              listNewsData
                .slice(1, is2K ? 6 : 5)
                .map((item: any, index: number) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
                    key={index}
                  >
                    <CardView
                      title={item?.articleTitle}
                      date={item?.newsDate}
                      paragraph={item?.paragraph}
                      image={item?.filePath}
                      id={item?.newsID}
                    />
                  </Grid>
                ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default LatestNews;
