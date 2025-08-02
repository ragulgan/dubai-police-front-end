import React from "react";
import FeaturedArticleLogo from "../../../public/FeaturedArticle.svg";
import { Alert, Box, Button, Typography } from "@mui/material";
import SimpleSlider from "./cardCarousel";
import { useRouter } from "next/router";

const FeaturedArticle = (props: any) => {
  const { listNewsData } = props;
  const router = useRouter();

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
              <FeaturedArticleLogo style={{ width: "40px", height: "40px" }} />
              <Typography
                className="bukra-semi-bold primary-color"
                sx={{ fontSize: "24px", ml: 1 }}
              >
                Featured Article
              </Typography>
            </Box>
            <Box width={"50%"} textAlign={"end"}>
              <Button
                variant="text"
                className="dubai-med text-capitalize"
                onClick={() => router.push(`/news/viewall/featuredArticle`)}
              >
                View All
              </Button>
            </Box>
          </Box>
          <Box mt={1}>
            <Box>
              <SimpleSlider listNewsData={listNewsData} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FeaturedArticle;
