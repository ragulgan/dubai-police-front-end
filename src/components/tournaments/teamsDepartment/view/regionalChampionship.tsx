import React, { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Card,
  Grid,
  Box,
  Typography,
  Avatar,
  Select,
  MenuItem,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import departmentCurve from "../../../../../public/departmentCurve.png";
import CountAnimation from "../../../common/CounterAnimation";
import { listSeason } from "@/redux/slices/season/SeasonListSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


interface CurrentSeasonProps {
  phases?: any;
}

const RegionalChampionshipt: React.FC<CurrentSeasonProps> = ({ phases }) => {
  const championship = "/team-department/champion.svg";
  const totalCompetition = "/team-overview/total-competitions.svg";
  const maleAthletes = "/team-overview/male-athletes.svg";
  const totalMedals = "/team-overview/medals.svg";
  const femaleAthletes = "/team-overview/female-athletes.svg";

  const router = useRouter();
  const [innerHeight, setInnerHeight] = useState<any>("");
  const [season, setSeason] = useState<any>("");
  const cardGraph = useRef<HTMLImageElement>(null);
  const dispatch: AppDispatch = useDispatch();
  // const Seasonlist = useSelector((state: RootState) => state.listSeason);

  const Seasonlist = {
    "loading": false,
    "code": 200,
    "message": "Success",
    "data": [
      {
        "seasonID": 261,
        "sportID": 1,
        "startDate": "04/04/2025",
        "endDate": "05/04/2025",
        "seasonName": "2025 Season",
        "longTermGoals": "Develop team skills and win championship",
        "seasonsMainGoal": "Improve player performance by 20%"
      },
      {
        "seasonID": 5,
        "sportID": 1,
        "startDate": "01/12/2024",
        "endDate": "31/08/2025",
        "seasonName": "Season 2024 - 2025",
        "longTermGoals": "Goals updated updated",
        "seasonsMainGoal": "Improve passing accuracy to 85%"
      },
      {
        "seasonID": 4,
        "sportID": 1,
        "startDate": "01/12/2023",
        "endDate": "31/08/2024",
        "seasonName": "Season 2023 - 2024",
        "longTermGoals": "season 2023-2024 u1",
        "seasonsMainGoal": "season 2023-2024 season g update sid 4 u4"
      },
      {
        "seasonID": 3,
        "sportID": 1,
        "startDate": "01/12/2022",
        "endDate": "31/08/2023",
        "seasonName": "Season 2022 - 2023",
        "longTermGoals": "Helloaewewewe sid 9u1",
        "seasonsMainGoal": "ltg s3 season"
      },
      {
        "seasonID": 2,
        "sportID": 1,
        "startDate": "01/12/2021",
        "endDate": "31/08/2022",
        "seasonName": "Season 2021 -2022",
        "longTermGoals": "ltg s2",
        "seasonsMainGoal": "ltg season 2"
      }
    ]
  }

  // useEffect(() => {
  //   if (teamID) {
  //     const payload = {
  //       sportID: Number(teamID),
  //     };
  //     dispatch(listSeason({ url: "/GetSeasonList", payload }));
  //   }
  // }, [teamID]);

  useEffect(() => {
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  useEffect(() => {
    if (Seasonlist && Seasonlist?.code === 200) {
      setSeason(
        Seasonlist?.data?.length > 0 ? Seasonlist.data[0].seasonID : ""
      );
      // router?.push(
      //   `/teams/${teamID}/teamOverview?seasonID=${
      //     Seasonlist && Seasonlist?.data[0] && Seasonlist?.data[0]?.seasonID
      //   }`
      // );
    }
  }, [Seasonlist]);

  return (
    <>
      <Grid container>
        {Seasonlist && Seasonlist?.loading && (
          <Card
            sx={{
              p: 2,
              boxShadow: "none",
              borderRadius: "8px",
              height: innerHeight && innerHeight,
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
            <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"200px"}
              sx={{ mt: 1, borderRadius: "20px" }}
            />
          </Card>
        )}
        <Grid
          item
          xs={12}
          md={12}
          position={"relative"}
          sx={{
            borderRadius: "10px",
            background:
              "linear-gradient(180deg, #008755 0%, #005844 100%)",
          }}
          height={"auto"}
        >
          <Image
            src={departmentCurve}
            alt="Logo"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
            }}
          />
          <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} sx={{ justifyContent: 'end', p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Box>
                  <Select
                    value={season}
                    onChange={(e) => {
                      setSeason(e.target.value);
                      // router?.push(
                      //   `/teams/${teamID}/teamOverview?seasonID=${e.target.value}`
                      // );
                    }}
                    variant="outlined"
                    sx={{
                      bgcolor: "white",
                      borderRadius: 2,
                      color: "#008755",
                      width: "214px",
                      height: "39px",
                    }}
                    className="dubai-med"
                  >
                    {Seasonlist &&
                      Seasonlist?.data &&
                      Seasonlist?.data.length > 0 &&
                      Seasonlist?.data.map((season: any) => (
                        <MenuItem
                          value={season?.seasonID}
                          className="dubai-med"
                          sx={{
                            color: "#008755",
                            fontSize: "16px",
                            lineHeight: "27.01px",
                          }}
                        >
                          {season?.seasonName}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} p={2} container>
              <Grid item xs={12} sm={12} md={7}>
                <Grid item container spacing={2} pl={1} pt={3}>
                  <Grid item md={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#009671", borderRadius: "15px", width: "340px", height: "50px" }}>
                      <Avatar
                        src={championship}
                        alt={"Total Competition"}
                        sx={{
                          width: "24px",
                          height: "24px",
                        }}
                      />
                      <Typography className="dubai-bold" sx={{ fontSize: '17px', lineHeight: '90%', color: "#ffffff", p: 0.5 }}>
                        “Regional Championship Winner 2024”
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={4}>
                    <Box>
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Avatar
                            src={totalCompetition}
                            alt={"Total Competition"}
                            sx={{
                              width: "64px",
                              height: "64px",
                              radius: "200px",
                            }}
                            variant="square"
                          />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            width="38px"
                            height="26px"
                            gap="16px"
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "32px",
                                lineHeight: "0px",
                                pb: "10px",
                              }}
                            >
                              <CountAnimation
                                value={0}
                              />
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                                lineHeight: "12px",
                              }}
                            >
                              Total Competition
                            </Typography>
                          </Box>
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={4}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "27px",
                          color: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Avatar
                            src={maleAthletes}
                            alt={"Male Athletes"}
                            sx={{
                              width: "64px",
                              height: "64px",
                              radius: "200px",
                            }}
                            variant="square"
                          />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            width="38px"
                            height="26px"
                            gap="16px"
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "32px",
                                lineHeight: "0px",
                                pb: "10px",
                              }}
                            >
                              <CountAnimation
                                value={0}
                              />
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                                lineHeight: "12px",
                              }}
                            >
                              Male Athletes
                            </Typography>
                          </Box>
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item container spacing={2} pl={1} pt={5}>
                  <Grid item md={4}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "27px",
                          color: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Avatar
                            src={totalMedals}
                            alt={"Total Medals"}
                            sx={{
                              width: "64px",
                              height: "64px",
                              radius: "200px",
                            }}
                            variant="square"
                          />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            width="38px"
                            height="26px"
                            gap="16px"
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "32px",
                                lineHeight: "0px",
                                pb: "10px",
                              }}
                            >
                              <CountAnimation
                                value={0}
                              />
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                                lineHeight: "12px",
                              }}
                            >
                              Total Medals
                            </Typography>
                          </Box>
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item md={4}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "27px",
                          color: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Avatar
                            src={femaleAthletes}
                            alt={"Female Athletes"}
                            sx={{
                              width: "64px",
                              height: "64px",
                              radius: "200px",
                            }}
                            variant="square"
                          />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            width="38px"
                            height="26px"
                            gap="16px"
                          >
                            <Typography
                              className="bukra-semi-bold"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "32px",
                                lineHeight: "0px",
                                pb: "10px",
                              }}
                            >
                              <CountAnimation
                                value={0}
                              />
                            </Typography>
                            <Typography
                              className="dubai-regular"
                              sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                                lineHeight: "12px",
                              }}
                            >
                              Female Athletes
                            </Typography>
                          </Box>
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={5}>
                <Typography className="bukra" sx={{ fontSize: '27px', lineHeight: '40.5px', fontWeight: 500, color: "#FFFFFF" }}>
                  Airport Security
                </Typography>
                {/* <Box>
                  <Accordion
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderTopRightRadius: '4px',
                      borderBottomRightRadius: '0px',
                      borderBottomLeftRadius: '0px',
                      borderTopLeftRadius: '4px',
                      width: '300px',
                      height: '39px',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowDownIcon sx={{ color: '#008755' }} />}
                      sx={{
                        minHeight: '41px',
                        px: 2,
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                        },
                      }}
                    >
                      <Typography
                        className="dubai-med"
                        sx={{
                          color: '#008755',
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '100%',
                        }}
                      >
                        View Sports Co-Ordinator Details
                      </Typography>
                    </AccordionSummary>
                    <Box sx={{ border: '1px solid #FFFFFF', width: '405px', height: '150px', borderTopRightRadius: '15px', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: -3 }}>
                      <AccordionDetails sx={{ px: 2, pb: 2 }}>
                        <Typography
                          sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                        >
                          Department Co-Ordinator:&nbsp;
                          <b>Major Ali Al Mansoori</b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                        >
                          Employee ID:&nbsp;
                          <b>DP68658</b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                        >
                          Email:&nbsp;
                          <b>airportsecurity@dubaipolice.ae</b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: '14px', color: '#FFFFFF' }}
                        >
                          Phone Number:&nbsp;
                          <b>+971 4 123 4567</b>
                        </Typography>
                      </AccordionDetails>
                    </Box>
                  </Accordion>
                </Box> */}
                <Box>
                  <Button sx={{
                    bgcolor: '#FFFFFF',
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '0px',
                    borderBottomLeftRadius: '0px',
                    borderTopLeftRadius: '4px',
                    width: '274px',
                    height: '39px',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                    '&:before': { display: 'none' },
                  }}>
                    <Typography
                      className="dubai-med"
                      sx={{
                        color: '#008755',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '100%',
                      }}
                    >
                      View Sports Co-Ordinator Details
                    </Typography>
                  </Button>
                  <Box sx={{ border: '1px solid #FFFFFF', width: '405px', height: '150px', borderTopRightRadius: '15px', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', px: 2, py: 2 }}>
                    <Typography
                      sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                    >
                      Department Co-Ordinator:&nbsp;
                      <b>Major Ali Al Mansoori</b>
                    </Typography>
                    <Typography
                      sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                    >
                      Employee ID:&nbsp;
                      <b>DP68658</b>
                    </Typography>
                    <Typography
                      sx={{ fontSize: '14px', color: '#FFFFFF', mb: 1 }}
                    >
                      Email:&nbsp;
                      <b>airportsecurity@dubaipolice.ae</b>
                    </Typography>
                    <Typography
                      sx={{ fontSize: '14px', color: '#FFFFFF' }}
                    >
                      Phone Number:&nbsp;
                      <b>+971 4 123 4567</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );

};

export default RegionalChampionshipt;

