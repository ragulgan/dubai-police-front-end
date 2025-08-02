import { Box, Grid } from "@mui/material";
import ResearchCard from "./ResearchCard";
import GridViewSkeleton from "../skeleton/GridViewSkeleton";
import AppAlert from "../alert/AppAlert";

type ResearchTabContent = {
  searchText: string;
  tabValue: string;
  listResearchData: any;
  setIsUpdated: any;
  getPageContentHeight?: any;
};

const ResearchTabContent: React.FC<ResearchTabContent> = ({
  searchText,
  listResearchData,
  tabValue,
  setIsUpdated,
  getPageContentHeight,
}) => {
  return (
    <Box
      sx={{ padding: 1.5, height: getPageContentHeight(), overflow: "scroll" }}
    >
      {listResearchData && listResearchData.loading && (
        <GridViewSkeleton></GridViewSkeleton>
      )}

      {listResearchData &&
        !listResearchData.loading &&
        listResearchData.code === 500 && (
          <Box p={3}>
            <AppAlert type="error" message={"Unable to load research list."} />
          </Box>
        )}

      {listResearchData &&
        !listResearchData.loading &&
        listResearchData.code === 200 &&
        listResearchData.data &&
        listResearchData.data.length < 1 && (
          <Box p={3}>
            <AppAlert
              type="info"
              message={!!searchText ? "No search result(s) found." : "No record(s) found."}
            />
          </Box>
        )}

      {listResearchData &&
        !listResearchData.loading &&
        listResearchData.code === 200 &&
        listResearchData.data &&
        listResearchData.data.length > 0 && (
          <Box sx={{ padding: 1 }}>
            <Grid container spacing={2}>
              {listResearchData.data.map((item: any) => {
                return (
                  <Grid key={item.researchID} item width={412}>
                    <ResearchCard
                      data={item}
                      tabValue={tabValue}
                      setIsUpdated={setIsUpdated}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
    </Box>
  );
};

export default ResearchTabContent;
