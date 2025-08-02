"use client";
import Box from "@mui/material/Box";
import SubMenuLayout from "./layout";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardListResults from "@/components/reports/list/RaceReportList";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearListState,
  viewResults,
} from "@/redux/slices/results/ResultListSlice";
import React from "react";
import { filterBySearchTerm } from "@/utils/helper";
import Alert from "@mui/material/Alert";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import SlideFullDrawer from "@/components/reports/SlideFullDrawer";
import { Skeleton } from "@mui/material";
import StrategyCompetitionInfo from "@/components/reports/Form/StrategyCompetitionInfo";
import BeforeStrategyCompetitionInfo from "@/components/reports/Form/BeforeReport/StrategyCompetitionInfo";
// import TrainingNutritionPlan from "@/components/trainingCamp/add/trainingNutritionPlan";
import TravelCost from "@/components/reports/Form/travelCost";
import BeforeTravelCost from "@/components/reports/Form/BeforeReport/travelCost";
import BenchmarkAcknowledgment from "@/components/reports/Form/benchmarkAcknowledgement";
import BeforeBenchmarkAcknowledgment from "@/components/reports/Form/BeforeReport/benchmarkAcknowledgement";
import CustomTab from "@/components/CustomTab";
import AthleteList from "@/components/reports/list/AthleteList";
import StaffList from "@/components/reports/list/StaffList";
import AthleteStaffDetails from "@/components/reports/Form/Athlete&StaffDetails";
import BeforeAthleteStaffDetails from "@/components/reports/Form/BeforeReport/Athlete&StaffDetails";
import BeforeTrainingAthleteStaffDetails from "@/components/reports/Form/BeforeTrainingCamp/Athlete&StaffDetails";
import UpdateOverallCompetitionReport from "@/components/reports/Form/UpdateOverallCompetitionReport";
import TrainingReportList from "@/components/reports/list/TrainingReportList";
import StrategyCampInfo from "@/components/reports/Form/StrategyCampInfo";
import TrainingNutritionPlan from "@/components/reports/Form/trainingNutritionPlan";
import BeforeTrainingNutritionPlan from "@/components/reports/Form/BeforeTrainingCamp/beforeTrainingNutritionPlan";
import BeforeTrainingTravelCost from "@/components/reports/Form/BeforeTrainingCamp/beforeTravelCost";
import BeforeBenchmarkAcknowledgement from "@/components/reports/Form/BeforeTrainingCamp/beforeBenchmarkAcknowledgement";
import UpdateOverallTrainingCamp from "@/components/reports/Form/UpdateOverallTrainingCamp";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { addReport, clearReportAddDataState, } from "@/redux/slices/reports/reportAddSlice";
import { clearAllReportUpdateState, clearReportUpdateState } from "@/redux/slices/reports/reportUpdateSlice";
import TrainingPlan from "@/components/reports/list/TrainingPlan";
import TestReport from "@/components/reports/list/TestReport";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";



