import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import _ from "lodash";
import CustomFormControlLabel from "../Forms/CustomFormControlLabel";
import CustomCheckbox from "../checkbox/CustomCheckbox";

export default function MenuFilter(props: any) {
  const { calendarItems, setCalendarItems } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [disabled, setDisabled] = React.useState<any>(false);
  const open = Boolean(anchorEl);
  const list = ["tournaments", "trainings", "events", "reminders", "meetings"];
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    setAnchorEl(null);
  };

  const handleCalendarFilterChange = (value: string) => {
    setDisabled(true);
    const index = calendarItems.findIndex((item: any) => item === value);
    if (index > -1) {
      setCalendarItems(calendarItems.filter((_: any, i: any) => i !== index));
    } else {
      setCalendarItems([...calendarItems, value]);
    }
  };
  function formatCalendarDisplay(calendarSelected:any) {
    if (!calendarSelected || calendarSelected.length === 0) return "No items";

    if (calendarSelected.length > 4) return "All Activities";

    return calendarSelected.length > 1 
        ? `${calendarSelected[0]} +${calendarSelected.length - 1}` 
        : calendarSelected[0];
}
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{ whiteSpace: "nowrap" }}
        className="text-capitalize dubai-med"
        endIcon={<KeyboardArrowDownIcon />}
      >
     {/* {calendarItems.length > 3 ? "All Activities" : calendarItems.length ===1 ? calendarItems : calendarItems[0]  }    */}
     {formatCalendarDisplay(calendarItems)}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {list &&
          list.map((item: any) => (
            <MenuItem>
              <CustomFormControlLabel
                control={
                  <CustomCheckbox
                    checked={calendarItems.includes(item)}
                    onChange={() => {
                      handleCalendarFilterChange(item);
                    }}
                  />
                }
                label={item}
                className="dubai-med text-capitalize"
              />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
