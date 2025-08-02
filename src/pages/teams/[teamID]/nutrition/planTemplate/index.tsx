"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Alert, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { filterBySearchTerm } from "@/utils/helper";
import CardView from "@/components/nutrition/templateCard";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import {
  clearPlanTemplateState,
  listPlanTemplate,
} from "@/redux/slices/nutrition/PlanTemplateListSlice";
import _ from "lodash";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import AppAddButton from "@/components/buttons/AppAddButton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Nutrition",
      route: `/teams/${teamID}/nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Plan Template",
      route: `/teams/${teamID}/nutrition`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const label: any = ["Age", "Role in Team"];
  const [searchText, setSearchText] = useState("");
  const getPlanTemplate = useSelector((state: any) => {
    return state.listPlanTemplate;
  });

  useEffect(() => {
    if (teamID) {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),

      };
      dispatch(listPlanTemplate({ url: "/GetNutritionPlanList", payload }));
    }
    return () => {
      dispatch(clearPlanTemplateState());
    };
  }, [teamID]);

  const filteredList = filterBySearchTerm(getPlanTemplate.data, searchText, [
    "nutritionPlanName",
  ]);

  return (
    <>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",

            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => {
            router.back();
          }}
        />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            Plan Template
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {!isEmpty(getPlanTemplate?.data) && searchText === ""
              ? getPlanTemplate?.data?.length
              : !isEmpty(filteredList) && filteredList.length}{" "}
            Plan Templates
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Name, Plan, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {checkAccess(USER_PERMISSION.NutritionPlanAdd) ? <AppAddButton
            label="Create Plan Template"
            onClick={() =>
              router.push(`/teams/${teamID}/nutrition/createNutrition`)
            }
          /> : null}
        </Box>
        {!_.isEmpty(getPlanTemplate) ? (
          getPlanTemplate?.code !== 500 ? (
            <Box p={2}>
              <CardView
                data={filteredList || []}
                isLoading={getPlanTemplate.loading}
                label={label}
                module="athlete"
              />
            </Box>
          ) : (
            getPlanTemplate?.data?.length === 0 && (
              <Alert className="dubai-med" severity="info">
                No record(s) found
              </Alert>
            )
          )
        ) : (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        )}
      </Box>
    </>
  );
};
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
