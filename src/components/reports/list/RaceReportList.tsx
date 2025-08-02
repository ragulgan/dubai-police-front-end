"use client";
import {
  Box,
  Grid,
  Skeleton,
  useMediaQuery,
  Grow,
  Typography,
  Avatar,
  Alert,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Location from '../../../../public/Location.svg';
// import Location from "../../../public/Location.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditIcon from "../../../../public/EditSVG.svg";
import CalendarGrey from "../../../../public/calendarResult.svg";
import { usePathname } from "next/navigation";
import { filterBySearchTerm, getLocalStorage } from "@/utils/helper";
import PaginationComponent from "@/components/PaginationComponent";
import _, { isEmpty } from "lodash";
import DropDown from "@/components/Fields/DropDown";
import { useForm } from "react-hook-form";
import XlsSVG from "../../../../public/XlsSVG.svg";
import { disciplinePracticed, SortBy } from "@/utils/constants";
import ReportCard from "../ReportCard";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { getReportListAPI } from "@/redux/slices/reports/getAthleteListSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRaceReportListAPI } from "@/redux/slices/reports/getRaceReportListSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
interface CardViewProps {
  data: any;
  isEdit?: any;
  // isLoading: boolean;
  label?: any;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  sportId?: any;
  submitFinalReport?: any;
  beforeReport?: any;
  setSelectedData?: any;
  openBeforeReport?: boolean;

}

const RaceReportList: React.FC<CardViewProps> = ({
  data,
  // isLoading,
  module,
  isEdit,
  sportId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  submitFinalReport,
  beforeReport,
  setSelectedData,
  openBeforeReport
}) => {
   const { handleSubmit, control, setValue, watch } = useForm({
      defaultValues: {
        sportsDiscipline: "",
      },
    });
    const sportsDisciplineValue = watch('sportsDiscipline')
    console.log({sportsDisciplineValue});
    const [searchText, setSearchText] = useState("");
  const currentNav = usePathname();
  const currentPath = currentNav?.split("/")[1];
  const router = useRouter();
      const { teamID } = router.query;
      const dispatch: AppDispatch = useDispatch();
  const getCurrentSport = getLocalStorage("sport");
  // const [filterData, setFilterData] = React.useState<any>([]);
  const getRaceReportList = useSelector((state: any) => {
    console.log('ssssssssssssssssss',state.getRaceReportList);
    
    return state.getRaceReportList;
});
  const isLoading = useSelector((state: any) => {
    console.log('ssssssssssssssssss',state.getRaceReportList);
    
    return state.loading;
});
console.log({getRaceReportList,isLoading});

const filterData =  filterBySearchTerm(getRaceReportList.data, searchText, [
        "raceName",
        "startDate",
    ]);
  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");

  // React.useEffect(() => {
  //   const startIndex = (page - 1) * rowsPerPage + 1;
  //   const endIndex = startIndex + rowsPerPage - 1;
  //   if (!_.isEmpty(data) && startIndex && endIndex) {
  //     setFilterData(data?.slice(startIndex - 1, endIndex));
  //   }
  // }, [data, page, rowsPerPage]);
console.log({searchText});

  useEffect(()=>{
    console.log({openBeforeReport});
    
    if(teamID && !openBeforeReport){
      // dispatch(getRaceReportListAPI({ url: `/Reports/${teamID}/Race`}));
      dispatch(getRaceReportListAPI({ url: `/Reports/${teamID}/Race?SearchKey=${searchText}`}));
    }
  },[searchText,openBeforeReport])

  // useEffect(()=>{
  //   if(teamID && searchText !==''){
  //     dispatch(getRaceReportListAPI({ url: `/Reports/${teamID}/Race?SearchKey=${searchText}`}));
  //   }
  // },[searchText])

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtmlTags(content);

    return (
      <div className="webkit-line-clamp webkit-1">{plainText && plainText}</div>
    );
  };


  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_BASE_URL}/Reports/${teamID}/Race/export?SearchKey=${searchText}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "RaceReportList.xlsx");
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
            {"Race Reports"}
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
            placeholder={"Search by Race Reports, etc..."}
            flexGrow={{ flexGrow: 0.20,marginRight:'-32px' }}
            
          />
  
        </Box>
    <Box
      sx={
        module === "staff"
          ? null
          : {
              overflowY: "auto",
              height: {
                sm: "63vh",
                lg: "75vh",
                xl: is3K ? "70vh" : is2K ? "70vh" : "70vh",
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
          name="sportsDiscipline"
          options={disciplinePracticed}
          control={control}
          sx={{
            backgroundColor:'#F1F9FF !important',
            color:'#000'
          }}
          placeholder={'Sports Discipline'}
          disabled={true}
        />
      </Grid>
      <Grid item>
        <DropDown
          name="camplocation"
          options={[
            { value: 1, label: "Today" },
            { value: 1, label: "Upcoming" },
            // { vale: "Option2", label: "Option2" },
          ]}
          control={control}
          sx={{
            backgroundColor:'#F1F9FF !important',
            color:'#000'
          }}
          placeholder={'Event Date'}
          disabled={true}
        />
        
      </Grid>
      <Grid item>
        <DropDown
          name="sortBy"
          options={[
            { value: 1, label: "Dubai" },
          ]}
          control={control}
          sx={{
            backgroundColor:'#F1F9FF !important',
            color:'#000'
          }}
          placeholder={'Event Location'}
          disabled={true}
        />
        
      </Grid>
      <Grid item>
        <DropDown
          name="sortBy"
          options={SortBy}
          control={control}
          sx={{
            backgroundColor:'#F1F9FF !important',
            color:'#000'
          }}
          placeholder={'Sort By'}
          disabled={true}
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
              onClick={downloadExcel}
            >
              Export to Excel
            </Button>
  </Grid>
</Grid>

    
   
      <Grid container spacing={2}>
       
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={index}>
              <Box
                height={"116px"}
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
        ) : !_.isEmpty(getRaceReportList.data) ? (
          getRaceReportList.data?.map((results: any, index: any) => {
            return (
              <ReportCard
    key={index}
    results={results}
    sportId={sportId}
    currentPath={currentPath}
    getCurrentSport={getCurrentSport}
    submitFinalReport={submitFinalReport}
    beforeReport={beforeReport}
    setSelectedData={setSelectedData}
    cardIndex={index}
  />
          
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
      <PaginationComponent
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={(
          event: React.ChangeEvent<{ value: unknown }>
        ) => setRowsPerPage(event.target.value as number)}
        page={page}
        handleChangePage={(event: unknown, newPage: number) => setPage(newPage)}
        startIndex={startIndex}
        endIndex={endIndex > getRaceReportList?.totalRecords ? getRaceReportList?.totalRecords : endIndex}
        totalItems={getRaceReportList?.totalRecords}
      />
    </Box>
    </>
  );
};
export default RaceReportList;
