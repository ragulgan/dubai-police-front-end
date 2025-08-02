import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import FacilitiesTimePicker from '@/components/researchAndFacilities/add/FacilitiesTimePicker';
import moment from 'moment';
import { useSelector } from 'react-redux';

interface AddTimeSlotDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onAgree?: () => void;
  onDisagree?: () => void;
  agreeLabel?: string;
  disagreeLabel?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const AddTimeSlotDialog: React.FC<AddTimeSlotDialogProps> = ({
  open,
  onClose,
  title,
  description,
  onAgree,
  onDisagree,
  agreeLabel = "Agree",
  disagreeLabel = "Disagree",
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const a11yProps = (index: any) => ({
    id: `day-tab-${index}`,
    'aria-controls': `day-tabpanel-${index}`,
  });

  const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`day-tabpanel-${index}`}
      aria-labelledby={`day-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );

  const [currentValue, setCurrentValue] = React.useState(0);
  const theme = useTheme();

  const handleChangeTab = (event: any, newValue: any) => {
    setCurrentValue(newValue);
  };

  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      facilityType: "",
      facilityDate: null,
      startTime: "",
      endTime: "",
      purposeOfFacility: "",
      othersFacility: ""
    },
  });

  const onSubmit = (data: any) => { }

  // Add Timeslot
  const addTimeslot = useSelector((state: any) => {
    return state.addTimeslot;
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xl" // or false to remove the default max width limit
        PaperProps={{
          style: {
            width: '701px',
            height: '390px'
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" className="dubai-med"
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            background: "#58585B0D"
          }}>
          {title}
          <Box
            className="dubai-med"
            sx={{
              color: "#58585B66",
              fontSize: "13px",
              fontWeight: 400
            }}>You can add Multiple time slots as one.</Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={0} pt={3}>
            <Box
              sx={{
                width: '100%',
                borderRadius: '23px',
                overflow: 'hidden',
                bgcolor: 'background.paper', // Apply here once
                boxShadow: 1, // Optional: subtle shadow like elevation
              }}
            >
              <AppBar
                position="static"
                color="default"
                elevation={0} // No shadow, we apply our own
                sx={{ bgcolor: 'transparent' }} // Remove color from AppBar
              >
                <Tabs
                  value={currentValue}
                  onChange={handleChangeTab}
                  variant="fullWidth"
                  aria-label="days of the week tabs"
                  sx={{
                    '& .MuiTabs-indicator': { display: 'none' },
                    minHeight: '48px',
                  }}
                >
                  {days.map((day, index) => (
                    <Tab
                      key={day}
                      label={day}
                      {...a11yProps(index)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        minHeight: '48px',
                        minWidth: 80,
                        borderRadius: 0, // no extra rounding
                        bgcolor: currentValue === index ? '#008755' : 'transparent',
                        color: currentValue === index ? 'white' : 'black',
                        '&.Mui-selected': {
                          bgcolor: '#008755',
                          color: 'white',
                        },
                        borderRight: index !== days.length - 1 ? '1px solid #ddd' : 'none',
                      }}
                    />
                  ))}
                </Tabs>
              </AppBar>
            </Box>
            {days.map((day, index) => (
              <TabPanel key={index} value={currentValue} index={index} dir={theme.direction}>
                {/* {day} */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid
                    container
                    item
                    xs={12}
                    md={12}
                    spacing={2}
                    justifyContent="space-between"
                    marginTop={0.5}
                    marginBottom={1.25}
                  >
                    <Grid item xs={12} md={4}>
                      <FacilitiesTimePicker
                        control={control}
                        name="startTime"
                        label="Start"
                        boxmb={0.7}
                        required={true}
                        rules={{
                          required: "Start Time is required",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FacilitiesTimePicker
                        control={control}
                        name="endTime"
                        label="End"
                        boxmb={0.7}
                        required={true}
                        startTime={
                          watch("startTime")
                            ? moment(watch("startTime")).add(1, "hour")
                            : null
                        }
                        rules={{
                          required: "End Time is required",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FacilitiesTimePicker
                        control={control}
                        name="gapTime"
                        label="Gaps"
                        boxmb={0.7}
                        required={false}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingY: "20px"
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        marginRight: "8px",
                        height: "48px",
                        borderRadius: "4px",
                        gap: "0px",
                        fontSize: "16px",
                      }}
                      // onClick={handleCancel}
                      className="cancel-button text-capitalize dubai-med"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      sx={{
                        height: "48px",
                        borderRadius: "4px",
                        gap: "0px",
                        fontSize: "16px",
                      }}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Save
                    </Button>
                  </Box>
                </form>
              </TabPanel>
            ))}
          </Grid>
        </DialogContent>
      </Dialog >
    </>
  );
};

export default AddTimeSlotDialog;