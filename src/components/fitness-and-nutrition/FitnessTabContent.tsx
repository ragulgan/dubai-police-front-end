import { Alert, Box } from "@mui/material";
import TestAndMedicalsTestList from "../testAndMedicalChecks/ListTestAndMedical";
import TableSkeleton from "../skeleton/TableSkeleton";

type FitnessTabContent = {
  data: any;
  tabValue: string;
  getFitnessListData?: any;
  setIsUpdated?: any;
  page: any;
  rowsPerPage: any;
  testType?: any;
  isEdit: any;
  setPage: any;
  setRowsPerPage: any;
};

const FitnessTabContent: React.FC<FitnessTabContent> = ({
  data,
  getFitnessListData,
  tabValue,
  setIsUpdated,
  page,
  rowsPerPage,
  testType,
  isEdit,
  setPage,
  setRowsPerPage,
}) => {
  return (
    <Box sx={{ padding: 1.5 }}>
      {getFitnessListData && getFitnessListData.loading ? (
        <Box
          height="50vh"
        >
          <TableSkeleton />
        </Box>
      ) : null}

      {getFitnessListData &&
        !getFitnessListData.loading &&
        getFitnessListData.code === 500 ? (
        <Box p={1}>
          <Alert className="dubai-med" severity="info">
            Unable to load fitness list.
          </Alert>
        </Box>
      ) : null}

      {getFitnessListData &&
        !getFitnessListData.loading &&
        getFitnessListData.code === 200 &&
        getFitnessListData.data &&
        getFitnessListData.data.length < 1 ? (
        <Box p={1}>
          <Alert className="dubai-med" severity="info">
            No record(s) found
          </Alert>
        </Box>
      ) : null}

      {getFitnessListData &&
        !getFitnessListData.loading &&
        getFitnessListData.code == 200 &&
        getFitnessListData.data &&
        getFitnessListData.data.length > 0 ? (
        <TestAndMedicalsTestList
          data={data}
          isEdit={isEdit}
          getTestAndMedicalCheckssListData={getFitnessListData}
          tabValue={tabValue}
          setIsUpdated={setIsUpdated}
          page={page}
          rowsPerPage={rowsPerPage}
          testType={testType}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      ) : null}
    </Box>
  );
};

export default FitnessTabContent;
