import { Alert, Box, Fade, Grid, Skeleton, Typography } from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import XlsSVG from "../../../public/XlsSVG.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NutritionCard from "../widgets/NutritionCard";
import ReactSelect from "../Fields/ReactSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getNutritionPlanDetailById } from "@/redux/slices/nutrition/NutritionPlanDetailsByIdSlice";
import _, { isEmpty } from "lodash";
import moment from "moment";
import { editPlanTemplate } from "@/redux/slices/nutrition/PlanTemplateEditSlice";
import axios from "axios";
import { getAthleteID } from "@/redux/slices/athlete/getAthleteIDSlice";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";

interface SuggestedNutritionProps {
  sportID?: number;
  athleteID?: number;
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const SuggestedNutrition: React.FC<SuggestedNutritionProps> = ({
  sportID,
  athleteID,
  label,
  expanded,
  onClick,
}) => {
  const sectionContainerStyle = {
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    padding: 1,
    borderRadius: "8px",
    borderBottomLeftRadius: expanded ? "8px" : "8px",
    borderBottomRightRadius: expanded ? "8px" : "8px",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const topBarButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const [NutritionOption, setNutritionOption] = useState<any>([]);
  const [selectedNutritionOption, setSelectedNutritionOption] =
    useState<any>(null);
  const router = useRouter();
  const { teamID } = router.query;
  const dispatch: AppDispatch = useDispatch();

  const getNutritionPlanDetail = useSelector((state: RootState) => {
    return state &&
      state.getNutritionPlanDetail &&
      !isEmpty(state?.getNutritionPlanDetail?.data) &&
      !isEmpty(state?.getNutritionPlanDetail?.data[0])
      ? state.getNutritionPlanDetail.data
      : null;
  });

  const NutritionTemplateEdit = useSelector(
    (state: RootState) => state.editPlanTemplate
  );

  const athleteData = useSelector((state: RootState) => {
    return state &&
      state.getAthleteByID &&
      !isEmpty(state?.getAthleteByID?.data) &&
      !isEmpty(state?.getAthleteByID?.data[0])
      ? state.getAthleteByID.data[0]
      : null;
  });

  useEffect(() => {
    if (athleteID) {
      const payload: any = {
        athleteID: Number(athleteID),
        sportID: Number(teamID),
      };
      dispatch(getAthleteID(payload));
    }
  }, [athleteID]);

  useEffect(() => {
    const payload: any = {
      sportID: teamID,
      athleteID: athleteID,

    };
    dispatch(getNutritionPlanDetailById(payload));
  }, [athleteID, teamID, dispatch]);

  useEffect(() => {
    if (
      getNutritionPlanDetail &&
      Array.isArray(getNutritionPlanDetail) &&
      getNutritionPlanDetail.length > 0
    ) {
      const sortedPlans = [...getNutritionPlanDetail].sort((a, b) =>
        moment(a.startDate, "DD/MM/YYYY").diff(
          moment(b.startDate, "DD/MM/YYYY")
        )
      );

      const options = sortedPlans.map((plan) => {
        const truncatedName =
          plan.nutritionPlanName.length > 15
            ? plan.nutritionPlanName.slice(0, 15) + "..."
            : plan.nutritionPlanName;

        return {
          value: plan.nutritionPlanID,
          label: `${truncatedName} ( ${plan.startDate} - ${plan.endDate})`,
          athlete: plan.athleteID,
          startDate: plan.startDate,
          endDate: plan.endDate,
        };
      });

      setNutritionOption(options);
      setSelectedNutritionOption(options[0] || null);
    } else {
      setNutritionOption([]);
      setSelectedNutritionOption(null);
    }
  }, [getNutritionPlanDetail]);

  useEffect(() => {
    if (selectedNutritionOption) {
      const payload: any = {
        nutritionPlanID: selectedNutritionOption?.value,
        sportID: Number(teamID),

      };
      dispatch(editPlanTemplate(payload));
    }
  }, [selectedNutritionOption, dispatch]);

  const handleChangeNutritionPlan = (selectedOption: any | null): void => {
    setSelectedNutritionOption(selectedOption);
    const payload: any = {
      nutritionPlanID: selectedOption?.value,
      sportID: Number(teamID),

    };
    dispatch(editPlanTemplate(payload));
  };

  const exportNutritionPlan = async () => {
    const startDate = moment(
      selectedNutritionOption?.startDate,
      "DD/MM/YYYY"
    ).format("DD-MM-YYYY");
    const endDate = moment(
      selectedNutritionOption?.endDate,
      "DD/MM/YYYY"
    ).format("DD-MM-YYYY");
    const response = await axiosCallBlob.post(
      `${process.env.API_BASE_URL}/Sports/ExportNutritionMenuList`,
      {
        nutritionPlanID: selectedNutritionOption?.value,
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${athleteData.firstName}_${athleteData.middleName}_${startDate}_${endDate}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    if (link.parentNode) link.parentNode.removeChild(link);
  };

  return (
    <Box sx={sectionContainerStyle}>
      <Box sx={topBarStyle} onClick={onClick}>
        <Typography
          variant="subtitle1"
          className="bukra-semi-bold"
          sx={{
            padding: 1,
            fontSize: 18,
            color: "#008755",
          }}
        >
          {label}
        </Typography>
        <Box sx={topBarButtonContainerStyle}>
          <CustomButton
            sx={{
              marginRight: 2,
              backgroundColor: "#0087551A",
              borderRadius: "6px",
              fontWeight: 500,
              height: "29px",
            }}
            label="Export to Excel"
            variant="outlined"
            size="small"
            ButtonIcon={XlsSVG}
            iconPosition="start"
            disabled={
              !getNutritionPlanDetail || getNutritionPlanDetail.length === 0
            }
            onClick={(e: any) => {
              e.stopPropagation();
              exportNutritionPlan();
            }}
          />
          <Box onClick={(e) => e.stopPropagation()}>
            <ReactSelect
              name="nutritionplan"
              id="nutritionplan"
              className="select2"
              classNamePrefix="select"
              handleChangeReactSelect={handleChangeNutritionPlan}
              options={NutritionOption}
              value={selectedNutritionOption}
              isDisabled={NutritionOption.length === 0}
              isClearable={true}
            />
          </Box>
          {/* <CustomButton sx={{ marginRight: 2 }} label='Update' variant="contained" size='small' ButtonIcon={SettingsSVG} iconPosition="start" onClick={(e: any) => { e.stopPropagation() }} /> */}
          {expanded && (
            <span onClick={onClick}>
              <ExpandMoreIcon sx={{ cursor: "pointer" }} />
            </span>
          )}
        </Box>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Box sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            {getNutritionPlanDetail?.loading ||
              NutritionTemplateEdit?.loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Skeleton variant="rectangular" width="100%" height={150} />
                    <Skeleton animation="wave" sx={{ mt: 1 }} width="60%" />
                  </Box>
                </Grid>
              ))
            ) : getNutritionPlanDetail?.length > 0 &&
              NutritionTemplateEdit?.data?.menuPlanList?.length > 0 ? (
              <>
                {["BreakFast", "Lunch", "Dinner"].map((mealType, index) => {
                  const items =
                    NutritionTemplateEdit?.data?.menuPlanList?.filter(
                      (item: any) => item.nutritionMenuPlanSection === mealType
                    );

                  return items.length > 0 ? (
                    <Grid item xs={12} md={4} key={index}>
                      <NutritionCard
                        title={mealType}
                        time={
                          mealType === "BreakFast"
                            ? "07:00 am"
                            : mealType === "Lunch"
                              ? "12:00 pm"
                              : "07:00 pm"
                        }
                        items={items}
                      />
                    </Grid>
                  ) : null;
                })}
              </>
            ) : (
              <Grid item xs={12}>
                <Alert className="dubai-med" severity="info">
                  No record(s) found
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SuggestedNutrition;
