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
  Tooltip,
  Modal,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import XlsSVG from "../../../../../../public/XlsSVG.svg";
import ModuleFilterButton from '@/components/buttons/ModuleFilterButton';
import FilterDialog from '@/components/FilterDialog';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import _ from "lodash";
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import PaginationComponent from '@/components/PaginationComponent';

const ParticipantsViewModal: React.FC<any> = ({
  open,
  onClose,
  module,
  data,
  isLoading,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  dataList,
  headers,
}) => {
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const filterOptions = _(rolesListData.data)
    .filter({ moduleName: "Staff" })
    .map("roleName")
    .value();
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const storedFilters = localStorage.getItem("staffSelectedFilters");
  const [filterData, setFilterData] = React.useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );

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

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);

    setFilterDialogOpen(false);
  };
  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
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

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="participants-view-modal"
    >
      <Box
        sx={{
          minWidth: 1000,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            transition: "background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 100, 60, 1)",
              color: "#fff",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
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
            <Box sx={{ border: "1px solid rgba(88, 88, 91, 0.2)", borderRadius: '4px' }}>
            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Button
                variant="outlined"
                // disabled={!staffList?.data?.length}
                // onClick={downloadExcel}
                className="text-capitalize dubai-med export-button"
                sx={{ mr: 2, borderRadius: "43px", height: "44px" }}
                startIcon={<XlsSVG width="26px" height="26px" />}
              >
                {"Export to Excel"}
              </Button>

              <ModuleFilterButton
                handleFilterClick={handleFilterClick}
                text={"Filter by role"}
              />
              {!_.isEmpty(filterOptions) && (
                <FilterDialog
                  anchorEl={anchorEl}
                  options={filterOptions}
                  open={filterDialogOpen}
                  onClose={handleCloseFilterDialog}
                  onApply={handleApplyFilters}
                  localStorageKey="staffSelectedFilters"
                // setPage={setPage}
                // setRowsPerPage={setRowsPerPage}
                />
              )}
            </Box>
            <TableContainer
              sx={{
                height: getPageContentHeight(),
                overflowX: "auto",
                borderTop: "1px solid rgba(88, 88, 91, 0.2)",
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
                              : header === "Role"
                                ? "97px"
                                : header === "Actions"
                                  ? "60px"
                                  : "164px",
                          p: 1.25,
                          color: "#000000",
                          paddingLeft: header === "Name" ? "70px" : "none",
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
                    data.map((row: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                        }}
                      >
                        <TableCell
                          sx={{ display: "flex", alignItems: "center", p: 1.25 }}
                        >
                          <Avatar
                            alt='profile'
                            src={row.imageUrl}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Tooltip
                            title={`${row.employee_ID}`}
                          >
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                                ml: 2,
                              }}
                              className="dubai-regular text-capitalize"
                            >
                              {`${row.employee_ID}`}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "200px",
                            }}
                            className="dubai-regular"
                          >
                            {row.participants || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.event || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.type || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.date || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.medal || "--"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "#58585B",
                            }}
                            className="dubai-regular"
                          >
                            {row.score || "--"}
                          </Typography>
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
            </Box>
          </Fade>
        )}
      </Box>
    </Modal>
  );
};

export default ParticipantsViewModal;
