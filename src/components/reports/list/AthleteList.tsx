import { Alert, Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TeamsTable from "../tables/teamsTable";
// import TeamsTable from "@/components/tables/teamsTable";
import { getReportListAPI } from "@/redux/slices/reports/getAthleteListSlice";
import { filterBySearchTerm } from '@/utils/helper';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { isEmpty } from 'lodash';
import XlsSVG from "../../../../public/XlsSVG.svg";
import DropDown from '@/components/Fields/DropDown';
import { useForm } from 'react-hook-form';
import { ContractType, disciplinePracticed, levelOptions, SortBy } from '@/utils/constants';
import axios from 'axios';
import ModuleSearchInput from '@/components/search/ModuleSearchInput';

export default function AthleteList() {
    const router = useRouter();
    const { teamID } = router.query;
    const [isEditData, setisEditData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch: AppDispatch = useDispatch();
    const getAthleteList = useSelector((state: any) => {
        console.log({state});
        
        return state.getReportAthlete;
    });
    console.log({getAthleteList});


                
    
    const { handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            level: '',
            contractType: '',
        
        },
    });
    const contractType = watch('contractType')
    const levelValue = watch('level')

    const filteredAthleteList = filterBySearchTerm(getAthleteList.data, searchText, [
        "firstName",
        "middleName",
        "performanceLevel",
        "personalEmail",
        "role",
        "rank",
    ]);
    const tableHeaders = [
        "Name",
        "Date of Birth",
        "Email",
        "Performance Level",
        "Actions",
    ];
    useEffect(() => {
        const payload = {
            searchText: "",
            filteredBy: "",
            paginationIndex: 1,
            paginationCount: 10,
            sportID: Number(teamID),
        };
        // https://dev-dpsm.isportz.co/api/Reports/1/Staff
        // dispatch(updateReport({ url: `/Reports/${teamID}/Race/${reportID}/${getRaceID}/AthleteStaff`, payload: data }));
        // dispatch(getReportListAPI({ url: `/Reports/${teamID}/Staff?page=${page}&perpage=${rowsPerPage}`}));
        dispatch(getReportListAPI({ url: `/Reports/${teamID}/athlete?type=${contractType}&level=${levelValue}&page=${page}&perpage=${rowsPerPage}`}));
        // dispatch(getReportListAPI(payload));
    }, [page,rowsPerPage,contractType,levelValue])


  const handleAthleteEditData = (isEdit: any) => {
    setisEditData(isEdit);
    //   setIsOpen(isEdit);
  };

    const downloadAthletesExcel = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_BASE_URL}/Reports/${teamID}/athlete/export?q=${searchText}&type=${contractType}&level=${levelValue}`,
   
            {
              responseType: "blob",
            }
          );
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ReportAthletesList.xlsx");
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
            {"Athlete Reports"}
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
            placeholder={"Search by Athlete Name, etc..."}
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
          <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item>
                            <DropDown
                                name="level"
                                options={levelOptions}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Performance Level'}
                                // disabled={true}
                            />
                        </Grid>

                        <Grid item>
                            <DropDown
                                name="contractType"
                                options={ContractType}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Contract Type'}
                                // disabled={true}
                            />

                        </Grid>

                        {/* Add more dropdowns here as needed */}
                    </Grid>
                </Grid>

                {/* Right: Export Button (Always at the end) */}
       
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
                    onClick={downloadAthletesExcel}
                    >
                        Export to Excel
                    </Button>
                </Grid>
            </Grid>



{getAthleteList &&
        !getAthleteList.loading &&
        getAthleteList.code !== 500 &&
        filteredAthleteList.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No Test records found .
          </Alert>
        ) : 
!isEmpty(getAthleteList.data)  && 
            <TeamsTable
                data={filteredAthleteList || []}
                // isEdit={handleAthleteEditData}
                module="athlete"
                isLoading={getAthleteList.loading}
                setPage={setPage}
                page={page}
                setRowsPerPage={setRowsPerPage}
                rowsPerPage={rowsPerPage}
                isDisable={
                    getAthleteList.totalRecords < 10 ||
                    isEmpty(getAthleteList.data) ||
                    searchText !== "" ||
                    getAthleteList.totalRecords !== 0
                }
                dataList={getAthleteList}
                headers={tableHeaders}
                isHide={true}
            />
            }
        </Box>
</>
    )
}
