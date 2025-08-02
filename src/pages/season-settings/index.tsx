// New feature branch for season settings
import MultiSelect from "@/components/Fields/MultiSelect";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SettingsSideMenu from "@/components/settings/SettingsSideMenu";
import SeasonSettingSkeleton from "@/components/skeleton/SeasonSettingSkeleton";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { getSeasonCategoryList } from "@/redux/slices/seasonSettings/getSeasonCategorySlice";
import {
  clearUpdateSeasonCategoryState,
  updateSeasonCategoryList,
} from "@/redux/slices/seasonSettings/updateSeasonCategorySlice";
import { RootState } from "@/redux/store";
import {
  Box,
  CssBaseline,
  Grid,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import { isEmpty } from "lodash";
import SeasonCustomSelect from "@/components/Fields/SeasonCustomSelect";
import { checkIsAdmin } from "@/utils/acessscheck";
import { useRouter } from "next/router";
import TooltipIcon from "./SeasonTooltip";

const SeasonSettingsIndexPage = () => {
  const router = useRouter();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Settings",
      route: `/season-settings`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Season Settings",
      route: `/season-settings`,
      currentPage: true,
      disabled: false,
    },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const isHT1200 = useMediaQuery("(min-height:1200px)");

  const getPageContentHeight = () => {
    if (is4K) return "71.5vh";
    if (isFullHD) {
      if (isHT1200) return "72.6vh";
      return "66.4vh";
    }
    if (is3K) return "63vh";
    if (is2K) return "63.1vh";
    if (isLaptopL) return "60.5vh";
    if (isLaptop) return "71.5vh";
    if (isTab) return "71.5vh";
    return "60vh";
  };

  const headers = [
    { id: 1, width: "90px", title: "#" },
    { id: 2, width: "80px", title: "Pre Season" },
    { id: 3, width: "80px", title: "In Season" },
    { id: 4, width: "80px", title: "Off Season" },
  ];

  const [selectedSport, setSelectedSport] = useState<any>([0]);
  const memoizedSelectedSport = useMemo(() => selectedSport, [selectedSport]);

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  const getSportModify = [
    {
      sportID: 0,
      sportName: "All",
      categoryType: "All",
      sportProfile: <ScoreboardOutlinedIcon sx={{ color: "#008755" }} />,
    },
    ...(!isEmpty(getSportList.data) ? getSportList.data : []),
  ];

  const handleSportSelect = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;

    const selected = Array.isArray(value) ? value : [];

    const lastElement =
      selected.length > 0 ? selected[selected.length - 1] : null;

    if (lastElement !== 0) {
      const updatedArray = selected.filter((item) => item !== 0);
      setSelectedSport(updatedArray);
    } else if (selected.length > 1 && lastElement === 0) {
      //Keeping only the last element (0) and removing all others
      setSelectedSport([0]);
    } else {
      setSelectedSport(selected);
    }
  };

  useEffect(() => {
    if (isEmpty(selectedSport)) {
      setSelectedSport([0]);
    }
  }, [selectedSport]);

  const monthList = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // GetSeasonCategoryBySport
  const dispatch: any = useDispatch();

  const seasonCategoryList = () => {
    const usersPayload = {
      sportID: memoizedSelectedSport.join(","),
    };
    dispatch(
      getSeasonCategoryList({
        url: "/Sports/GetSeasonCategoryBySport",
        payload: usersPayload,
      })
    );
  };

  const getSeasonCategoryData = useSelector(
    (state: RootState) => state.getSeasonCategory
  );

  const updateSeasonCategoryData = useSelector(
    (state: RootState) => state.updateSeasonCategory
  );

  useEffect(() => {
    if (checkIsAdmin()) {
      seasonCategoryList();
    } else {
      router.push("/");
    }
  }, [memoizedSelectedSport]);

  const getSeasonKey = (data: string) => {
    if (data === "preSeasonStart" || data === "preSeasonEnd") {
      return "preseason";
    } else if (data === "inSeasonStart" || data === "inSeasonEnd") {
      return "inseason";
    } else if (data === "offSeasonStart" || data === "offSeasonEnd") {
      return "offseason";
    } else {
      return "";
    }
  };

  const getStartMonthValue = (
    seasonKey: string,
    season: any,
    selectedMonth: number
  ) => {
    if (
      seasonKey === "preSeasonStart" ||
      seasonKey === "inSeasonStart" ||
      seasonKey === "offSeasonStart"
    ) {
      return selectedMonth;
    } else if (seasonKey === "preSeasonEnd") {
      return season?.preSeasonStartMonth;
    } else if (seasonKey === "inSeasonEnd") {
      return season?.inSeasonStartMonth;
    } else if (seasonKey === "offSeasonEnd") {
      return season?.offSeasonStartMonth;
    }
  };

  const getEndMonthValue = (
    seasonKey: string,
    season: any,
    selectedMonth: number
  ) => {
    if (
      seasonKey === "preSeasonEnd" ||
      seasonKey === "inSeasonEnd" ||
      seasonKey === "offSeasonEnd"
    ) {
      return selectedMonth;
    } else if (seasonKey === "preSeasonStart") {
      return season?.preSeasonEndMonth;
    } else if (seasonKey === "inSeasonStart") {
      return season?.inSeasonEndMonth;
    } else if (seasonKey === "offSeasonStart") {
      return season?.offSeasonEndMonth;
    }
  };

  const handleSeasonMonthChange = (
    event: SelectChangeEvent<string | number>,
    season: any,
    seasonKey: string
  ) => {
    const sectionData = getSeasonKey(seasonKey);
    const startMonthValue = getStartMonthValue(
      seasonKey,
      season,
      Number(event.target.value)
    );
    const endMonthValue = getEndMonthValue(
      seasonKey,
      season,
      Number(event.target.value)
    );
    const usersPayload = {
      sportID: season?.sportID,
      section: sectionData,
      startMonth: startMonthValue,
      endMonth: endMonthValue,
    };
    dispatch(
      updateSeasonCategoryList({
        url: "/Sports/UpdSeasonCategoryBySport",
        payload: usersPayload,
      })
    );
  };

  useEffect(() => {
    if (
      updateSeasonCategoryData &&
      updateSeasonCategoryData.code === 200 &&
      updateSeasonCategoryData.status === "succeeded"
    ) {
      dispatch(clearUpdateSeasonCategoryState());
      seasonCategoryList();
    }
  }, [updateSeasonCategoryData]);

  return (
    <Box p={1} pl={0} sx={{ height: "87vh" }}>
      <CssBaseline />
      {/* menu section */}
      <SettingsSideMenu activeMenuID={3} />

      {/* main content */}
      <Box
        sx={{
          marginLeft: "215px", // this width make the space for Settings menu
          display: "flex",
          flexDirection: "column",
          height: "85vh",
        }}
      >
        {/* breadcrump */}
        <Box
          paddingTop={1.5}
          p={1.5}
          className="bg-white"
          borderRadius={1}
          flexShrink={0}
        >
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
        {/* page content */}
        <Box
          mt={1}
          className="bg-white"
          borderRadius={1}
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <Box display={"flex"}>
            <Typography
              sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
              p={2}
              className="table-list-header bukra-semi-bold header-border-right"
            >
              Season Settings
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              className="table-list-header bukra-semi-bold header-border-bottom"
            >
              <Typography
                className="text-capitalize bukra-semi-bold table-list-header"
                sx={{
                  paddingLeft: "12px",
                }}
              >
                Select Sports
              </Typography>
              {/* Dropdown at flex-start */}
              <MultiSelect
                value={selectedSport}
                onChange={handleSportSelect}
                options={getSportModify}
                disable={false}
              />
            </Box>
            <Typography
              p={2}
              sx={{ flexGrow: 2 }}
              className="table-count-header dubai-regular header-border-right"
            >
              {""}
            </Typography>
          </Box>
          {/* end of header and search section */}

          <Box
            sx={{
              paddingX: 2,
              paddingY: 2,
            }}
          >
            {getSeasonCategoryData && getSeasonCategoryData.loading ? (
              <SeasonSettingSkeleton
                sx={{
                  height: getPageContentHeight(),
                }}
              />
            ) : null}
            {Array.isArray(getSeasonCategoryData?.data) &&
            !getSeasonCategoryData.loading ? (
              <TableContainer
                id="season-table"
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(88, 88, 91, 0.2)",
                  height: getPageContentHeight(),
                  overflow: "auto",
                }}
              >
                <Table stickyHeader aria-label="team table">
                  <TableHead>
                    <TableRow>
                      {headers.map((header: any, idx: number) => (
                        <TableCell
                          key={header.id}
                          align={"left"}
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 600,
                            fontSize: "13px",
                            width: header.width,
                            p: 1.25,
                            color: "#000000",
                            borderRight:
                              idx !== headers.length - 1
                                ? "1px solid #ddd"
                                : "none", // Add border between columns
                          }}
                          className="bukra"
                        >
                          {header.title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getSeasonCategoryData?.data?.map(
                      (row: any, index: any) => (
                        <TableRow
                          key={row?.sportID}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#EDFFFC",
                            },
                          }}
                        >
                          {/* Sports title */}
                          <TableCell
                            sx={{
                              p: 1.25,
                              borderRight: "1px solid #ddd",
                              height: "97px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                              }}
                              className="dubai-med"
                            >
                              {row.sportName || "--"}
                            </Typography>
                          </TableCell>

                          {/* Preseason */}
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "rgba(0, 0, 0, 1)",
                              p: 1.25,
                              borderRight: "1px solid #ddd",
                            }}
                            className="dubai-med"
                          >
                            <Grid container spacing={0}>
                              <Grid item xs={6}>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#58585B",
                                    lineHeight: "100%",
                                    width: "100%",
                                    paddingBottom: "2px",
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                  }}
                                  className="bukra"
                                >
                                  Starting Season
                                </Typography>
                                <Box
                                  sx={{
                                    marginLeft: "0px",
                                  }}
                                >
                                  <SeasonCustomSelect
                                    module="season"
                                    value={row?.preSeasonStartMonth}
                                    options={monthList}
                                    onChange={(e) =>
                                      handleSeasonMonthChange(
                                        e,
                                        row,
                                        "preSeasonStart"
                                      )
                                    }
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={6} sx={{ whiteSpace: "nowrap" }}>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#58585B",
                                    lineHeight: "100%",
                                    width: "100%",
                                    paddingBottom: "2px",
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                  }}
                                  className="bukra"
                                >
                                  Ending Season
                                </Typography>
                                <Box>
                                  <SeasonCustomSelect
                                    module="season"
                                    value={row?.preSeasonEndMonth}
                                    options={monthList}
                                    disabledOptions={monthList
                                      .filter(
                                        (month) =>
                                          month.value < row?.preSeasonStartMonth
                                      )
                                      .map((month) => month.value)}
                                    error={
                                      row?.preSeasonEndMonth <
                                      row?.preSeasonStartMonth
                                    }
                                    onChange={(e) =>
                                      handleSeasonMonthChange(
                                        e,
                                        row,
                                        "preSeasonEnd"
                                      )
                                    }
                                  />
                                  {row?.preSeasonEndMonth < row?.preSeasonStartMonth && (
                                    <Box style={{ marginTop: "6px", display: "inline-flex" }}>
                                      <TooltipIcon tooltipMsg="Pre season start and end month should not overlap." />
                                    </Box>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </TableCell>

                          {/* In season */}
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "rgba(0, 0, 0, 1)",
                              p: 1.25,
                              borderRight: "1px solid #ddd",
                            }}
                            className="dubai-med"
                          >
                            <Grid container spacing={1}>
                              <Grid item xs={6} sx={{ whiteSpace: "nowrap" }}>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#58585B",
                                    lineHeight: "100%",
                                    width: "134px",
                                    paddingBottom: "2px",
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                  }}
                                  className="bukra"
                                >
                                  Starting Season
                                </Typography>
                                <SeasonCustomSelect
                                  module="season"
                                  value={row?.inSeasonStartMonth}
                                  disabledOptions={monthList
                                    .filter(
                                      (month) =>
                                        month.value <= row?.preSeasonEndMonth
                                    )
                                    .map((month) => month.value)}
                                  error={
                                    row?.inSeasonStartMonth <=
                                    row?.preSeasonEndMonth
                                  }
                                  options={monthList}
                                  onChange={(e) =>
                                    handleSeasonMonthChange(
                                      e,
                                      row,
                                      "inSeasonStart"
                                    )
                                  }
                                />
                                {row?.inSeasonStartMonth <= row?.preSeasonEndMonth && (
                                  <Box style={{ marginTop: "6px", display: "inline-flex" }}>
                                    <TooltipIcon tooltipMsg="In season start and end month should not overlap." />
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={6} sx={{ whiteSpace: "nowrap" }}>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#58585B",
                                    lineHeight: "100%",
                                    width: "134px",
                                    paddingBottom: "2px",
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                  }}
                                  className="bukra"
                                >
                                  Ending Season
                                </Typography>
                                <SeasonCustomSelect
                                  module="season"
                                  value={row?.inSeasonEndMonth}
                                  options={monthList}
                                  disabledOptions={monthList
                                    .filter(
                                      (month) =>
                                        month.value < row?.inSeasonStartMonth
                                    )
                                    .map((month) => month.value)}
                                  error={
                                    row?.inSeasonEndMonth <
                                    row?.inSeasonStartMonth
                                  }
                                  onChange={(e) =>
                                    handleSeasonMonthChange(
                                      e,
                                      row,
                                      "inSeasonEnd"
                                    )
                                  }
                                />
                                {row?.inSeasonEndMonth < row?.inSeasonStartMonth && (
                                  <Box style={{ marginTop: "6px", display: "inline-flex" }}>
                                    <TooltipIcon tooltipMsg="In season start and end month should not overlap." />
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </TableCell>

                          {/* Off season */}
                          <TableCell
                            sx={{
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "24px",
                              color: "rgba(0, 0, 0, 1)",
                              p: 1.25,
                              borderRight: "1px solid #ddd",
                            }}
                            className="dubai-med"
                          >
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#58585B",
                              }}
                              className="dubai-med"
                            >
                              <Grid container spacing={1}>
                                <Grid item xs={6} sx={{ whiteSpace: "nowrap" }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      color: "#58585B",
                                      lineHeight: "100%",
                                      width: "134px",
                                      paddingBottom: "2px",
                                      paddingTop: "10px",
                                      paddingLeft: "10px",
                                    }}
                                    className="bukra"
                                  >
                                    Starting Season
                                  </Typography>
                                  <SeasonCustomSelect
                                    module="season"
                                    value={row?.offSeasonStartMonth}
                                    disabledOptions={monthList
                                      .filter(
                                        (month) =>
                                          month.value <= row?.inSeasonEndMonth
                                      )
                                      .map((month) => month.value)}
                                    options={monthList}
                                    error={
                                      row?.offSeasonStartMonth <=
                                      row?.inSeasonEndMonth
                                    }
                                    onChange={(e) =>
                                      handleSeasonMonthChange(
                                        e,
                                        row,
                                        "offSeasonStart"
                                      )
                                    }
                                  />
                                  {row?.offSeasonStartMonth <= row?.inSeasonEndMonth && (
                                    <Box style={{ marginTop: "6px", display: "inline-flex" }}>
                                      <TooltipIcon tooltipMsg="Off season start and end month should not overlap." />
                                    </Box>
                                  )}
                                </Grid>
                                <Grid item xs={6} sx={{ whiteSpace: "nowrap" }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      color: "#58585B",
                                      lineHeight: "100%",
                                      width: "134px",
                                      paddingBottom: "2px",
                                      paddingTop: "10px",
                                      paddingLeft: "10px",
                                    }}
                                    className="bukra"
                                  >
                                    Ending Season
                                  </Typography>
                                  <SeasonCustomSelect
                                    module="season"
                                    value={row?.offSeasonEndMonth}
                                    options={monthList}
                                    disabledOptions={monthList
                                      .filter(
                                        (month) =>
                                          month.value < row?.offSeasonStartMonth
                                      )
                                      .map((month) => month.value)}
                                    error={
                                      row?.offSeasonEndMonth <
                                      row?.offSeasonStartMonth
                                    }
                                    onChange={(e) =>
                                      handleSeasonMonthChange(
                                        e,
                                        row,
                                        "offSeasonEnd"
                                      )
                                    }
                                  />
                                  {row?.offSeasonEndMonth < row?.offSeasonStartMonth && (
                                    <Box style={{ marginTop: "6px", display: "inline-flex" }}>
                                      <TooltipIcon tooltipMsg="Off season start and end month should not overlap." />
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SeasonSettingsIndexPage;
