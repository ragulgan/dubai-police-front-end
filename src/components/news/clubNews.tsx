import React from "react";
import ClubNewsLogo from "../../../public/ClubNews.svg";
import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CardView from "./cardView";
import SimpleSlider from "./cardCarousel";
import { useRouter } from "next/router";

const ClubNews = (props: any) => {
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
              <ClubNewsLogo style={{ width: "40px", height: "40px" }} />
              <Typography
                className="bukra-semi-bold primary-color"
                sx={{ fontSize: "24px", ml: 1 }}
              >
                Club's News
              </Typography>
            </Box>
            <Box width={"50%"} textAlign={"end"}>
              <Button
                variant="text"
                className="dubai-med text-capitalize"
                onClick={() => router.push(`/news/viewall/clubNews`)}
              >
                View All
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2} mt={2}>
            {listNewsData &&
              listNewsData
                .slice(0, is2K ? 5 : 4)
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
          <Box mt={2}>
            <Box>
              <SimpleSlider listNewsData={listNewsData} module={"clubNews"} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ClubNews;
