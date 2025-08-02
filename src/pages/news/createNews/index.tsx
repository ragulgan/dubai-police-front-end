"use client";
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import _ from "lodash";
import CreateNewsForm from "@/components/news/createNewsForm";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import router from "next/router";

const CreateNews = () => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return "70vh";
    if (isFullHD) return "73vh";
    if (is3K) return "70vh";
    if (is2K) return "66vh";
    if (isLaptopL) return "70vh";
    if (isLaptop) return "70vh";
    if (isTab) return "66vh";
    return "70vh";
  };

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.NewsAdd)) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.NewsAdd)) {
      router.push("/");
    }
  }, [router]);

  return (
    <Box p={1}>
      <Box
        p={2}
        className="dubai-med primary-color"
        bgcolor={"#fff"}
        borderRadius={"4px"}
        fontSize={"18px"}
      >
        News
      </Box>
      <Grid container mt={1}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box p={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  Create News
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            sx={{
              width: "100%",
              height: getPageContentHeight(),
              overflowY: "scroll",
            }}
            p={5}
          >
            <CreateNewsForm />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateNews;
