"use client";
import React, { useEffect } from "react";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import _ from "lodash";
import CreateRulesForm from "@/components/rules/create/createRules";
import { checkAccess } from "@/utils/acessscheck";
import { useRouter } from "next/router";
import { USER_PERMISSION } from "@/utils/constants";

const CreateRules = () => {
  const router = useRouter();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

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
    if (!checkAccess(USER_PERMISSION.RulesAgreementsAdd)) {
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
        Rules & Agreements
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
                  Create Rules & Agreements
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
            <CreateRulesForm />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateRules;
