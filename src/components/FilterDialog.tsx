import React, { useEffect, useState } from "react";
import {
  Popover,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
} from "@mui/material";
import CheckboxIcon from "../../public/svg/Checkbox.svg";
import CheckedIcon from "@mui/icons-material/CheckBox";
import { capitalize } from "lodash";
import _ from "lodash";
interface FilterDialogProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onApply: (selectedFilters: string[]) => void;
  options: string[];
  localStorageKey: string;
  setRowsPerPage?: any;
  setPage?: any;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  anchorEl,
  onClose,
  onApply,
  options,
  localStorageKey,
  setRowsPerPage,
  setPage,
}) => {
  // Retrieve from localStorage or set to all options if localStorage is empty
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [reset, setReset] = useState(false);

  // Check if all options are selected
  const allSelected =
    options.length > 0 && selectedFilters.length === options.length;

  const handleToggle = (value: string) => {
    const currentIndex = selectedFilters.indexOf(value);
    const newSelectedFilters = [...selectedFilters];

    if (currentIndex === -1) {
      newSelectedFilters.push(value);
    } else {
      newSelectedFilters.splice(currentIndex, 1);
    }

    setSelectedFilters(newSelectedFilters);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedFilters([]); // Deselect all
    } else {
      setSelectedFilters(options); // Select all
    }
  };

  const handleApply = () => {
    onApply(selectedFilters);
    localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
    onClose();
    setPage(1);
    setRowsPerPage(10);
  };

  useEffect(() => {
    if (reset) {
      onApply(selectedFilters);
      setReset(false);
      localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
      setPage(1);
      setRowsPerPage(10);
    }
  }, [reset, selectedFilters, onApply]);

  const handleReset = () => {
    setSelectedFilters([]);
    setReset(true);
    onClose();
  };

  // Save to localStorage whenever `selectedFilters` changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
  }, [selectedFilters]);

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
      <Box p={2} maxHeight={"300px"} overflow={"scroll"} position={"relative"}>
        <Typography className="bukra" fontSize={12}>
          Filter by
        </Typography>
        <FormGroup>
          <FormControlLabel
            className="dubai-regular"
            control={
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                sx={{ borderRadius: "4px" }}
              />
            }
            label="Select All"
          />
          {!_.isEmpty(options) &&
            options.map((role) => (
              <FormControlLabel
                key={role}
                className="dubai-regular"
                control={
                  <Checkbox
                    checked={selectedFilters.indexOf(role) !== -1}
                    onChange={() => handleToggle(role)}
                    sx={{ borderRadius: "4px" }}
                  />
                }
                label={capitalize(
                  role === "notStarted"
                    ? "Yet to Start"
                    : role === "inprogress"
                    ? "In Progress"
                    : role === "completed"
                    ? "completed"
                    : role === "fitToPlay"
                    ? "fit To Play"
                    : role === "notFit"
                    ? "not Fit"
                    : role
                )}
              />
            ))}
        </FormGroup>
        <Box
          display="flex"
          justifyContent="flex-end"
          position={"sticky"}
          bottom={-18}
          bgcolor={"#FFFFFF"}
          zIndex={999}
          py={1}
        >
          <Button
            onClick={handleReset}
            variant="outlined"
            color="error"
            disabled={selectedFilters.length === 0}
            className="text-capitalize dubai-med"
            data-testid="Close"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            color="success"
            style={{ marginLeft: "8px" }}
            className="text-capitalize dubai-med"
            disabled={selectedFilters.length === 0}
            data-testid="filter-button"
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterDialog;
