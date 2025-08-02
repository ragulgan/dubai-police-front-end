"use client";
import {
  Box,
  Grid,
  Skeleton,
  useMediaQuery,
  Grow,
  Typography,
  Avatar,
  Button,
  Alert,
  Tooltip,
} from "@mui/material";
import React from "react";
import moment from "moment";
import CalendarGrey from "../../../public/CalendarGrey.svg";
import SpeedometerOverWeight from "../../../public/speedometerOverWeight.svg";
import SpeedometerLowWeight from "../../../public/speedometerLowWeight.svg";
import SpeedometerNormalWeight from "../../../public/speedometerNormalWeight.svg";
import SpeedometerHeavyWeight from "../../../public/speedometerHeavyWeight.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  deleteNutritionById,
  clearDeleteState,
} from "@/redux/slices/nutrition/NutritionDeleteSlice";
import { listNutrition } from "@/redux/slices/nutrition/NutritionListSlice";
import { getLocalStorage } from "@/utils/helper";
import DeleteNutrition from "./deleteNutrition";
import PaginationComponent from "../PaginationComponent";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
interface CardViewProps {
  data: any; // Array of Profile objects
  isEdit?: any; // Function for editing a profile
  isLoading: boolean; // Loading state
  label?: any;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
}
const CardView: React.FC<CardViewProps> = ({
  data,
  isLoading,
  module,
  isEdit,
  setRowsPerPage,
  rowsPerPage,
  setPage,
  page,
}) => {
  const router = useRouter();
  const { pageView } = router.query;
  const { teamID } = router.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "59vh";
    if (isFullHD) return "63.5vh";
    if (is3K) return "59vh";
    if (is2K) return "54.5vh";
    if (isLaptopL) return "59vh";
    if (isLaptop) return "59vh";
    if (isTab) return "55vh";
    return "55vh";
  };

  const getCurrentSport = getLocalStorage("sport");
  const NutritionDelete = useSelector(
    (state: RootState) => state.deleteNutrition
  );

  return (
    <Box
      sx={
        module === "staff" || module === "nutrition-grid"
          ? null
          : {
              overflowY: "scroll",
              height: getPageContentHeight(),
            }
      }
    >
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item key={index}>
              <Box
                height={"145px"}
                width={"532px"}
                p={2}
                display={"flex"}
                alignItems={"center"}
                sx={{ border: "1px solid rgba(0, 135, 85, 0.3)" }}
                borderRadius={"10px"}
              >
                <Box width={"50%"}>
                  <Box display={"flex"}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton
                      variant="text"
                      width="80%"
                      sx={{ ml: 1, fontSize: "1rem" }}
                    />
                  </Box>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
                <Box
                  width={"25%"}
                  sx={{
                    placeItems: "center",
                    borderLeft: "1px solid rgba(0, 135, 85, 0.3)",
                    borderRight: "1px solid rgba(0, 135, 85, 0.3)",
                  }}
                >
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="text" width="60%" />
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
        ) : data && data.length ? (
          data.map((nutrition: any, index: any) => {
            return (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 500 + index * 200 } : {})}
                key={index}
              >
                <Grid item key={index}>
                  <Box
                    height={"145px"}
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
                      const route =
                        module === "nutrition-grid" &&
                        checkAccess(USER_PERMISSION.FitnessNutritionView)
                          ? `/fitness-and-nutrition/view/nutrition/${nutrition?.nutritionID}?sportID=${nutrition.sportID}&pageView=${pageView}`
                          : module !== "nutrition-grid" &&
                            checkAccess(USER_PERMISSION.NutritionPlanView)
                          ? `/teams/${teamID}/nutrition/view/${nutrition?.nutritionID}`
                          : "#";

                      router.push(route);
                    }}
                  >
                    <Box
                      width={
                        module === "nutrition-grid" ||
                        !(
                          checkAccess(USER_PERMISSION.NutritionPlanEdit) ||
                          checkAccess(USER_PERMISSION.NutritionPlanDelete)
                        )
                          ? "70%"
                          : "55%"
                      }
                    >
                      <Box display={"flex"} alignItems={"center"}>
                        <Avatar
                          alt={nutrition?.athlete}
                          src={nutrition?.athleteProfileImage}
                          sx={{ width: 32, height: 32 }}
                        />

                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#000000",
                            ml: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "180px",
                          }}
                          className="dubai-med text-capitalize"
                        >
                          {`${nutrition?.athleteFirstName}`}{" "}
                          {`${nutrition?.athleteMiddleName}`}{" "}
                          {`${nutrition?.athleteSurName}`}
                        </Typography>
                      </Box>
                      <Tooltip title={nutrition?.planName}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#000000",
                            mt: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "180px",
                          }}
                          className="bukra-semi-bold text-capitalize"
                        >
                          {nutrition?.planName}
                        </Typography>
                      </Tooltip>

                      <Box display={"flex"} alignItems={"center"} mt={1}>
                        <CalendarGrey width="15" height="15" />
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "200px",
                            ml: 0.5,
                          }}
                          className="dubai-regular text-capitalize"
                        >
                          {nutrition?.startDate} - {nutrition?.endDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      width={
                        module === "nutrition-grid" ||
                        !(
                          checkAccess(USER_PERMISSION.NutritionPlanEdit) ||
                          checkAccess(USER_PERMISSION.NutritionPlanDelete)
                        )
                          ? "30%"
                          : "25%"
                      }
                      sx={{
                        placeItems: "center",
                        borderLeft: "1px solid rgba(0, 135, 85, 0.3)",
                        ...(module !== "nutrition-grid" &&
                          (checkAccess(USER_PERMISSION.NutritionPlanEdit) ||
                            checkAccess(
                              USER_PERMISSION.NutritionPlanDelete
                            )) && {
                            borderRight: "1px solid rgba(0, 135, 85, 0.3)",
                          }),
                      }}
                      mx={1}
                    >
                      {Number(nutrition?.bmi < 18.5) ? (
                        <SpeedometerLowWeight width="96" height="68" />
                      ) : Number(
                          nutrition?.bmi >= 18.5 && nutrition?.bmi <= 25
                        ) ? (
                        <SpeedometerNormalWeight width="96" height="68" />
                      ) : Number(
                          nutrition?.bmi >= 25 && nutrition?.bmi <= 30
                        ) ? (
                        <SpeedometerOverWeight width="96" height="68" />
                      ) : Number(nutrition?.bmi >= 30) ? (
                        <SpeedometerHeavyWeight width="96" height="68" />
                      ) : (
                        <SpeedometerLowWeight width="96" height="68" />
                      )}
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#000000",
                          mt: -3,
                        }}
                        className="bukra-semi-bold"
                      >
                        {nutrition?.bmi || "--"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#58585B",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                        className="bukra-semi-bold text-capitalize"
                      >
                        BMI Value
                      </Typography>
                    </Box>
                    <Box
                      width={"20%"}
                      sx={{
                        display:
                          module === "nutrition-grid" ||
                          !(
                            checkAccess(USER_PERMISSION.NutritionPlanEdit) ||
                            checkAccess(USER_PERMISSION.NutritionPlanDelete)
                          )
                            ? "none"
                            : "flex",
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
                              isEdit(nutrition.nutritionID);
                            }}
                          >
                            <EditOutlinedIcon />
                          </Button>
                        </Tooltip>
                      ) : null}
                      {checkAccess(USER_PERMISSION.NutritionPlanDelete) ? (
                        <DeleteNutrition
                          data={nutrition}
                          dispatchDelete={deleteNutritionById}
                          deleteResponse={NutritionDelete}
                          clearDelete={clearDeleteState}
                          module={"nutritionID"}
                          dispatchList={listNutrition}
                          title={"Nutrition Plan"}
                          listUrl={"/GetNutritionList"}
                          getCurrentSport={getCurrentSport}
                          buttonIcon={"card"}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </Grid>
              </Grow>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default CardView;