type SelectedDataType = {
  planning?: {
    raceId?: number;
    campId?: number
    // add any other properties you need
  };
  // other fields...
};
const LoadingSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={100} />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
  </Box>
);
const AfterRaceReportSteps = [
  "Strategy & Competition Details",
  "Athlete & Staff Details",
  'Update Overall Competition Report',
  "Travel & Costs",
  "Benchmark & Acknowledgment",
];
const BeforeRaceReportSteps = [
  "Strategy & Competition Details",
  "Athlete & Staff Details",
  "Travel & Costs",
  "Benchmark & Acknowledgment",
];
const TrainingCamptSteps = [
  "Strategy & Camp Details",
  "Training & Nutrition Plan",
  'Update Overall Training Camp Report',
  "Travel & Costs",
  "Benchmark & Acknowledgment",
];
const BeforeTrainingCamptSteps = [
  "Strategy & Camp Details",
  "Training & Nutrition Plan",
  'Update Overall Training Camp Report',
  "Travel & Costs",
  "Benchmark & Acknowledgment",
];
function Page() {


  // Skeleton Loader Component


  // const StrategyCompetitionInfo = dynamic(() => import("@/components/reports/Form/StrategyCompetitionInfo"), { ssr: false,loading: () => <FieldSkeleton  /> });
  // const TrainingNutritionPlan = dynamic(() => import("@/components/trainingCamp/add/trainingNutritionPlan"), { ssr: false,loading: () => <LoadingSkeleton /> });
  // const TravelCost = dynamic(() => import("@/components/trainingCamp/add/travelCost"), { ssr: false,loading: () => <LoadingSkeleton /> });
  // const BenchmarkAcknowledgment = dynamic(() => import("@/components/trainingCamp/add/benchmarkAcknowledgement"), { ssr: false,loading: () => <LoadingSkeleton /> });
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/reports`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Reports",
      route: `/teams/${teamID}/reports`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Race Reports",
      route: `/teams/${teamID}/reports`,
      currentPage: true,
      disabled: false
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const getResultsList = useSelector((state: any) => {
    return state.getResultsList;
  });


  const [searchText, setSearchText] = useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openAfterReport, setOpenAfterReport] = useState(false);
  const [openBeforeReport, setOpenBeforeReport] = useState(false);
  console.log({ openAfterReport });
  const [allData, setAllData] = useState<any>({});
  const [isUpdated, setIsUpdated] = useState(false);


  const [isEditData, setisEditData] = useState(null);
  const [raceActiveStep, setRaceActiveStep] = useState(0);
  const [beforeRaceActiveStep, setBeforeRaceActiveStep] = useState(0);
  const [campActiveStep, setCampActiveStep] = useState(0);
  const [beforeCampActiveStep, setBeforeCampActiveStep] = useState(0);
  const [resetForm, setResetForm] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedData, setSelectedData] = useState<SelectedDataType>({});
  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );
  console.log({ selectedData }, '====================');
  console.log(typeof selectedData, 'tyyyyyyyyyyyyyy====================');




  useEffect(() => {
    if (teamID) {
      const payload = {
        sportID: Number(teamID),
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,

      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      dispatch(getAthleteListAPI(payload));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [teamID, page, rowsPerPage]);


  useEffect(() => {
    if (selectedData?.planning?.campId && openBeforeReport || isUpdated) {
      const payload = {
        sportID: Number(teamID),
        trainingCampID: Number((selectedData as SelectedDataType)?.planning?.campId),

      };
      dispatch(
        editTrainingCamp({ url: "/GetTrainingCampByID", payload: payload })

      );
      setIsUpdated(false)
    }
  }, [openBeforeReport, selectedData, isUpdated]);


  const filteredList = filterBySearchTerm(getResultsList.data, searchText, [
    "eventName",
  ]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setOpenAfterReport(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    console.log('issssssssssssss close');

    setOpenAfterReport(false);
    setOpenBeforeReport(false)
    dispatch(clearReportAddDataState())
    dispatch(clearAllReportUpdateState())
    // clearAllReportUpdateState();
    // clearReportAddState();
    dispatch(clearReportUpdateState())
    setSelectedData({})
    setRaceActiveStep(0)
    setCampActiveStep(0)
    setBeforeRaceActiveStep(0)
    setBeforeCampActiveStep(0)
  };

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <StrategyCompetitionInfo
            setActiveStep={setRaceActiveStep}
            // setAllData={setAllData}
            setDialogOpen={setOpenAfterReport}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            // reportID={Number(selectedData?.planning?.raceId)}
            data={selectedData}
          />
        );
      case 1:
        return (
          <AthleteStaffDetails
            setActiveStep={setRaceActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            data={selectedData}
          />
        );
      case 2:
        return (
          <UpdateOverallCompetitionReport
            setActiveStep={setRaceActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            data={selectedData}
          />
        );
      case 3:
        return (
          <TravelCost
            activeStep={raceActiveStep}
            setActiveStep={setRaceActiveStep}
            // setAllData={setAllData}
            resetForm={resetForm}
            setResetForm={setResetForm}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            selectedData={selectedData}
            module={'race'}
          />
        );
      case 4:
        return (
          <BenchmarkAcknowledgment
            activeStep={raceActiveStep}
            setActiveStep={setRaceActiveStep}
            // setAllData={setAllData}
            // setDisableRouting={setDisableRouting}
            // setRouteHandel={}
            resetForm={resetForm}
            setResetForm={setResetForm}
            payload={[]}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            setDialogOpen={setOpenAfterReport}
            selectedData={selectedData}
            module={'race'}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  const renderBeforeRaceStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <BeforeStrategyCompetitionInfo
            setActiveStep={setBeforeRaceActiveStep}
            // setAllData={setAllData}
            setDialogOpen={setOpenBeforeReport}
            resetForm={resetForm}
            setResetForm={setResetForm}
            // reportID={reportID}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            data={selectedData}
          />
        );
      case 1:
        return (
          <BeforeAthleteStaffDetails
            setActiveStep={setBeforeRaceActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            data={selectedData}
          />
        );
      case 2:
        return (
          <BeforeTravelCost
            activeStep={beforeRaceActiveStep}
            setActiveStep={setBeforeRaceActiveStep}
            // setAllData={setAllData}
            resetForm={resetForm}
            setResetForm={setResetForm}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            module={'race'}
          />
        );
      case 3:
        return (
          <BeforeBenchmarkAcknowledgment
            activeStep={beforeRaceActiveStep}
            setActiveStep={setBeforeRaceActiveStep}
            // setAllData={setAllData}
            // setDisableRouting={setDisableRouting}
            // setRouteHandel={}
            resetForm={resetForm}
            setResetForm={setResetForm}
            payload={[]}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.raceId)}
            setDialogOpen={setOpenBeforeReport}
            module={'race'}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  const renderBeforeTrainingCampStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <BeforeTrainingAthleteStaffDetails
            setActiveStep={setBeforeCampActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            setDialogOpen={setOpenBeforeReport}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            data={selectedData}
            setIsUpdated={setIsUpdated}
          />
        );
      case 1:
        return (
          // <BeforeAthleteStaffDetails
          //   setActiveStep={setBeforeRaceActiveStep}
          //   // setAllData={setAllData}
          //   // setDialogOpen={setDialogOpen}
          //   resetForm={resetForm}
          //   setResetForm={setResetForm}
          //   reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
          // />
          <BeforeTrainingNutritionPlan
            activeStep={beforeCampActiveStep}
            setActiveStep={setBeforeCampActiveStep}
            edit={true}
            setAllData={setAllData}
            trainingCampEditData={trainingCampEditData}
            setIsUpdated={setIsUpdated}
          // id={isEditData}
          // setAllData={setAllData}
          // setIsUpdated={setIsUpdated}
          />
        );
      case 2:
        return (
          <BeforeTrainingTravelCost
            activeStep={beforeCampActiveStep}
            edit={true}
            setActiveStep={setBeforeCampActiveStep}
            trainingCampEditData={trainingCampEditData}
            id={isEditData}
            setAllData={setAllData}
            setIsUpdated={setIsUpdated}
          />

        );
      case 3:
        return (
          <BeforeBenchmarkAcknowledgement
            activeStep={beforeCampActiveStep}
            setActiveStep={setBeforeCampActiveStep}
            edit={true}
            trainingCampEditData={trainingCampEditData}
            id={isEditData}
            setAllData={setAllData}
            setIsUpdated={setIsUpdated}
            onClose={() => setOpenBeforeReport(false)}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const trainingCampRenderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <StrategyCampInfo
            setActiveStep={setCampActiveStep}
            // setAllData={setAllData}
            setDialogOpen={setOpenAfterReport}
            resetForm={resetForm}
            setResetForm={setResetForm}
            // reportID={reportID}
            // reportID={selectedData?.planning?.campId}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            data={selectedData}
          />
        );
      case 1:
        return (
          <TrainingNutritionPlan
            activeStep={campActiveStep}
            setActiveStep={setCampActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            selectedData={selectedData}
          />
        );
      case 2:
        return (
          <UpdateOverallTrainingCamp
            activeStep={campActiveStep}
            setActiveStep={setCampActiveStep}
            // setAllData={setAllData}
            // setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            selectedData={selectedData}
          />
        );
      case 3:
        return (
          <TravelCost
            activeStep={campActiveStep}
            setActiveStep={setCampActiveStep}
            // setAllData={setAllData}
            resetForm={resetForm}
            setResetForm={setResetForm}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            selectedData={selectedData}
            module={'trainingCamp'}
          />
        );
      case 4:
        return (
          <BenchmarkAcknowledgment
            // activeStep={activeStep}
            setActiveStep={setCampActiveStep}
            // setAllData={setAllData}
            // setDisableRouting={setDisableRouting}
            // setRouteHandel={}
            resetForm={resetForm}
            setResetForm={setResetForm}
            payload={[]}
            trainingCampEditData={[]}
            reportID={Number((selectedData as SelectedDataType)?.planning?.campId)}
            setDialogOpen={setOpenAfterReport}
            selectedData={selectedData}
            module={'trainingCamp'}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };





  const RaceReports = () => {
    return (
      <CardListResults
        data={filteredList || []}
        // isLoading={getResultsList.loading}
        isEdit={handleEditData}
        setPage={setPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        submitFinalReport={() => setOpenAfterReport(true)}
        beforeReport={() => setOpenBeforeReport(true)}
        setSelectedData={setSelectedData}
        openBeforeReport={openBeforeReport}
      />
    )
  }
  const TrainingReports = () => {
    return (
      <TrainingReportList
        data={filteredList || []}
        isLoading={getResultsList.loading}
        isEdit={handleEditData}
        setPage={setPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        submitFinalReport={() => setOpenAfterReport(true)}
        beforeReport={() => setOpenBeforeReport(true)}
        setSelectedData={setSelectedData}
        openBeforeReport={openBeforeReport}
      />
    )
  }

  const ReportTabs = ({ tabValue }: { tabValue: number }) => {
    console.log({ tabValue });

    return (
      <>
        {tabValue === 0 && <RaceReports />}
        {tabValue === 1 && <TrainingReports />}
        {tabValue === 2 && <AthleteList />}
        {tabValue === 3 && <StaffList />}
        {tabValue === 4 && <TrainingPlan />}
        {tabValue > 4 && <TestReport />}
      </>
    );
  };
  return (
    <>

      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box
        className="bg-white" borderRadius={1} marginY={1}
        sx={{ borderColor: '#fff' }}
      >
        {/* <BasicBreadcrumbs routes={breadcrumbRoutes} /> */}
        <CustomTab
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        {/* <Box display={"flex"}  >
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            Reports
          </Typography>
        
          <ModuleSearchInput
            setSearchText={setSearchText}
            placeholder={"Search by Event Name, etc..."}
            // flexGrow={{ flexGrow: 0.25 }}
          />
          <AppAddButton
            label="Submit Final Report"
            onClick={() => setOpenAfterReport(true)}
          />
        </Box > */}

        {false && <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            {["Race Reports", "Training Camp Reports", "Athlete Reports", "Staff Reports", "Training Plans", "Test Reports"][tabValue] || "Report"}
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Camp Name, etc..."}
            flexGrow={{ flexGrow: 0.25 }}
          />

        </Box>}


        {getResultsList && getResultsList.code !== 500 ? (

          <Box p={2}>
            {/* {tabValue === 0 ? getResultsList && (
                <CardListResults
                  data={filteredList || []}
                  isLoading={getResultsList.loading}
                  isEdit={handleEditData}
                  setPage={setPage}
                  page={page}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                />
              )
            :
            <>Set D</>
            } */}

            {/* {reportComponents[tabValue] || <>Default</>} */}
            <Suspense fallback={<LoadingSkeleton />}>
              <ReportTabs tabValue={tabValue} />
            </Suspense>
          </Box>

        ) : getResultsList && getResultsList?.data?.length === 0 ? (
          <Box p={3}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Box>
        ) : (
          <Box p={3}>
            <Alert className="dubai-med" severity="error">
              Something went wrong
            </Alert>
          </Box>
        )
        }
        {(openAfterReport || openBeforeReport) && (
          <SlideFullDrawer
            open={openAfterReport || openBeforeReport}
            onClose={(event: any, reason: any) => handleClose(event, reason)}
            isEditData={[]}
            activeStep={tabValue === 0 ? openAfterReport ? raceActiveStep : openBeforeReport && beforeRaceActiveStep : openAfterReport ? campActiveStep : openBeforeReport && beforeCampActiveStep}
            setActiveStep={tabValue === 0 ? openAfterReport ? setRaceActiveStep : openBeforeReport && setBeforeRaceActiveStep : openAfterReport ? setCampActiveStep : openBeforeReport && setBeforeCampActiveStep}
            resetForm={resetForm}
            renderStepContent={tabValue === 0 ? openAfterReport ? renderStepContent : openBeforeReport && renderBeforeRaceStepContent : openAfterReport ? trainingCampRenderStepContent : openBeforeReport && renderBeforeTrainingCampStepContent}
            steps={tabValue === 0 ? openAfterReport ? AfterRaceReportSteps : openBeforeReport && BeforeRaceReportSteps : openAfterReport ? TrainingCamptSteps : openBeforeReport && BeforeTrainingCamptSteps}
            setResetForm={setResetForm}
            module={openAfterReport ? 'After' : 'Before'}
          />
        )}
      </Box >
    </>
  );
}

Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
