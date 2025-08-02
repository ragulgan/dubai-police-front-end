import React from "react";
import LatestNewsLogo from "../../../public/news.svg";
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

const News = (props: any) => {
  const { listNewsData } = props;
  const router = useRouter();
  const is2K = useMediaQuery("(min-width:1535px)");
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  return (
    <Box px={5} mt={10}>
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
                News
              </Typography>
            </Box>
            <Box width={"50%"} textAlign={"end"}>
              <Button
                variant="text"
                className="dubai-med text-capitalize"
                onClick={() => router.push(`/news/viewall/news`)}
              >
                View All
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Card
                sx={{
                  height: "650px",
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
            {listNewsData && listNewsData.length > 1 ? (
              <Grid item xs={6}>
                <Card
                  sx={{
                    height: "270px",
                    width: "100%",
                    backgroundImage: `url(${
                      listNewsData && listNewsData[1]?.filePath
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
                      `news/view/${listNewsData && listNewsData[1]?.newsID}`
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
                    >
                      {listNewsData && listNewsData[1]?.articleTitle}
                    </Typography>
                    <Typography className="dubai-regular" fontSize={"16px"}>
                      {listNewsData && listNewsData[1]?.newsDate}
                    </Typography>
                    <Typography
                      className="dubai-regular webkit-line-clamp webkit-2"
                      fontSize={"16px"}
                      lineHeight={"25.6px"}
                      width={"80%"}
                      mt={2}
                    >
                      <RenderHtmlContent
                        content={listNewsData && listNewsData[1]?.paragraph}
                      />
                    </Typography>
                  </Box>
                </Card>
                <Grid container spacing={2} mt={1}>
                  {listNewsData &&
                    listNewsData.slice(2, 4).map((item: any, index: number) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={is8K ? 4 : is4K ? 6 : is2K ? 6 : 12}
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
              </Grid>
            ) : null}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default News;
