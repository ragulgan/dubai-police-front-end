import React, { useEffect, useState } from "react";
import { Box, SnackbarCloseReason } from "@mui/material";
import CustomIconButton from "../buttons/CustomIconButton";
import TableViewIcon from "../../../public/svg/TableView.svg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FacilitiesTableView from "./FacilitiesTableView";
import TableSkeleton from "../skeleton/TableSkeleton";
import AppAlert from "../alert/AppAlert";
import FacilitiesCalendarView from "./FacilitiesCalendarView";
import { useRouter } from "next/router";
import FacilityViewDialog from "./FacilityViewDialog";
import FacilityCancelDialog from "./FacilityCancelDialog";
import { useDispatch, useSelector } from "react-redux";
import { clearCancelFacilitiesByIDState } from "@/redux/slices/researchFacilities/cancellingFacilitiesByID";
import CustomSnackbar from "../CustomSnackbar";
import EditFacilitiesSlider from "./edit/EditFacilitiesSlider";
import { clearResearchAndFacilitiesEditState } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";

interface FacilityProps {
  searchText: string;
  setIsUpdated?: any;
  listFacilitiesData: any;
  tabValue?: any;
  reloadFacilities: () => void;
  getPageContentHeight?: any;
}

const FacilitiesTabContent: React.FC<FacilityProps> = ({
  searchText,
  setIsUpdated,
  listFacilitiesData,
  tabValue,
  reloadFacilities,
  getPageContentHeight,
}) => {
  const router = useRouter();
  const { module, pageView } = router.query;

  const [selectedView, setSelectedView] = useState<
    "tableview" | "calendarview"
  >("tableview");
  const [viewFacilityID, setViewFacilityID] = useState<number | null>(null);
  const [cancelFacilityID, setCancelFacilityID] = useState<number | null>(null);
  const [editFacilityID, setEditFacilityID] = useState<number | null>(null);
  const [snackbarStatus, setSnackbarStatus] = useState<any>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const dispatch: any = useDispatch();

  const cancelFacilitiesData = useSelector((state: any) => {
    return state.cancelFacilitiesByID;
  });

  useEffect(() => {
    if (pageView) {
      setSelectedView(
        pageView === "calendarview" ? "calendarview" : "tableview"
      );
    }
  }, [pageView]);

  const handleViewToggle = React.useCallback(
    (view: "tableview" | "calendarview") => {
      if (selectedView !== view) {
        router.push(`/researchAndFacilities?module=${module}&pageView=${view}`);
      }
    },
    [selectedView]
  );

  const handleOnCancelClicked = () => {
    setCancelFacilityID(viewFacilityID);
    setTimeout(() => {
      setViewFacilityID(null);
    }, 100);
  };

  useEffect(() => {
    if (cancelFacilitiesData && cancelFacilitiesData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setCancelFacilityID(null);
      setTimeout(() => {
        reloadFacilities();
        dispatch(clearCancelFacilitiesByIDState());
      }, 1000);
    } else if (cancelFacilitiesData && cancelFacilitiesData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setCancelFacilityID(null);
      setTimeout(() => {
        dispatch(clearCancelFacilitiesByIDState());
        setSnackbarOpen(false);
      }, 3000);
    }
  }, [cancelFacilitiesData]);

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEditClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setEditFacilityID(null);
    reloadFacilities();
  };

  return (
    <>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Facilities Cancelled successfully!`
              : cancelFacilitiesData && cancelFacilitiesData?.message
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}

      {/* View dialog */}
      {!!viewFacilityID ? (
        <FacilityViewDialog
          open={!!viewFacilityID}
          onClose={() => {
            setViewFacilityID(null);
            dispatch(clearResearchAndFacilitiesEditState());
          }}
          facilityID={viewFacilityID}
          onCancelClicked={handleOnCancelClicked}
          onEditClicked={(facilityId: number) => {
            setViewFacilityID(null);
            setEditFacilityID(facilityId);
          }}
        />
      ) : null}

      {/* Cancel dialog */}
      {!!cancelFacilityID ? (
        <FacilityCancelDialog
          open={!!cancelFacilityID}
          onClose={() => {
            setCancelFacilityID(null);
          }}
          facilityID={cancelFacilityID}
        />
      ) : null}

      {/* Edit slider */}
      {!!editFacilityID ? (
        <EditFacilitiesSlider
          open={!!editFacilityID}
          onClose={(event: any, reason: any) => handleEditClose(event, reason)}
          facilityID={editFacilityID}
          setIsUpdated={setIsUpdated}
          module={tabValue}
        />
      ) : null}

      {/* actual page content starts here */}
      <Box sx={{ height: getPageContentHeight(), overflow: "scroll" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingX: 1,
            paddingY: 2,
          }}
        >
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedView === "tableview"}
            onClick={() => handleViewToggle("tableview")}
            title="Card View"
          />
          <CustomIconButton
            icon={CalendarMonthIcon}
            isSelected={selectedView === "calendarview"}
            onClick={() => handleViewToggle("calendarview")}
            title="Calendar View"
          />
        </Box>

        {selectedView === "tableview" &&
        listFacilitiesData &&
        listFacilitiesData.loading ? (
          <TableSkeleton />
        ) : null}

        {listFacilitiesData &&
        !listFacilitiesData.loading &&
        listFacilitiesData.code === 500 ? (
          <AppAlert type="error" message="Unable to load facilities list." />
        ) : null}

        {selectedView === "tableview" &&
        listFacilitiesData &&
        !listFacilitiesData.loading &&
        listFacilitiesData.code === 200 &&
        listFacilitiesData.data &&
        listFacilitiesData.data.length < 1 ? (
          <AppAlert
            type="info"
            message={
              !!searchText
                ? "No search result(s) found."
                : "No record(s) found."
            }
          />
        ) : null}

        {selectedView === "tableview" &&
        listFacilitiesData &&
        !listFacilitiesData.loading &&
        listFacilitiesData.code === 200 &&
        listFacilitiesData.data &&
        listFacilitiesData.data.length > 0 ? (
          <FacilitiesTableView
            listFacilitiesData={listFacilitiesData}
            setViewFacilityID={(facilityID: number) =>
              setViewFacilityID(facilityID)
            }
            setEditFacilityID={(facilityID: number) =>
              setEditFacilityID(facilityID)
            }
            reloadFacilities={reloadFacilities}
          />
        ) : null}

        {selectedView === "calendarview" &&
        listFacilitiesData &&
        !listFacilitiesData.loading &&
        listFacilitiesData.code === 200 ? (
          <FacilitiesCalendarView
            listFacilitiesData={listFacilitiesData}
            setViewFacilityID={(facilityID: number) =>
              setViewFacilityID(facilityID)
            }
          />
        ) : null}
      </Box>
    </>
  );
};

export default FacilitiesTabContent;
