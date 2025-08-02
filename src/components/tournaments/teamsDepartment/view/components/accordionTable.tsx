"use clients";
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  useMediaQuery,
  Fade,
  Tooltip
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/router";
import PaginationComponent from '@/components/PaginationComponent';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import ParticipantsViewModal from './accordionViewTable';

interface RowData {
  rank: string;
  name: string;
  participation?: number;
  medals?: number;
  imageUrl?: string;
}
interface TeamsTableProps {
  data: RowData[]; // Array of RowData objects
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  dataList: any;
  isLoading: any;
  module: string;
}

const PaticipantTeamTable: React.FC<TeamsTableProps> = ({
  data,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  dataList,
  isLoading,
  module
}) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [pageModal, setPageModal] = React.useState(1);
  const [rowsPerPageModal, setRowsPerPageModal] = React.useState(10);
  const router = useRouter();
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "59vh";
    if (isFullHD) return "63vh";
    if (is3K) return "59vh";
    if (is2K) return "54vh";
    if (isLaptopL) return "59vh";
    if (isLaptop) return "59vh";
    if (isTab) return "55vh";
    return "59vh";
  };

  const getLatestResultData = {
    "loading": false,
    "code": 200,
    "message": "Success",
    "totalRecords": 6,
    "data": [
      {
        employee_ID: "DP123456",
        participants: "Sergeant Ahmed Al Mansoori",
        event: "Basketball",
        type: "Individual",
        date: "20/01/2025",
        medal: "Gold",
        score: "4pts",
        imageUrl: "/team-overview/player1.svg"
      },
      {
        employee_ID: "DP565656",
        participants: "Sergeant Fatima Al-Mansoori",
        event: "Swimming",
        type: "Individual",
        date: "16/01/2025",
        medal: "Silver",
        score: "1pts",
        imageUrl: "/team-overview/player2.svg"
      },
      {
        employee_ID: "DP856585",
        participants: "Major Mohammad Al-Nuaimi",
        event: "Running",
        type: "Individual",
        date: "18/01/2025",
        medal: "Bronze",
        score: "2pts",
        imageUrl: "/team-overview/player3.svg"
      },
      {
        employee_ID: "DP335686",
        participants: "Brigadier Aisha Al Zayed",
        event: "Football",
        type: "Collective",
        date: "25/01/2025",
        medal: "Silver",
        score: "4pts",
        imageUrl: "/team-overview/player1.svg"
      },
      {
        employee_ID: "DP989568",
        participants: "Major Khalid Al-Jaberi",
        event: "Shooting",
        type: "Individual",
        date: "14/01/2025",
        medal: "Bronze",
        score: "2pts",
        imageUrl: "/team-overview/player3.svg"
      },
      {
        employee_ID: "DP868898",
        participants: "Aisha Al Zayed",
        event: "Taekwondo",
        type: "Collective",
        date: "01/01/2025",
        medal: "Gold",
        score: "8pts",
        imageUrl: "/team-overview/player2.svg"
      }
    ]
  }

  const tableHeaders = [
    "Employee ID",
    "Participants",
    "Event",
    "Type",
    "Date",
    "Medal",
    "Score"
  ];

  const handleTableViewClick = (row: any) => {
    setDialogOpen(true);
  };

  const onCloseViewModal = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      {dialogOpen && (
        <ParticipantsViewModal
          open={dialogOpen}
          onClose={onCloseViewModal}
          data={getLatestResultData.data || []}
          isLoading={getLatestResultData.loading}
          setPage={setPageModal}
          page={pageModal}
          setRowsPerPage={setRowsPerPageModal}
          rowsPerPage={rowsPerPageModal}
          dataList={getLatestResultData}
          module={"participants_view_modal"}
          headers={tableHeaders}
        />
      )}
      {isLoading ? (
        <Box
          sx={{
            height: getPageContentHeight(),
            backgroundColor: "#FFFFFF",
          }}
        >
          <TableSkeleton />
        </Box>
      ) : (
        <Fade in={true} timeout={1000}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="participants table with pagination">
              <TableHead>
                <TableRow sx={{ background: "#008755", borderBottom: '5px solid #f5fcf9' }}>
                  <TableCell sx={{ color: "#fff", fontSize: "18px" }}>Rank</TableCell>
                  <TableCell sx={{ color: "#fff", fontSize: "18px" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontSize: "18px" }} align="left">Total Participation</TableCell>
                  <TableCell sx={{ color: "#fff", fontSize: "18px" }} align="left">Total Medals</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row: any, index: any) => (
                    <TableRow
                      key={index}
                      sx={{ backgroundColor: "#ddf4ec", borderBottom: '5px solid #f5fcf9' }}
                    >
                      <TableCell component="th" scope="row" align="center" sx={{
                        background: "#008755", color: "#fff", fontSize: "25px",
                        fontWeight: 'bold', clipPath: "polygon(0 0, 100% 0, 93% 100%, 0% 100%)"
                      }}>
                        {row.rank}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar alt={row.name} src={row.imageUrl} sx={{ mr: 1 }} />
                          <Typography component="span" sx={{ fontSize: "20px", fontWeight: 'bold', }}>
                            {row.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: "20px", fontWeight: 'bold', }}>{row.participation}</TableCell>
                      <TableCell align="left" sx={{ fontSize: "20px", fontWeight: 'bold', }}>{row.medals}</TableCell>
                      <TableCell align='center'>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: "#008755", width: '60px', height: '40px', clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}>
                          <Tooltip title={"View"}>
                            <IconButton
                              aria-label="view"
                              sx={{
                                width: "16px",
                                height: "16px",
                              }}
                            >
                              <VisibilityIcon
                                onClick={() => handleTableViewClick(row)}
                                sx={{ color: "#FFFFFF" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              startIndex={startIndex}
              endIndex={
                endIndex > dataList?.totalRecords
                  ? dataList?.totalRecords
                  : endIndex
              }
              totalItems={dataList?.totalRecords}
            />
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
}

export default PaticipantTeamTable;