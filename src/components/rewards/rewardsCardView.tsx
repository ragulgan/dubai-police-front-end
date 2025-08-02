import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import Stack from "@mui/material/Stack";
import CalendarGrey from "../../../public/CalendarGrey.svg";
import EditIcon from "../../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ReusableDeleteDialog from "../Fields/ReusableDeleteDialog";
import SlideRewardDrawer from "@/pages/teams/[teamID]/rewards/edit/slideRewardDrawer";
import {
  deleteRewards,
  clearRewardsDeleteState,
} from "@/redux/slices/rewards/rewardsDeleteSlice";
import { listRewards } from "@/redux/slices/rewards/rewardsListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearEditState } from "@/redux/slices/rewards/rewardsEditSlice";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface RewardsProps {
  rewardsList: any;
  filterData?: any;
  teamID?: any;
  setIsUpdated?: any;
}

const RewardsCardView: React.FC<RewardsProps> = ({
  rewardsList,
  filterData,
  teamID,
  setIsUpdated,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const getCurrentSport = getLocalStorage("sport");
  const [isEditData, setisEditData] = useState(null);
  const [isOpenEditRewards, setIsOpenEditRewards] = useState(false);
  const rewardsDelete = useSelector((state: RootState) => state.rewardsDelete);
  const hasAccess =
    checkAccess(USER_PERMISSION.RewardsView) &&
    checkAccess(USER_PERMISSION.RewardsEdit) &&
    checkAccess(USER_PERMISSION.RewardsDelete);

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
    dispatch(clearEditState());
  };
  const isMobile = useMediaQuery("(max-width:768px)");

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
      <Box p={{ xs: 3 }} pt={0}>
        <Grid container spacing={2} sx={{justifyContent: isMobile ? "center": ""}}>
          {rewardsList &&
            rewardsList.data.map((reward: any, index: any) => (
              <Grid item key={index}>
                <Card
                  sx={{
                    width: 345,
                    height:
                      checkAccess(USER_PERMISSION.RewardsView) ||
                      checkAccess(USER_PERMISSION.RewardsEdit) ||
                      checkAccess(USER_PERMISSION.RewardsDelete)
                        ? "349px"
                        : "300px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 135, 85, 1)",
                    boxShadow: "none",
                    p: 1,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        width="294px"
                        height="92px"
                      >
                        <Avatar
                          src={
                            reward && reward?.rewardType === "Team"
                              ? reward && reward?.sportProfile
                              : reward && reward?.athleteProfileImage
                          }
                          alt={"Player Image"}
                          sx={{
                            width: "76px",
                            height: "76px",
                            bgcolor:
                              reward && reward?.rewardType === "Team"
                                ? "rgba(177, 228, 227, 0.2)"
                                : "none",
                            border:
                              reward && reward?.rewardType === "Team"
                                ? "1px solid #008755"
                                : "none",
                          }}
                          imgProps={{
                            style: {
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            },
                          }}
                        />
                        <Avatar
                          src={"/rewards/rewards-trophy-img.svg"}
                          alt={"Trophy Image"}
                          sx={{ width: "51px", height: "51px" }}
                        />
                      </Box>
                    </Stack>
                    <Box>
                      <Tooltip
                        title={
                          reward && reward?.rewardType === "Team"
                            ? `${reward && reward?.sportName} Team`
                            : `${reward.athleteFirstName} ${reward.athleteMiddleName} ${reward.athleteSurName}`
                        }
                      >
                        <Typography
                          className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
                          sx={{
                            fontSize: "16px",
                            lineHeight: "18px",
                            color: "rgba(0, 0, 0, 1)",
                          }}
                          mb={1}
                        >
                          {reward && reward?.rewardType === "Team"
                            ? `${reward && reward?.sportName} Team`
                            : `${reward.athleteFirstName} ${reward.athleteMiddleName} ${reward.athleteSurName}`}
                        </Typography>
                      </Tooltip>
                      <Typography
                        className="bukra webkit-line-clamp webkit-1"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "17px",
                          color: "rgba(88, 88, 91, 1)",
                        }}
                        mb={2}
                      >
                        {reward && reward?.rewardName ? (
                          reward?.rewardName
                        ) : (
                          <>&nbsp;</>
                        )}
                      </Typography>
                      <Typography
                        className="dubai-regular webkit-line-clamp webkit-2"
                        sx={{
                          fontSize: "16px",
                          lineHeight: "20.8px",
                          color: "rgba(88, 88, 91, 1)",
                          height: "42px",
                        }}
                      >
                        {
                          <RenderHtmlContent
                            content={reward && reward?.remarks}
                          />
                        }
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignContent={"flex-start"}
                        mt={1.5}
                      >
                        <CalendarGrey width={"20px"} height={"20px"} />
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: "24px",
                            color: "#58585B",
                            textAlign: "left",
                            marginRight: "3px",
                            marginLeft: "5px",
                          }}
                          className="dubai-regular"
                        >
                          {reward && reward?.dateOfAward ? (
                            reward?.dateOfAward
                          ) : (
                            <>&nbsp;</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent={
                        hasAccess ? "space-between" : "flex-start"
                      }
                      spacing={hasAccess ? 0.25 : 2}
                      mt={5}
                    >
                      {checkAccess(USER_PERMISSION.RewardsView) ? (
                        <Tooltip title={"View"}>
                          <IconButton
                            sx={{
                              backgroundColor: "#008755",
                              color: "white",
                              borderRadius: 1,
                              "&:hover": {
                                backgroundColor: "darkgreen",
                              },
                              width: "93px",
                              padding: "4px 4px",
                              height: "40px",
                            }}
                            onClick={() => {
                              router.push(
                                `/teams/${getCurrentSport}/rewards/view/${
                                  reward && reward?.rewardsID
                                }`
                              );
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {checkAccess(USER_PERMISSION.RewardsEdit) ? (
                        <Tooltip title={"Edit"}>
                          <IconButton
                            sx={{
                              backgroundColor: "transparent",
                              color: "#008755",
                              border: "1px solid #008755",
                              borderRadius: 1,
                              "&:hover": {
                                backgroundColor: "#fff",
                              },
                              width: "93px",
                              padding: "4px 4px",
                              height: "40px",
                            }}
                            className="dubai-med"
                            onClick={() =>
                              handleEditData(reward && reward?.rewardsID)
                            }
                          >
                            <EditIcon width={"18px"} height={"18px"} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {checkAccess(USER_PERMISSION.RewardsDelete) ? (
                        <ReusableDeleteDialog
                          css={true}
                          title={`Reward`}
                          confirmationMessage="Are you sure, Do you want to delete?"
                          successMessage="Reward Deleted Successfully"
                          width="18px"
                          height="18px"
                          minHeight="none"
                          icon={<DeleteIcon />}
                          revertMessage={`Once the Reward is deleted, you cannot not revert.`}
                          deleteAction={(payload: any) =>
                            dispatch(
                              deleteRewards({
                                url: "/DeleteRewardsByID",
                                payload,
                              })
                            )
                          }
                          fetchAfterDelete={() => {
                            const payload = {
                              ...filterData,
                              searchText: "",
                              filteredBy: "",
                              paginationIndex: 0,
                              paginationCount: 0,
                              sportID: Number(teamID),
                            };
                            dispatch(
                              listRewards({
                                url: "/GetRewardsList",
                                payload: payload,
                              })
                            );
                          }}
                          deleteResponse={rewardsDelete}
                          clearDeleteState={() =>
                            dispatch(clearRewardsDeleteState())
                          }
                          payload={{
                            rewardsID: reward && reward?.rewardsID,
                          }}
                        />
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default RewardsCardView;
