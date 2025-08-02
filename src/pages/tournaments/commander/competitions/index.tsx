"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Button, Chip, Grid, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import AppAddButton from "@/components/buttons/AppAddButton";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import moment from "moment";
import CompetitionCardView from "@/components/commanderShield/CompetitionCardView";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarIcon from "../../../../../public/svg/calendar (12) 1.svg";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";

function Page() {
  const router = useRouter();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Commander's Shield",
      route: `/tournaments/commander`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Competitions",
      route: `/tournaments/commander`,
      currentPage: true,
      disabled: false,
    },
  ];

  const [selectedChip, setSelectedChip] = useState<string>("ongoing");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getChipStyles = (label: string) => ({
    color: selectedChip === label ? "#EFFAF9" : "#008755",
    background: selectedChip === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: selectedChip === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height: "37px",
    border: "1px solid #008755",
    borderRadius: "33px",
    width: "105px",
  });

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  // List Competition
  const getCompetitionList = useSelector((state: any) => {
    return state.getCompetitionListAPI;
  });

  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );

  const downloadAthletesExcel = async () => {
  };

  const onCalendarOpen = async () => {
  };

  // Search Expansion
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const { handleSubmit, control, setValue, reset, watch, setError, clearErrors } = useForm<any>({
    defaultValues: {
      tournamentName: "",
      selectSports: "",
      tournamentFormat: "",
      startDate: null,
      endDate: null,
      teams: ""
    },
  });

  const onSubmit = () => {
  };

  return (
    <>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",

            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => router.back()}
        />
      </Box>

      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra-semi-bold header-border-bottom"
          >
            {" "}
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>

          <AppAddButton
            label="Create Competition"
            onClick={() => router.push(`/tournaments/commander/competitions/create`)}
          />
          {/* {isOpen && (
            <SlideFullDrawer
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              module={"trainingCamp"}
              isEditData={isEditData}
            />
          )} */}
        </Box>
        <Box sx={{
          overflowY: "auto",
          height: "66.5vh"
        }}>
          <Box sx={{
            padding: "20px",
            margin: "0px"
          }}>
            <Accordion expanded={expanded} onChange={handleChange} sx={{
              boxShadow: "none",
              border: "1px solid #58585B1A",
            }}>
              <AccordionSummary
                expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  borderBottom: "1px solid #58585B1A"
                }}
              >
                <Typography component="span"
                  className="dubai-med"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 500
                  }}>Advanced Search</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <Grid
                    container
                    sx={{
                      padding: "2rem",
                      position: "relative",
                      overflow: "auto",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems={{ xs: "top", md: "center" }}
                    >
                      <Box width="100%">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Grid container spacing={2} justifyContent={"space-between"}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField
                                name="tournamentName"
                                label="Tournament Name"
                                placeholder="Enter Tournament Name"
                                control={control}
                              />
                            </Grid>
                            <Grid item xs={12} md={4} >
                              <DropDown
                                name="selectSports"
                                control={control}
                                label="Select Sports"
                                placeholder="Select Sports"
                                // options={sportsDataOption && sportsDataOption}
                                multiple={false}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <CustomTextField
                                name="tournamentFormat"
                                label="Tournament Format"
                                placeholder="Enter Tournament Format"
                                control={control}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <DropDown
                                name="teams"
                                control={control}
                                label="Select Teams"
                                placeholder="Select Teams"
                                // options={teamDataOption && teamDataOption}
                                multiple={false}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TrainingCampCustomDatePicker
                                control={control}
                                name="startDate"
                                label="Start Date"
                                boxmb={0.8}
                                minDate={moment()}
                                maxDate={moment().add(10, "years")}
                                className="Text-field-customise"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TrainingCampCustomDatePicker
                                control={control}
                                name="endDate"
                                label="End Date"
                                boxmb={0.8}
                                minDate={moment()}
                                maxDate={moment().add(10, "years")}
                                className="Text-field-customise"
                              />
                            </Grid>
                          </Grid>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: "2rem",
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              sx={{ mr: 1 }}
                              onClick={() => {
                                // closeAdd();
                              }}
                              className="cancel-button text-capitalize dubai-med season-goal-btn"
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
                              Search
                            </Button>
                          </Box>
                        </form>
                      </Box>
                    </Grid>
                  </Grid>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between" // Ensure items are spaced between flex-start and flex-end
            paddingX={"20px"}
            pb={selectedIcon === "grid" ? 0 : 2}
            flexDirection="row"
            alignItems="center"
          >
            {/* Chips at Flex-Start */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Ongoing"
                  sx={getChipStyles("ongoing")}
                // onClick={() => handleChipClick("ongoing")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="Upcoming"
                  sx={getChipStyles("upcoming")}
                // onClick={() => handleChipClick("upcoming")}
                />
              </Tooltip>
              <Tooltip title="Select training camp status">
                <Chip
                  className="dubai-med"
                  label="History"
                  sx={getChipStyles("history")}
                // onClick={() => handleChipClick("history")}
                />
              </Tooltip>
            </Stack>

            {/* Spacer for CustomIconButtons at Flex-End */}
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                className="text-capitalize dubai-med export-button"
                sx={{ mr: 2, borderRadius: "43px", height: "44px", backgroundColor: "#FFFFFF" }}
                endIcon={<XlsSVG width="25px" height="25px" />}
                onClick={downloadAthletesExcel}
              >
                Export to Excel
              </Button>
              <Button
                variant="outlined"
                className="text-capitalize dubai-med export-button"
                sx={{ borderRadius: "43px", height: "44px", backgroundColor: "#FFFFFF" }}
                endIcon={<CalendarIcon width="15px" height="15px" />}
                onClick={onCalendarOpen}
              >
                Calendar
              </Button>
            </Box>
          </Box>

          <Box sx={{
            px: 2,
            py: 2
          }}>
            <CompetitionCardView
            // data={filteredList || []}
            // isEdit={handleEditData}
            // isLoading={getTraningCampsLists.loading}
            // label={label}
            // module="athlete"
            // timeline={timeline}
            // teamID={teamID}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
