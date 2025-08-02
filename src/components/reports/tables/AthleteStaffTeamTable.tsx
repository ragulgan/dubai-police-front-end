"use clients";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  Avatar,
  Box,
  Chip,
  Fade,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import * as React from "react";
// import DeleteDialog from "@/components/Fields/DeleteDialog";
import { RootState } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import { useSelector } from "react-redux";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Delete from "../../../../public/delete.png";
// import Delete from "../../../public/delete.png";
// import StaffRoleChip from "../staff/StaffRoleChip";

interface RowData {
  name: string;
  role: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  email?: string;
  rank?: string;
  staffID: string;
  profileImage: string;
}

// Define props for the TeamsTable component
interface TeamsTableProps {
  data: RowData[]; // Array of RowData objects
  module: string;
  headers?: any;
  isHide?: any;
  setEdit?: any;
  RenderForm?: any;
  currentIndex?: any;
  setDeleteIndex:any;
  isSetOpen?:any
}
const AthleteStaffTeamTable: React.FC<TeamsTableProps> = ({
  data,
  module,
  headers,
  isHide,
  setEdit,
  RenderForm,
  currentIndex,
  setDeleteIndex,
  isSetOpen
}) => {
  const staffDelete = useSelector((state: RootState) => state.deleteStaff);

  // Handle page change


  // Handle rows per page change

  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");
  const athleteDelete = useSelector((state: RootState) => state.deleteAthlete);

  const handleTableViewClick = (row: any) => {
    let viewPagePath = "";
    if (module === "staff") {
      viewPagePath = `/teams/${getCurrentSport}/staffs/view/${row.staffID}`;
    } else if (module === "athlete") {
      viewPagePath = `/teams/${getCurrentSport}/athletes/view/${row.athleteID}`;
    } else if (module === "nutrition") {
      viewPagePath = `/teams/${getCurrentSport}/nutrition/view/${row.nutritionID}`;
    }
    router.push(viewPagePath);
  };
console.log({data},'=ddddddddddddddddddddddddd');
const handleDelete =(index:number)=>{
  isSetOpen(true)
    setDeleteIndex(index)
}

  return (
    <Box>
      
        <Fade in={true} timeout={1000}>
          <TableContainer
            sx={{
              height: {
                xs: "58vh",
                lg: "59vh",
                xl: is3K ? "65vh" : is2K ? "auto" : "65vh",
                border: "1px solid rgba(88, 88, 91, 0.2)",
                borderRadius: "4px",
              },
              overflowX: "auto",
            }}
          >
              <Table stickyHeader aria-label="team table">
              <TableHead>
                <TableRow>
                  {headers.map((header: any) => (
                    <TableCell
                      key={header}
                      align={"left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "13px",
                        width:
                          header === "Name"
                            ? "240px"
                            : header === "No"
                            ? "60px"
                            : header === "Actions"
                            ? "60px"
                            : "164px",
                        p: 1.05,
                        color: "#000000",
                      }}
                      className="bukra-semi-bold"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row: any, index) => (
                    <>
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                      }}
                    >
                        <TableCell sx={{ p: 1.05 ,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {index+1}
                          </Typography>
                        </TableCell>
                      <TableCell
                        sx={{ display: "flex", alignItems: "center", p: 1.05,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}
                      >
                        <Avatar
                          alt={row.firstName}
                          src={row.avatar}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Tooltip
                          title={row.athlete_name}
                        >
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                              ml: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "200px",
                            }}
                            className="dubai-regular text-capitalize"
                          >
                            {`${row.athlete_name}`}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                       
                        <TableCell sx={{ p: 1.05 ,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.athlete_department || "--"}
                          </Typography>
                        </TableCell>
                      
                     {module === 'athlete' && <TableCell sx={{ p: 1.05 ,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}>
                        { (
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.medicalPerformanceLevel || "--"}
                          </Typography>
                        ) }
                      </TableCell>}
                      {/* Staff row */}
                      
                   
                      {/* athlete row */}
                      {module === "athlete" && (
                        <TableCell sx={{ p: 1.05 ,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}>
                          {/* <AthletePerformanceLevelChip
                            performanceLevel={row.performanceLevel || ""}
                          /> */}
                         <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.workPermissionType || "--"}
                          </Typography>
                        </TableCell>
                      )}
                      {/* Nutrition row */}
                      
                      {module ==='staff' && <TableCell sx={{ p: 1.05 ,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)"}}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.athlete_department || "--"}
                          </Typography>
                        </TableCell>}
                      <TableCell sx={{ whiteSpace: "nowrap", p: 1.05,borderBottom: index === currentIndex ? "none" : "1px solid rgba(224, 224, 224, 1)" }}>
                        {/* <Tooltip title={"View"}>
                          <IconButton
                            aria-label="view"
                            sx={{ width: "16px", height: "16px" , ...(isHide && { marginLeft:   3} ) }}
                          >
                            <VisibilityIcon
                              onClick={() => {
                                handleTableViewClick(row);
                              }}
                              sx={{ color: "#05868E" }}
                            />
                          </IconButton>
                        </Tooltip> */}
                      {!isHide &&
                        <Tooltip title={"Edit"}>
                          <IconButton
                            aria-label="edit"
                            size="small"
                           
                            sx={{
                              width: "16px",
                              height: "16px",
                              mx: 1,
                              color: "#05868E",
                            }}
                            onClick={()=> setEdit(row.athleteId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                       
}
<Tooltip title={"delete"}>
                          <IconButton
                            aria-label="delete"
                            size="small"
                           
                            sx={{
                              width: "16px",
                              height: "16px",
                              mx: 1,
                              color: "#05868E",
                            }}
                            onClick={()=>handleDelete(row.athleteId)}
                            // onClick={()=> isSetOpen(index)
                            //   setDeleteIndex(index)
                            // }
                          >
                          <DeleteIcon/>
                          </IconButton>
                        </Tooltip>

                      </TableCell>
                    </TableRow>
                  {/* { index === currentIndex && <TableRow >
                  <TableCell colSpan={12}>
{RenderForm}
                  </TableCell>
                 
                  </TableRow>} */}
                    </>
                  ))}
             </TableBody>         
            </Table>
          
          </TableContainer>
        </Fade>
      
    </Box>
  );
};

export default AthleteStaffTeamTable;
