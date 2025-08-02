import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PaginationComponent from "../PaginationComponent";
import XlsSVG from "../../../public/XlsSVG.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const reportsList = [
  {
    id: 1,
    unit: "Security of agencies, facilities and emergencies",
    participationRate: "20%",
    winRate: "19.3%",
    totalScore: "89.9",
    competitiveness: "60",
    participationAndEngagement: "7.0",
    womenEmpowerment: "7.5",
    physicalReadiness: "5.4",
    MotivationAndSupport: "10.0"
  },
  {
    id: 2,
    unit: 'Airport Security',
    participationRate: '15%',
    winRate: '16.0%',
    totalScore: '82.4',
    competitiveness: "70",
    participationAndEngagement: "8.0",
    womenEmpowerment: "8.5",
    physicalReadiness: "4.4",
    MotivationAndSupport: "9.0"
  },
  {
    id: 3,
    unit: 'Criminal Investigations and Investigations',
    participationRate: '7%',
    winRate: '6.6%',
    totalScore: '74.9',
    competitiveness: "50",
    participationAndEngagement: "5.0",
    womenEmpowerment: "6.5",
    physicalReadiness: "8.4",
    MotivationAndSupport: "9.0"
  },
  {
    id: 4,
    unit: 'Community Happiness',
    participationRate: '42%',
    winRate: '4.3%',
    totalScore: '61.5',
    competitiveness: "40",
    participationAndEngagement: "6.0",
    womenEmpowerment: "6.5",
    physicalReadiness: "6.4",
    MotivationAndSupport: "9.0"
  },
  {
    id: 5,
    unit: 'Dubai Police Academy',
    participationRate: '14%',
    winRate: '2.7%',
    totalScore: '59.7',
    competitiveness: "80",
    participationAndEngagement: "6.0",
    womenEmpowerment: "7.5",
    physicalReadiness: "8.4",
    MotivationAndSupport: "4.0"
  },
  {
    id: 6,
    unit: 'Ports Police Station',
    participationRate: '18%',
    winRate: '2.3%',
    totalScore: '59.4',
    competitiveness: "50",
    participationAndEngagement: "5.0",
    womenEmpowerment: "6.5",
    physicalReadiness: "8.4",
    MotivationAndSupport: "9.0"
  },
  {
    id: 7,
    unit: 'Administrative Affairs',
    participationRate: '15%',
    winRate: '16.0%',
    totalScore: '82.4',
    competitiveness: "60",
    participationAndEngagement: "7.0",
    womenEmpowerment: "7.5",
    physicalReadiness: "5.4",
    MotivationAndSupport: "10.0"
  },
  {
    id: 8,
    unit: 'Hatta Police Station',
    participationRate: '15%',
    winRate: '16.0%',
    totalScore: '82.4',
    competitiveness: "70",
    participationAndEngagement: "8.0",
    womenEmpowerment: "8.5",
    physicalReadiness: "4.4",
    MotivationAndSupport: "9.0"
  },
];

interface DepartmentRankingReportProps {
  page?: any;
  setPage?: any;
  rowsPerPage?: any;
  setRowsPerPage?: any;
}

