import React, { useState } from "react";
import { Alert, Box } from "@mui/material";
import CustomIconButton from "../buttons/CustomIconButton";
import CardViewIcon from "@mui/icons-material/GridView";
// import TableViewIcon from "../../../../../public/svg/TableView.svg";
import TableViewIcon from "../../../public/svg/TableView.svg";
import CardView from "../nutrition/card";
import TeamsTable from "../nutrition/table";
import PaginationComponent from "../PaginationComponent";
import router from "next/router";
import TableSkeleton from "../skeleton/TableSkeleton";

type NutritionProps = {
  listNutritionData: any;
  tabValue?: any;
  page: any;
  rowsPerPage: any;
  setPage: any;
  setRowsPerPage: any;
  pageView?: any;
  module?: any;
  memoizedSelectedSport?: any,
  debouncedSearchText?: any,
  filterNutritionData?: any
}

const NutritionTabContent: React.FC<NutritionProps> = ({
  listNutritionData,
  tabValue,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  pageView,
  module,
  memoizedSelectedSport,
  debouncedSearchText,
  filterNutritionData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);

  // const [selectedView, setSelectedView] = React.useState<
  //   "tableview" | "gridview"
  // >(pageView === "tableview" ? "tableview" : "gridview");

  const [selectedView, setSelectedView] = React.useState<"tableview" | "gridview">("tableview");


  const handleViewToggle = React.useCallback(
    (view: "tableview" | "gridview") => {
      if (selectedView !== view) {
        setSelectedView(view);
      }
      router.push(`/fitness-and-nutrition?module=${module}&pageView=${view}`);
    },
    [selectedView, module]
  );

  const tableHeaders = [
    "Athlete Name",
    "Plan Name",
    "Start  Date",
    "End Date",
    "BMI Value",
    "Actions",
  ];

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  return (
    <>
      <Box sx={{ padding: 1 }}>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingX: 1,
            paddingY: 2,
          }}
        >
          <CustomIconButton
            icon={CardViewIcon}
            isSelected={selectedView === "gridview"}
            onClick={() => handleViewToggle("gridview")}
            title="Card View"
          />
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedView === "tableview"}
            onClick={() => handleViewToggle("tableview")}
            title="Table View"
          />
        </Box> */}

        {listNutritionData &&
          !listNutritionData.loading &&
          listNutritionData.code === 500 ? (
          <Box p={1}>
            <Alert className="dubai-med" severity="info">
              Unable to load nutrition list.
            </Alert>
          </Box>
        ) : null}

        {selectedView === "tableview" &&
          listNutritionData &&
          listNutritionData.loading ? (
          <TableSkeleton />
        ) : null}

        {selectedView === "tableview" &&
          listNutritionData &&
          !listNutritionData.loading &&
          listNutritionData.code === 200 &&
          listNutritionData.data &&
          listNutritionData.data.length < 1 ? (
          <Box p={1}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Box>
        ) : null}

        {selectedView === "tableview" &&
          listNutritionData &&
          !listNutritionData.loading &&
          listNutritionData.code === 200 &&
          listNutritionData.data &&
          listNutritionData.data.length > 0 ? (
          <TeamsTable
            data={listNutritionData?.data}
            page={page}
            rowsPerPage={rowsPerPage}
            module="nutrition-table"
            isLoading={listNutritionData.loading}
            dataList={listNutritionData}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            isEdit={handleEditData}
            headers={tableHeaders}
            memoizedSelectedSport={memoizedSelectedSport}
            debouncedSearchText={debouncedSearchText}
            filterNutritionData={filterNutritionData}
          />
        ) : null}

        {selectedView === "gridview" &&
          listNutritionData &&
          listNutritionData.code === 200 ? (
          <>
            <CardView
              data={listNutritionData?.data}
              isLoading={listNutritionData.loading}
              module="nutrition-grid"
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
            {listNutritionData.data && listNutritionData.data.length > 0 ? (
              <Box>
                <PaginationComponent
                  rowsPerPage={rowsPerPage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  startIndex={startIndex}
                  endIndex={
                    endIndex > listNutritionData?.totalRecords
                      ? listNutritionData?.totalRecords
                      : endIndex
                  }
                  totalItems={listNutritionData?.totalRecords}
                />
              </Box>
            ) : null}
          </>
        ) : null}
      </Box>
    </>
  );
};

export default NutritionTabContent;
