"use client";
import {
  Box,
  Grid,
  Skeleton,
  useMediaQuery,
  Grow,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import _ from "lodash";
import { useRouter } from "next/router";
import DeleteDialog from "../dialogs/DeleteDialog";
import {
  clearDeleteState,
  deletePlanTemplateById,
} from "@/redux/slices/nutrition/PlanTemplateDeleteSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { listPlanTemplate } from "@/redux/slices/nutrition/PlanTemplateListSlice";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface CardViewProps {
  data: any;
  isLoading: boolean;
  label?: any;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
}

const TemplateCardView: React.FC<CardViewProps> = ({
  data,
  isLoading,
  module,
}) => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "68vh";
    if (isFullHD) return "69vh";
    if (is3K) return "68vh";
    if (is2K) return "62vh";
    if (isLaptopL) return "68vh";
    if (isLaptop) return "68vh";
    if (isTab) return "64vh";
    return "64vh";
  };
  const router = useRouter();
  const { teamID } = router.query;
  const deletePlanTemplate = useSelector(
    (state: RootState) => state.deletePlanTemplate
  );
  return (
    <Box
      sx={
        module === "staff"
          ? null
          : {
              overflowY: "scroll",
              height: getPageContentHeight(),
            }
      }
    >
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid item key={index}>
                <Box
                  height={"123px"}
                  width={"532px"}
                  p={2}
                  display={"flex"}
                  alignItems={"center"}
                  sx={{ border: "1px solid rgba(0, 135, 85, 0.3)" }}
                  borderRadius={"10px"}
                >
                  <Box width={"75%"}>
                    <Skeleton variant="text" width="60%" />
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Skeleton variant="rectangular" width={84} height={59} />
                      <Skeleton variant="rectangular" width={84} height={59} />
                      <Skeleton variant="rectangular" width={84} height={59} />
                      <Skeleton variant="rectangular" width={84} height={59} />
                    </Box>
                  </Box>
                  <Box
                    width={"25%"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignContent: "center",
                    }}
                  >
                    <Skeleton variant="rectangular" width={32} height={32} />
                    <Skeleton variant="rectangular" width={32} height={32} />
                  </Box>
                </Box>
              </Grid>
            ))
          : data &&
            data.length &&
            data.map((profile: any, index: any) => {
              return (
                <Grow
                  in={true}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(true ? { timeout: 500 + index * 200 } : {})}
                  key={index}
                >
                  <Grid item key={index}>
                    <Box
                      height={"123px"}
                      width={"532px"}
                      p={2}
                      display={"flex"}
                      alignItems={"center"}
                      sx={{
                        border: "1px solid rgba(0, 135, 85, 0.3)",
                        cursor: "pointer",
                      }}
                      borderRadius={"10px"}
                      onClick={() => {
                        checkAccess(USER_PERMISSION.NutritionPlanView)
                          ? router.push(
                              `/teams/${teamID}/nutrition/planTemplate/view?id=${profile?.nutritionPlanID}`
                            )
                          : "#";
                      }}
                    >
                      <Box
                        width={"78%"}
                        px={1}
                        borderRight={
                          checkAccess(USER_PERMISSION.NutritionPlanEdit) ||
                          checkAccess(USER_PERMISSION.NutritionPlanDelete)
                            ? "1px solid rgba(0, 135, 85, 0.3)"
                            : "none"
                        }
                      >
                        {profile && !_.isEmpty(profile?.nutritionPlanName) ? (
                          <Tooltip title={profile?.nutritionPlanName}>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                color: "#000000",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "180px",
                              }}
                              className="bukra-semi-bold text-capitalize"
                            >
                              {profile?.nutritionPlanName}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <>&nbsp;</>
                        )}
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          mt={1}
                          gap={1}
                        >
                          <Box
                            width={"84px"}
                            height={"59px"}
                            bgcolor={"#E88F00"}
                            borderRadius={"4px"}
                            display={"grid"}
                            alignContent={"center"}
                            textAlign={"center"}
                            sx={{ placeContent: "center" }}
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{ color: "#ffffff" }}
                            >
                              {profile?.menuPlanList
                                ?.map((item: any) => Number(item?.calories))
                                ?.reduce(
                                  (sum: number, current: number) =>
                                    sum + (current || 0),
                                  0
                                )
                                ?.toFixed(2)}
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{ color: "#ffffff", fontWeight: 400 }}
                            >
                              Calories
                            </Typography>
                          </Box>
                          <Box
                            width={"84px"}
                            height={"59px"}
                            bgcolor={"#00205B"}
                            borderRadius={"4px"}
                            display={"grid"}
                            alignContent={"center"}
                            textAlign={"center"}
                            sx={{ placeContent: "center" }}
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{ color: "#ffffff" }}
                            >
                              {profile?.menuPlanList
                                ?.map((item: any) => Number(item?.proteins))
                                ?.reduce(
                                  (sum: number, current: number) =>
                                    sum + (current || 0),
                                  0
                                )
                                ?.toFixed(2)}
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{ color: "#ffffff", fontWeight: 400 }}
                            >
                              Proteins
                            </Typography>
                          </Box>
                          <Box
                            width={"84px"}
                            height={"59px"}
                            bgcolor={"#008755"}
                            borderRadius={"4px"}
                            display={"grid"}
                            alignContent={"center"}
                            textAlign={"center"}
                            sx={{ placeContent: "center" }}
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{ color: "#ffffff" }}
                            >
                              {profile?.menuPlanList
                                ?.map((item: any) => Number(item?.carbs))
                                ?.reduce(
                                  (sum: number, current: number) =>
                                    sum + (current || 0),
                                  0
                                )
                                ?.toFixed(2)}
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{ color: "#ffffff", fontWeight: 400 }}
                            >
                              Carbs
                            </Typography>
                          </Box>
                          <Box
                            width={"84px"}
                            height={"59px"}
                            bgcolor={"#E4002B"}
                            borderRadius={"4px"}
                            display={"grid"}
                            alignContent={"center"}
                            textAlign={"center"}
                            sx={{ placeContent: "center" }}
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{ color: "#ffffff" }}
                            >
                              {profile?.menuPlanList
                                ?.map((item: any) => Number(item?.fats))
                                ?.reduce(
                                  (sum: number, current: number) =>
                                    sum + (current || 0),
                                  0
                                )
                                ?.toFixed(2)}
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{ color: "#ffffff", fontWeight: 400 }}
                            >
                              Fats
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        width={"22%"}
                        sx={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent:
                            checkAccess(USER_PERMISSION.NutritionPlanEdit) &&
                            checkAccess(USER_PERMISSION.NutritionPlanDelete)
                              ? "end"
                              : "center",
                        }}
                        gap={1}
                      >
                        {checkAccess(USER_PERMISSION.NutritionPlanEdit) ? (
                          <Tooltip title={"Edit"}>
                            <Button
                              variant="outlined"
                              sx={{
                                minWidth: "0",
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/teams/${teamID}/nutrition/createNutrition?id=${profile?.nutritionPlanID}`
                                );
                              }}
                            >
                              <EditOutlinedIcon />
                            </Button>
                          </Tooltip>
                        ) : null}
                        {checkAccess(USER_PERMISSION.NutritionPlanDelete) ? (
                          <DeleteDialog
                            data={profile}
                            dispatchDelete={deletePlanTemplateById}
                            deleteResponse={deletePlanTemplate}
                            clearDelete={clearDeleteState}
                            module={"nutritionPlanID"}
                            dispatchList={listPlanTemplate}
                            title={"Plan Template"}
                            listUrl={"/GetNutritionPlanList"}
                            getCurrentSport={teamID}
                          />
                        ) : null}
                      </Box>
                    </Box>
                  </Grid>
                </Grow>
              );
            })}
      </Grid>
    </Box>
  );
};

export default TemplateCardView;
