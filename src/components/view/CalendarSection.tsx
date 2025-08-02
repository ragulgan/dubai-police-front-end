"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomButton from "../buttons/CustomButton";
import PlusSVG from "../../../public/PlusSVG.svg";
import XlsSVG from "../../../public/XlsSVG.svg";
import Grid from "@mui/material/Grid";
import CustomFullCalendar from "../calendar/CustomFullCalendar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventItem, ID } from "@/interfaces/AppInterfaces";
import { transformCalendarData } from "@/utils/helper";
import moment from "moment";
import { getRaceCalendarListDispatch, RootState } from "@/redux/store";
import { getRaceCalendarAPI } from "@/redux/slices/raceCalendar/getRaceCalendarListSlice";
import dayjs, { Dayjs } from "dayjs";
import CalendarCreateDialog from "../dialogs/CalendarCreateDialog";
import {
  clearGetRaceCalendarByIDState,
  GetRaceCalendarByID,
} from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import { isEmpty } from "lodash";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import SlideRaceCalendar from "../raceCalendar/SlideRaceCalendar";
import Axios from "../../utils/axiosFileInstance";
import { axiosCallBlob } from "@/utils/AxiosInterceptor";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface CalendarSectionProps {
  sportID?: number;
  label: string;
  expanded: boolean;
  module: string;
  moduleID: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  sportID,
  label,
  expanded,
  module,
  moduleID,
  onClick,
}) => {
  const [calendarData, setCalendarData] = useState<EventItem[]>([]);
  const [calendarItems, setCalendarItems] = useState([
    "tournaments",
    "trainings",
    "events",
    "reminders",
    "meetings",
  ]);
  const [monthChange, setMonthChange] = useState<any>(
    moment().format("MMM DD, YYYY")
  );
  const startDate = dayjs(monthChange, "MMM DD, YYYY").startOf('month').format("DD/MM/YYYY");
  const endDate = dayjs(monthChange, "MMM DD, YYYY").endOf('month').format("DD/MM/YYYY");
  const [filterData, setFilterData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [filter, setfilter] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [id, setID] = useState<ID | undefined>(undefined);
  const [date, setDate] = useState<any>("");
  const [isView, setView] = useState(false);

  const dispatch: getRaceCalendarListDispatch = useDispatch();

  const getRaceCalendarByID = useSelector((state: RootState) => {
    return state &&
      state.GetRaceCalendarByID &&
      !isEmpty(state?.GetRaceCalendarByID?.data) &&
      !isEmpty(state?.GetRaceCalendarByID?.data)
      ? state.GetRaceCalendarByID.data
      : null;
  });

  const getRaceCalendarList = useSelector((state: any) => {
    return state.getRaceCalendarList;
  });

  const isCalendarUpdated = useSelector((state: any) => {
    return state.ui.isUpdated;
  });

  useEffect(() => {
    if (expanded && sportID != null) {
      const payload = {
        ...filterData,
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: sportID,

        moduleView: module === "staff" ? "Staff" : "Athlete",
        moduleID: moduleID,
      };

      dispatch(getRaceCalendarAPI(payload));
    }
  }, [expanded, sportID]);

  useEffect(() => {
    if (!isEmpty(id) && isView) {
      const array = Object.keys(id);
      setDrawerTitle(id.section);
      const payload: any = {
        section: id.section,
        sportID: sportID,
        [array[2]]: id[array[2]],

      };
      dispatch(GetRaceCalendarByID(payload));
    }
  }, [id, sportID, isView]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 100,
      sportID: sportID,

      moduleView: module === "staff" ? "Staff" : "Athlete",
      moduleID: moduleID,
    };
    if (isCalendarUpdated) {
      dispatch(getRaceCalendarAPI(payload));
      dispatch(isUpdatedFunc(false));
    }
  }, [isCalendarUpdated]);

  const handleCreateClick = () => {
    setOpenDialog(true);
  };

  const handleCreateItemSelect = (selected: string) => {
    setOpenDialog(false);
    setDrawerTitle(selected);
    setDrawerOpen(true);
  };

  const handleEditDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      dispatch(clearGetRaceCalendarByIDState());
    }, 1000);
    setDate(null);
  };

  // to format the respose for calendar data
  useEffect(() => {
    if (getRaceCalendarList.data && getRaceCalendarList.data.length) {
      setCalendarData(
        transformCalendarData(getRaceCalendarList.data, calendarItems, "")
      );
    }
  }, [getRaceCalendarList.data, calendarItems]);

  const handleCalendarFilterChange = (value: string) => {
    // logic to toggle checkbox in my calendar filter
    const index = calendarItems.findIndex((item) => item === value);
    if (index > -1) {
      setCalendarItems(calendarItems.filter((_, i) => i !== index));
    } else {
      setCalendarItems([...calendarItems, value]);
    }
    // end logic to toggle checkbox in my calendar filter
  };

  const exportCalendar = async () => {
    // const startDate = moment(monthChange, "MMM DD, YYYY").startOf('month').format("YYYY-MM-DD");
    // const endDate = moment(monthChange, "MMM DD, YYYY").endOf('month').format("YYYY-MM-DD");
    const response = await axiosCallBlob.post(
      `${process.env.API_BASE_URL}/Sports/ExportRaceCalendarList`,
      {
        startDate: startDate,
        endDate: endDate,
        sportID: sportID,
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `CalendarExport-${moment().format("DD-MM-YYYY")}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    // Clean up
    if (link.parentNode) link.parentNode.removeChild(link);
  };

  return (
    <>
      {/* Component for calendar create menu popup */}
      <CalendarCreateDialog
        openDialog={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        handleMenuSelect={handleCreateItemSelect}
      />
      {/* Component for calendar create/update forms */}
      <SlideRaceCalendar
        open={drawerOpen}
        onClose={handleEditDrawerClose}
        title={drawerTitle}
        editData={getRaceCalendarByID}
        date={date}
        setDate={setDate}
      />
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          marginTop: 1,
          padding: 1,
          borderRadius: "8px",
          borderBottomLeftRadius: expanded ? "0" : "8px",
          borderBottomRightRadius: expanded ? "0" : "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          <Typography
            variant="subtitle1"
            className="bukra-semi-bold"
            sx={{
              padding: 1,
              fontSize: 18,
              color: "#008755",
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {(module === "staff" && checkAccess(USER_PERMISSION.RaceCalendarView)) ||
              (module === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarView)) ||
              (module !== "staff" && module !== "athlete") ? <CustomButton
              sx={{
                marginRight: 2,
                backgroundColor: "#0087551A",
                borderRadius: "6px",
                fontWeight: 500,
                height: "29px",
              }}
              label="Export to Excel"
              variant="outlined"
              size="small"
              ButtonIcon={XlsSVG}
              iconPosition="start"
              onClick={(e: any) => {
                e.stopPropagation();
                exportCalendar();
              }}
            /> : null}
            {(module === "staff" && checkAccess(USER_PERMISSION.RaceCalendarAdd)) ||
              (module === "athlete" && checkAccess(USER_PERMISSION.RaceCalendarAdd)) ||
              (module !== "staff" && module !== "athlete") ? <CustomButton
              sx={{
                marginRight: 2,
                borderRadius: "6px",
                fontWeight: 500,
                height: "29px",
              }}
              label="Create"
              variant="contained"
              size="small"
              ButtonIcon={PlusSVG}
              iconPosition="end"
              onClick={(e: any) => {
                e.stopPropagation();
                handleCreateClick();
              }}
              tooltip="Add new activities"
            /> : null}
            {expanded && (
              <span onClick={onClick}>
                <ExpandMoreIcon sx={{ cursor: "pointer" }} />
              </span>
            )}
          </Box>
        </Box>
        <Box sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} sx={{ cursor: "pointer" }}>
              <CustomFullCalendar
                teamID={sportID}
                setID={setID}
                isEdit={setDrawerOpen}
                events={calendarData}
                monthChange={monthChange}
                setMonthChange={setMonthChange}
                setOpen={setOpenDialog}
                setValue={setValue}
                filter={filter}
                setfilter={setfilter}
                setFilterData={setFilterData}
                value={value}
                setDate={setDate} // this date should be populated in create form
                editData={getRaceCalendarByID}
                isView={isView}
                setView={setView}
                calendarItems={calendarItems}
                setCalendarItems={setCalendarItems}
                moduleType={module}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CalendarSection;
