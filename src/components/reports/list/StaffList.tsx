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
import { ContractType, disciplinePracticed, SortBy } from '@/utils/constants';
import axios from 'axios';
import ModuleSearchInput from '@/components/search/ModuleSearchInput';

export default function StaffList() {
    const router = useRouter();
    const { teamID } = router.query;
    const [isEditData, setisEditData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    console.log({rowsPerPage,page},'pagination');
    
    const dispatch: AppDispatch = useDispatch();
    //  const getStaffList = useSelector((state: RootState) => state.staffList);
   const getStaffList = useSelector((state: any) => {
           console.log('ssssssssssssssssss',state.getReportAthlete);
           
           return state.getReportAthlete;
       });
       const rolesListData = useSelector((state: RootState) => state.rolesList);
       const rolesOptions = [
        { value: "", label: "Select" },
        ...(
          !isEmpty(rolesListData) && rolesListData?.data
            ?.filter((role: any) => role.moduleName === "Staff")
            .map((role: any) => ({
              label: role.roleName,
              value: role.roleID,
            })) || []
        )
      ];
            
    const { handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            // disciplinePraticed: "",
            // department: '',
            contractType: '',
            role: '',
            // sortBy: ''
        },
    });
    const contractType = watch('contractType')
    const roleValue = watch('role')

    const filteredAthleteList = filterBySearchTerm(getStaffList.data, searchText, [
        "firstName",
        "middleName",
        'surname',
        "performanceLevel",
        "personalEmail",
        "role",
        "rank",
    ]);
    const tableHeaders = [
        "Name",
        "Role",
        "Email",
        "Contract Start Date",
        "Contract End Date",
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
    //    dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    console.log('in staffff');
    
    dispatch(getReportListAPI({ url: `/Reports/${teamID}/Staff?type=${contractType}&role=${roleValue}&page=${page}&perpage=${rowsPerPage}`}));
    // dispatch(getReportListAPI({ url: `/Reports/${teamID}/Staff`}));
    }, [page,rowsPerPage,contractType,roleValue])


    const handleAthleteEditData = (isEdit: any) => {
        setisEditData(isEdit);
        //   setIsOpen(isEdit);
    };
    const downloadStaffExcel = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_BASE_URL}/Reports/${teamID}/staff/export?q=${searchText}&type=${contractType}&role=${roleValue}`,
            {
              responseType: "blob",
            }
          );
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ReportStaffList.xlsx");
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

    //   useEffect(()=>{
    //     dispatch(getReportListAPI({ url: `/Reports/${teamID}/Staff?page=${page}&perpage=${rowsPerPage}`}));
    //   },[page,rowsPerPage])

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
            {"Staff Reports"}
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
            placeholder={"Search by Staff Name, etc..."}
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
                                name="role"
                                options={rolesOptions}
                                control={control}
                                sx={{
                                    backgroundColor: '#F1F9FF !important',
                                    color: '#000'
                                }}
                                placeholder={'Role'}
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


 {getStaffList &&
        !getStaffList.loading &&
        getStaffList.code !== 500 &&
        filteredAthleteList.length === 0 ? (
          <Alert className="dubai-med" severity="info">
            No Staff records found .
          </Alert>
        ) :


          !isEmpty(getStaffList.data)  && <TeamsTable
                data={filteredAthleteList}
                isEdit={handleAthleteEditData}
                module="staff"
                isLoading={getStaffList.loading}
                setPage={setPage}
                page={page}
                setRowsPerPage={setRowsPerPage}
                rowsPerPage={rowsPerPage}
                dataList={getStaffList}
                headers={tableHeaders}
                isHide={true}
                isDisable={false}
                
            />}
        </Box>
</>
    )
}
