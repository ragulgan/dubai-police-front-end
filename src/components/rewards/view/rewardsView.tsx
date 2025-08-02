import { Avatar, Box, Card, Grid, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CustomEditButton from "@/components/buttons/CustomEditButton";
import EditIcon from "../../../../public/team-requirements/EditPenTeamOverview.svg";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import MenuIcon from "@mui/icons-material/Menu";
import SlideRewardDrawer from "@/pages/teams/[teamID]/rewards/edit/slideRewardDrawer";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editRewards } from "@/redux/slices/rewards/rewardsEditSlice";
import RenderHtmlContent from "@/components/common/RenderHtmlContent";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { isArray } from "lodash";

const RewardsView = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { id, teamID } = router.query;
  const [isEditData, setisEditData] = useState(null);
  const [isOpenEditRewards, setIsOpenEditRewards] = useState(false);
  const rewardsEditresponse = useSelector((state: any) => {
    return state.rewardsEdit;
  });
  const [isUpdated, setIsUpdated] = useState(false);

  const handleEditData = (id: any) => {
    setisEditData(id);
    setIsOpenEditRewards(true);
  };

  const handleCloseEdit = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpenEditRewards(false);
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.RewardsView)) {
      if (id && teamID) {
        const payload = {
          rewardsID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(editRewards({ url: "/GetRewardsByID", payload: payload }));
        setIsUpdated(false);
      }
    } else {
      router.push("/");
    }
  }, [id, isUpdated]);

  return (
    <>
      {isOpenEditRewards && (
        <SlideRewardDrawer
          open={isOpenEditRewards}
          onClose={(event: any, reason: any) => handleCloseEdit(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
        />
      )}
      {rewardsEditresponse && rewardsEditresponse?.loading && (
        <Box p={2} bgcolor={"#FFFFFF"}>
          <Skeleton
            variant="rectangular"
            height={350}
            animation="wave"
            sx={{ borderRadius: "6px" }}
          />
          <Box display={"flex"} mt={2} gap={2}>
            <Box width={"50%"}>
              <Skeleton
                variant="rectangular"
                height={200}
                animation="wave"
                sx={{ borderRadius: "6px" }}
              />
            </Box>
            <Box width={"50%"}>
              <Skeleton
                variant="rectangular"
                height={200}
                animation="wave"
                sx={{ borderRadius: "6px" }}
              />
            </Box>
          </Box>
        </Box>
      )}
      {rewardsEditresponse && !rewardsEditresponse?.loading && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                borderRadius={"8px"}
                // height={"325px"}
                sx={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
                    height:{xs: "400px", sm: "325px"}
                }}
                p={2}
                position={"relative"}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    paddingRight: "3px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                >
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        fontSize: "32px",
                        lineHeight: "38.4px",
                        color: "#FFFFFF",
                        textAlign: "left",
                      }}
                      className="bukra"
                    >
                      {rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0]?.rewardName}
                    </Typography>
                  </Grid>

                  {checkAccess(USER_PERMISSION.RewardsEdit) ? (
                    <Grid item xs={4} textAlign={"right"}>
                      <CustomEditButton
                        sx={{
                          marginRight: 1,
                          backgroundColor: "transparent",
                          fontSize: "16px",
                          border: "1px solid #FFFFFF",
                          color: "#FFFFFF",
                        }}
                        label="Edit"
                        variant="outlined"
                        size="large"
                        ButtonIcon={EditIcon}
                        iconPosition="start"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleEditData(id);
                        }}
                        module="news"
                      />
                    </Grid>
                  ) : null}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "left",
                        gap: "20px",
                      }}
                    >
                      <Avatar
                        src={
                          rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.rewardType === "Team"
                            ? rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.sportProfile
                            : rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.athleteProfileImage
                        }
                        alt={"Player Image"}
                        sx={{
                          width: "72px",
                          height: "72px",
                          bgcolor:
                            rewardsEditresponse &&
                              rewardsEditresponse?.data &&
                              rewardsEditresponse?.data[0]?.rewardType === "Team"
                              ? "#FFFFFF"
                              : "none",
                          border: "1px solid #FFFFFF",
                        }}
                        imgProps={{
                          style: {
                            objectFit: "cover",
                            width: "70%",
                            height: "70%",
                          },
                        }}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                        width="226px"
                        height="19px"
                        gap="4px"
                        paddingTop={"3px"}
                      >
                        <Typography
                          className="bukra"
                          sx={{
                            color: "#FFFFFF",
                            fontSize: "20px",
                            lineHeight: "24px",
                            marginBottom: "5px",
                          }}
                        >
                          {rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.rewardType === "Team"
                            ? "Team"
                            : rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.athleteRank}
                        </Typography>
                        <Typography
                          className="bukra"
                          sx={{
                            color: "#FFFFFF",
                            fontSize: "24px",
                            width: "100%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.rewardType === "Team"
                            ? `${rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.sportName
                            } Team`
                            : `${rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.athleteFirstName
                            } ${rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.athleteMiddleName
                            } ${rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            rewardsEditresponse?.data[0]?.athleteSurName
                            }`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Typography
                        className="bukra"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "15px",
                          lineHeight: "22.95px",
                        }}
                      >
                        Date of Award
                      </Typography>
                      <Typography
                        className="dubai-regular"
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "15px",
                          lineHeight: "22.95px",
                        }}
                      >
                        {rewardsEditresponse &&
                          rewardsEditresponse?.data &&
                          rewardsEditresponse?.data[0]?.dateOfAward}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="column" spacing={2}>
                      <Typography
                        px={2}
                        py={2}
                        borderRadius={"8px"}
                        width="fit-content"
                        className="bukra"
                        sx={{
                          fontSize: "15px",
                          lineHeight: "22.95px",
                          color: "#FFFFFF",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        Total Rewards
                        <Typography
                          className="bukra"
                          pt={1}
                          sx={{
                            fontSize: "15px",
                            lineHeight: "22.95px",
                            color: "#FFFFFF",
                          }}
                        >
                          {(rewardsEditresponse &&
                            rewardsEditresponse?.data &&
                            isArray(rewardsEditresponse?.data) &&
                            rewardsEditresponse?.data.length > 0 &&
                            rewardsEditresponse?.data[0]?.totalRewards) ||
                            "--"}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={0.1}>
            <Grid item xs={12} sm={6} md={6}>
              <Card
                sx={{ height: "300px", overflow: "scroll", boxShadow: "none" }}
              >
                <CardContent>
                  <Box display={"flex"} pb={1}>
                    <Box
                      component="span"
                      sx={{
                        color: "#008755",
                      }}
                    >
                      <MenuIcon width={"30px"} height={"30px"} />
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "18px",
                        lineHeight: "19px",
                        paddingLeft: "5px",
                        color: "#008755",
                        paddingTop: "4px",
                      }}
                      className="bukra-semi-bold"
                    >
                      {" "}
                      Reward Details
                    </Box>
                  </Box>
                  <Box pb={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#58585B",
                        paddingTop: "4px",
                      }}
                      className="bukra"
                    >
                      {rewardsEditresponse?.data?.[0]?.raceOrEventSection ===
                        "event"
                        ? "Race/Event"
                        : "Competition"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      {rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0]?.raceOrEventText}
                    </Typography>
                  </Box>
                  <Box pb={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#58585B",
                        paddingTop: "4px",
                      }}
                      className="bukra"
                    >
                      Result
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      {rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0] &&
                        rewardsEditresponse?.data[0]?.result}
                    </Typography>
                  </Box>
                  <Box pb={2}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#58585B",
                        paddingTop: "4px",
                      }}
                      className="bukra"
                    >
                      Reward
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      Trophy :{" "}
                      {(rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0] &&
                        rewardsEditresponse?.data[0]?.rewardsText
                          ?.split(",")
                          .join(", ")) ||
                        "--"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      Prize Money :{" "}
                      {(rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0] &&
                        rewardsEditresponse?.data[0]?.prizeMoney) ||
                        "--"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      Other :{" "}
                      {(rewardsEditresponse &&
                        rewardsEditresponse?.data &&
                        rewardsEditresponse?.data[0] &&
                        rewardsEditresponse?.data[0]?.otherOption) ||
                        "--"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card
                sx={{ height: "300px", overflow: "scroll", boxShadow: "none" }}
              >
                <CardContent>
                  <Box display={"flex"} pb={1}>
                    <Box
                      component="span"
                      sx={{
                        color: "#008755",
                      }}
                    >
                      <MenuIcon width={"30px"} height={"30px"} />
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "18px",
                        lineHeight: "19px",
                        paddingLeft: "5px",
                        color: "#008755",
                        paddingTop: "4px",
                      }}
                      className="bukra-semi-bold"
                    >
                      {" "}
                      Remarks
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      paddingRight: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        lineHeight: "22.95px",
                        paddingLeft: "5px",
                        color: "#69696C",
                        paddingTop: "4px",
                      }}
                      className="dubai-regular"
                    >
                      <RenderHtmlContent
                        content={
                          rewardsEditresponse &&
                          rewardsEditresponse?.data &&
                          rewardsEditresponse?.data[0]?.remarks
                        }
                      />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box >
      )}
    </>
  );
};

export default RewardsView;
