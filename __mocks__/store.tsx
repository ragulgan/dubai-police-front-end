// __mocks__/store.ts
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

export const renderWithProviders = (
  ui: React.ReactElement,
  customState: any = {}
) => {
  const dummyReducer = (state = {}, action: any) => state;
  const mockInitialState = {
    loading: false,
    message: "",
    code: 0,
  };
  const athleteAddReducer = () => customState.athleteAdd || mockInitialState;
  const staffAddReducer = () => customState.staffAdd || mockInitialState;

  const nationalityReducer = () =>
    customState.listNationality || {
      data: [],
    };
  const academicFileUploadReducer = () =>
    customState.academicFileUpload || {
      code: 0,
      loading: false,
      message: "",
    };
  const addProgramReducer = () =>
    customState.addProgram || {
      loading: false,
      message: "",
      code: 0,
    };

  const singleFileUploadReducer = () =>
    customState.singleUpload || {
      loading: false,
      message: "",
      code: 0,
    };

  const addGoalsTargetsReducer = () =>
    customState.addGoalsTargets || {
      loading: false,
      message: "",
      code: 0,
    };
  const certificateFileUploadDeleteReducer = () =>
    customState.certificateFileUploadDelete || {
      code: 0,
      loading: false,
      message: "",
    };
  const getAthleteListReducer = () =>
    customState.getAthleteList || { data: [], loading: false };
  const staffListReducer = () =>
    customState.staffList || { data: [], loading: false };
  const getAthleteByIDReducer = () =>
    customState.getAthleteByID || {
      data: [],
      loading: false,
      message: "",
      code: 0,
    };
  const athleteUpdateByIDReducer = () =>
    customState.athleteUpdateByID || {
      code: 0,
      status: "",
      loading: false,
      message: "",
    };
  const getNationalityListReducer = () =>
    customState.getNationalityList || { data: [] };
  const coachingCertificationsReducer = () =>
    customState.coachingCertifications || {
      loading: false,
      data: [],
      error: null,
    };
  const addFoodReducer = () =>
    customState.addFood || {
      code: 0,
      message: "",
      loading: false,
    };
  const foodUploadReducer = () =>
    customState.foodUpload || {
      code: 0,
      message: "",
      loading: false,
    };
  const getPlanListReducer = () =>
    customState.getPlanList || { data: [], loading: false };
  const addResultReducer = () =>
    customState.addResult || {
      loading: false,
      code: 0,
      message: "",
    };

  const getSportListReducer = () =>
    customState.getSportList || {
      data: [],
      loading: false,
    };

  const resultReducer = () => ({
    trainingPerformanceResult: {
      loading: false,
      code: 0,
      message: "",
    },
  });
  const addNutritionReducer = () =>
    customState.addNutrition || { loading: false, code: 0, message: "" };
 const addRaceCalendarReducer = () =>
    customState.addRaceCalendar || { loading: false, code: 0, message: "" };
 const updateRaceCalendarReducer = () =>
    customState.updateRaceCalendar || { loading: false, code: 0, message: "" };
  const eventReducer= () =>
  customState.eventReducer || { data: [], loading: false };
  const meetingReducer= () =>
  customState.meetingReducer || { data: [], loading: false };
  const getNotificationModuleByIDReducer = () =>
    customState.getNotificationModuleByID || { data: {}, loading: false };
const editRewardsReducer = () =>
  customState.editRewards || { loading: false, message: "", code: 0 };
const RewardsEditReducer  = () =>
  customState.rewardsEdit || { loading: false, message: "", code: 0 };
const rewardsAddReducer = () =>
  customState.rewardsAdd || { loading: false, error: null, data: null };
const getRewardsTypeListReducer = () =>
  customState.getRewardsTypeList || { data: [], loading: false };
const rewardsUpdateReducer = () =>
  customState.rewardsUpdate || { loading: false, error: null, data: null };
const addTestAndMedicalChecksReducer = () =>
  customState.addTestAndMedicalChecks || {
    loading: false,
    data: null,
    error: null,
  };
  const uiReducer = () =>
  customState.ui || {
    isSettingUpdated: false, // or true depending on test needs
  };
  const rulesAddReducer = () =>
  customState.rulesAdd || { loading: false, message: "", code: 0 };
const rulesUpdateReducer = () =>
  customState.rulesUpdate || { loading: false, message: "", code: 0 };
  
  const store = configureStore({
    reducer: {
      athleteAdd: athleteAddReducer,
      staffAdd: staffAddReducer,
      listNationality: nationalityReducer,
      getNationalityList: getNationalityListReducer,
      login: dummyReducer,
      contactDetails: dummyReducer,
      addAcademicQualification: () =>
        customState.addAcademicQualification || mockInitialState,
      staffAndAthleteFile: () =>
        customState.staffAndAthleteFile || mockInitialState,
      deleteAcademicQualification: () =>
        customState.deleteAcademicQualification || mockInitialState,
      certificateFileUploadDelete: certificateFileUploadDeleteReducer,
      academicFileUpload: academicFileUploadReducer,
      deleteStaff: () => customState.deleteStaff || {},
      deleteAthlete: () => customState.deleteAthlete || {},
      addProgram: addProgramReducer,
      singleUpload: singleFileUploadReducer,
      addGoalsTargets: addGoalsTargetsReducer,
      getAthleteList: getAthleteListReducer,
      staffList: staffListReducer,
      getAthleteByID: getAthleteByIDReducer,
      athleteUpdateByID: athleteUpdateByIDReducer,
      coachingCertifications: coachingCertificationsReducer,
      addFood: addFoodReducer,
      foodUpload: foodUploadReducer,
      getPlanList: getPlanListReducer,
      addNutrition: addNutritionReducer,
      getNotificationModuleByID: getNotificationModuleByIDReducer,
      addResult: addResultReducer,
      getSportList: getSportListReducer,
      result: resultReducer,
      addRaceCalendar: addRaceCalendarReducer,
      updateRaceCalendar:updateRaceCalendarReducer,
      eventReducer:eventReducer,
      meetingReducer:meetingReducer,
      editRewards: editRewardsReducer,
       rewardsEdit: RewardsEditReducer ,
        rewardsAdd: rewardsAddReducer, 
         getRewardsTypeList: getRewardsTypeListReducer,
          addTestAndMedicalChecks: addTestAndMedicalChecksReducer, 
    rewardsUpdate: rewardsUpdateReducer,
      ui: uiReducer,
       rulesAdd: rulesAddReducer,
  rulesUpdate: rulesUpdateReducer,
      
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
};
