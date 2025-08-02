import { Alert, Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TeamsTable from "../tables/teamsTable";
import { getReportListAPI } from "@/redux/slices/reports/getAthleteListSlice";
// import { getReportListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import { filterBySearchTerm } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { isEmpty } from 'lodash';
import XlsSVG from "../../../../public/XlsSVG.svg";
import DropDown from '@/components/Fields/DropDown';
import { useForm } from 'react-hook-form';
import { viewStaff } from '@/redux/slices/staff/staffListSlice';
import { ContractType, disciplinePracticed, SortBy, testOptions, testStatusOptions } from '@/utils/constants';
import axios from 'axios';
import ModuleSearchInput from '@/components/search/ModuleSearchInput';
import TrainingPlanTableReport from '../tables/TrainingPlanTableReport';
import TestReportTable from '../tables/TestReportTable';

export default function TestReport() {
    const router = useRouter();
    const { teamID } = router.query;
    const [isEditData, setisEditData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch: AppDispatch = useDispatch();
    //  const getTrainingPlanList = useSelector((state: RootState) => state.staffList);
   const getTrainingPlanList = useSelector((state: any) => {
           console.log('ssssssssssssssssss',state.getReportAthlete);
           
           return state.getReportAthlete;
       });
       console.log({getTrainingPlanList});
       
    const { handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            type:'',
            status:''
        },
    });
    const testType = watch("type"); 
    const testStatus = watch("status"); 
    const filteredTrainingList = filterBySearchTerm(getTrainingPlanList.data, searchText, [
        "trainingPlan",
        "trainingStartDate",
    ]);
    const tableHeaders = [
        "Name",
        "Test Type",
        "Last Test Status",
        "Last Test Date",
        "Actions",
      ];
    // useEffect(() => {
    //     const payload = {
    //         searchText: "",
    //         filteredBy: "",
    //         paginationIndex: 1,
    //         paginationCount: 10,
    //         sportID: Number(teamID),
    //     };
    // //    dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    // console.log('in staffff');
    // dispatch(getReportListAPI({ url: `/Reports/${teamID}/medical_test`}));
    // // dispatch(getReportListAPI({ url: `/Reports/${teamID}/medical_test`}));
    // }, [])
    useEffect(() => {
// if(page !== 1 )
    dispatch(getReportListAPI({ url: `/Reports/${teamID}/medical_test?q=${searchText}&type=${testType}&status=${testStatus}&page=${page}&perpage=${rowsPerPage}`}));
    // dispatch(getReportListAPI({ url: `/Reports/${teamID}/training_plan`}));
    }, [page,rowsPerPage,testType,testStatus,searchText])


    const handleAthleteEditData = (isEdit: any) => {
        setisEditData(isEdit);
        //   setIsOpen(isEdit);
    };
    const downloadStaffExcel = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_BASE_URL}/Reports/${teamID}/medical_test/export?q=${searchText}&type=${testType}&status=${testStatus}`,
            {
              responseType: "blob",
            }
          );
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "medical_test.xlsx");
          document.body.appendChild(link);
          link.click();
          if (link.parentNode) link.parentNode.removeChild(link);
        } catch (error) {
          console.error(
            "An error occurred while downloading the Excel file:",
            error
          );
        }
      };

    return (
<>
<Box display={"flex"} marginBottom={2} marginTop={-2} marginLeft={-2}
            width={'100%'}
            // alignItems={'center'}
            justifyContent={'center'}
            >
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 ,alignSelf:'flex-start'}}
            paddingY={2}
            paddingX={2}
            className="table-list-header bukra-semi-bold header-border-right"
          >
            {"Test Reports"}
          </Typography>
   
          <Typography
            p={1}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 ,marginLeft:0}}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
         
          <ModuleSearchInput
            setSearchText={setSearchText}
            placeholder={"Search by Test Report Name, etc..."}
            flexGrow={{ flexGrow: 0.20,marginRight:'-32px' }}
            
          />
  
        </Box>
        <Box
            sx={
                {
                    overflowY: "auto",
                    height: {
                        sm: "63vh",
                        lg: "75vh",
                        //   xl: is3K ? "70vh" : is2K ? "70vh" : "70vh",
                    },
                }
            }
        >          

            <Grid container alignItems="center" spacing={2} justifyContent={'center'}
                marginBottom={2}
                gap={1}
            >
                {/* Left: DropDowns (Can have 3-5 items) */}
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item>
                            <DropDown
                                name="type"
                                options={testOptions}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000',
                                    minWidth:'200px'
                                }}
                                placeholder={'Type'}
                                // disabled={true}
                            />
                        </Grid>
                        <Grid item>
                            <DropDown
                                name="status"
                                options={testStatusOptions}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Status'}
                                // disabled={true}
                            />

                        </Grid>
                        {/* <Grid item>
                            <DropDown
                                name="contractType"
                                options={ContractType}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Contract Type'}
                                disabled={true}
                            />

                        </Grid>
                        <Grid item>
                            <DropDown
                                name="sortBy"
                                options={SortBy}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Sort By'}
                                disabled={true}
                            />

                        </Grid> */}
                        {/* Add more dropdowns here as needed */}
                    </Grid>
                </Grid>

                {/* Right: Export Button (Always at the end) */}
                <Grid item>
                    <Button
                        variant="outlined"
                        className="text-capitalize dubai-med export-button"
                        sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
                        startIcon={<XlsSVG width="25px" height="25px" />}
                    onClick={downloadStaffExcel}
                    >
                        Export to Excel
                    </Button>
                </Grid>
            </Grid>


  {getTrainingPlanList &&
        !getTrainingPlanList.loading &&
        getTrainingPlanList.code !== 500 &&
        filteredTrainingList.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No Test records found .
          </Alert>
        ) : 


          !isEmpty(getTrainingPlanList.data)  && <TestReportTable
                data={filteredTrainingList}
                isEdit={handleAthleteEditData}
                module="staff"
                isLoading={getTrainingPlanList.loading}
                setPage={setPage}
                page={page}
                setRowsPerPage={setRowsPerPage}
                rowsPerPage={rowsPerPage}
              
                isDisable={
                    getTrainingPlanList.data.totalRecords < 10 ||
                    isEmpty(getTrainingPlanList.data) ||
                    searchText !== "" ||
                    filteredTrainingList.length !== 0
                }
                dataList={getTrainingPlanList}
                headers={tableHeaders}
                isHide={true}
            />}
        </Box>
</>
    )
}
