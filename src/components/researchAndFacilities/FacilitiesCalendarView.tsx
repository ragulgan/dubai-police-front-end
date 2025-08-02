import { Box } from "@mui/material";
import ReusableFullCalendar from "../calendar/ReusableFullCalendar";
import { tranformFacilitiesCalendarData } from "@/utils/helper";
import { useRouter } from "next/router";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

type FacilitiesCalendarViewProps = {
  listFacilitiesData: any;
  setViewFacilityID: (id: number) => void;
};

const FacilitiesCalendarView: React.FC<FacilitiesCalendarViewProps> = ({
  listFacilitiesData,
  setViewFacilityID,
}) => {
  const router = useRouter();

  const handleDateSelect = (selectInfo: any) => {
    if (!selectInfo?.start) {
      return;
    }
    if (checkAccess(USER_PERMISSION.ResearchFacilitiesAdd)) {
      router.push(
        `/researchAndFacilities/create/facilities?date=${selectInfo?.startStr}`
      );
    }
  };

  const handleDatesSet = (info: any) => { };

  const handleEventClick = (clickInfo: any) => {
    if (checkAccess(USER_PERMISSION.ResearchFacilitiesView)) {
      setViewFacilityID(clickInfo.event._def.extendedProps.facilityID);
    }
  };

  return (
    <>
      <Box sx={{ padding: 1 }}>
        <ReusableFullCalendar
          events={tranformFacilitiesCalendarData(listFacilitiesData.data)}
          handleDateSelect={handleDateSelect}
          handleDatesSet={handleDatesSet}
          handleEventClick={handleEventClick}
        />
      </Box>
    </>
  );
};

export default FacilitiesCalendarView;
