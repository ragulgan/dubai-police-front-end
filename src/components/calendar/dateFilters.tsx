import React, { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";

interface EventDialogProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  setFilterData?: any;
  filterData?: any;
  setfilter?: any;
  module?: any;
}

const FilterDateDialog: React.FC<EventDialogProps> = ({
  open,
  anchorEl,
  onClose,
  setFilterData,
  filterData,
  setfilter,
  module,
}) => {
  const { control } = useForm({
    defaultValues: {},
  });

  const [localStartDate, setLocalStartDate] = useState<string | null>(
    filterData?.startDate || null
  );
  const [localEndDate, setLocalEndDate] = useState<string | null>(
    filterData?.endDate || null
  );

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      setFilterData({ startDate: localStartDate, endDate: localEndDate });
      setfilter(true);
      onClose();
    }
  };

  const handleReset = () => {
    setFilterData({
      startDate: "",
      endDate: "",
    });
    setLocalStartDate(null);
    setLocalEndDate(null);
    if (module === "news") {
      setfilter(true);
    } else {
      setfilter(false);
    }
    onClose();
  };

  const dateChange = (data: any) => {
    const value = moment(data.value).format("DD/MM/YYYY");
    if (data.name === "startDate") {
      setLocalStartDate(value);
    } else if (data.name === "endDate") {
      setLocalEndDate(value);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box sx={{ width: 400 }} p={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            className="bukra race-calendar-filter textfield-label"
            sx={{ mr: 3, mt: 0.5 }}
          >
            Date
          </Typography>
          <Box width={"130px"}>
            <CustomDatePicker
              control={control}
              name="startDate"
              required={false}
              icon={true}
              minDate={moment().subtract(10, "years")}
              maxDate={
                localEndDate
                  ? moment(localEndDate, "DD/MM/YYYY")
                  : moment().add(10, "years")
              }
              defaultValue={localStartDate}
              boxmb={0.8}
              onChange={dateChange}
              placeholder="From date"
            />
          </Box>
          <Typography
            className="dubai-med textfield-label"
            sx={{ mx: 2, opacity: "60%", fontWeight: 400, mt: 0.5 }}
          >
            to
          </Typography>
          <Box width={"130px"}>
            <CustomDatePicker
              control={control}
              name="endDate"
              required={false}
              defaultValue={localEndDate}
              minDate={moment(localStartDate, "DD/MM/YYYY")}
              maxDate={moment().add(10, "years")}
              disabled={!localStartDate}
              boxmb={0.8}
              icon={true}
              onChange={dateChange}
              placeholder="End date"
            />
          </Box>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleReset}
            variant="outlined"
            color="secondary"
            className="text-capitalize dubai-med"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            style={{ marginLeft: "8px" }}
            className="text-capitalize dubai-med"
            disabled={!localStartDate || !localEndDate}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterDateDialog;