const DepartmentRankingReportTable: React.FC<DepartmentRankingReportProps> = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "58.5vh";
    if (isFullHD) return "63vh";
    if (is3K) return "58.5vh";
    if (is2K) return "54.5vh";
    if (isLaptopL) return "58.5vh";
    if (isLaptop) return "58.5vh";
    if (isTab) return "54.5vh";
    return "58.5vh";
  };
  const [downloading, setDownloading] = useState<boolean>(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const headers = [
    "M",
    "Organizational Unit",
    "Average Participation Rate",
    "Win Rates",
    "Total score",
    "More",
  ];

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const downloadDepartmentRankingExcel = async () => {
  };

  const toggleRow = (id: number) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "17px",
            paddingLeft: "20px",
            paddingTop: "5px"
          }}
        >
          <Button
            variant="outlined"
            className="text-capitalize dubai-med export-button"
            sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
            startIcon={<XlsSVG width="25px" height="25px" />}
            // disabled={isEmpty(budgetsList.data) || downloading}
            onClick={downloadDepartmentRankingExcel}
          >
            {downloading ? "Downloading..." : "Export to Excel"}
          </Button>
        </Box>
        <Box
          sx={{
            paddingX: 2,
          }}
        >
          <TableContainer
            sx={{
              height: getPageContentHeight(),
              overflowY: "scroll",
              border: "1px solid rgba(88, 88, 91, 0.2)",
              borderRadius: "8px",
            }}
          >
            <Table stickyHeader aria-label="team table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#26D07C" }}>
                  {headers.map((header: any, index: number) => (
                    <TableCell
                      key={header}
                      align={"left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 500,
                        fontSize: "16px",
                        p: 1.25,
                        color: "#FFFFFF",
                        backgroundColor: "#26D07C",
                        pl: index === 0 ? 4 : 1.25,
                      }}
                      className="bukra"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportsList.map((report: any, index: any) => (
                  <React.Fragment key={report.id}>
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: expandedRowId === report.id ? "#E0F7EF" : "inherit",
                      }}
                    >
                      <TableCell sx={{ p: 1.25, pl: 4, }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            lineHeight: "24px"
                          }}
                          className="dubai-regular"
                        >
                          {report.id || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Tooltip
                          title={`${report.unit || "--"}`}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              lineHeight: "24px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "200px",
                            }}
                            className="dubai-regular"
                          >
                            {report.unit || "--"}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            lineHeight: "24px"
                          }}
                          className="dubai-regular"
                        >
                          {report.participationRate || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            lineHeight: "24px"
                          }}
                          className="dubai-regular"
                        >
                          {report.winRate || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            lineHeight: "24px"
                          }}
                          className="dubai-regular"
                        >
                          {report.totalScore || "--"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1.25 }}>
                        <IconButton onClick={() => toggleRow(report.id)}>
                          <ExpandMoreIcon
                            sx={{
                              transform: expandedRows.includes(report.id)
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s",
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow >
                    <TableRow >
                      <TableCell
                        colSpan={6}
                        sx={{ p: 0, borderBottom: "none" }}
                      >
                        <Collapse in={expandedRowId === report.id}>
                          <Box sx={{ borderTop: "1px solid #26D07C", mx: 4 }} />
                          <Box sx={{
                            p: 2,
                            pl: 4,
                            pr: 4,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            borderBottom: "2px solid #DEE2ED",
                            backgroundColor:
                              expandedRowId === report.id ? "#E0F7EF" : "inherit",
                          }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography sx={{ fontSize: "18px" }} className="dubai-regular">Competitiveness</Typography>
                              <Typography className="dubai-regular" sx={{ color: " #008755", fontSize: "22px", fontWeight: 600 }}>{report.competitiveness}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography sx={{ fontSize: "18px" }} className="dubai-regular">Participation & Engagement</Typography>
                              <Typography className="dubai-regular" sx={{ color: " #008755", fontSize: "22px", fontWeight: 600 }}>{report.participationAndEngagement}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography className="dubai-regular" sx={{ fontSize: "18px" }}>Women Empowerment</Typography>
                              <Typography className="dubai-regular" sx={{ color: " #008755", fontSize: "22px", fontWeight: 600 }}>{report.womenEmpowerment}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography className="dubai-regular" sx={{ fontSize: "18px" }}>Physical Readiness</Typography>
                              <Typography className="dubai-regular" sx={{ color: " #008755", fontSize: "22px", fontWeight: 600 }}>{report.physicalReadiness}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography className="dubai-regular" sx={{ fontSize: "18px" }}>Motivation & Support</Typography>
                              <Typography className="dubai-regular" sx={{ color: " #008755", fontSize: "22px", fontWeight: 600 }}>{report.MotivationAndSupport}</Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody >
            </Table >
            <PaginationComponent
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={1}
              handleChangePage={handleChangePage}
              startIndex={1}
              endIndex={1}
              totalItems={8}
            />
          </TableContainer >
        </Box >
      </Box >
    </>
  );
};

export default DepartmentRankingReportTable;
