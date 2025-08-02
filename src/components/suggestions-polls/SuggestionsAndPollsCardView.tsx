import { useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { useRouter } from "next/router";
import EditSlider from "./edit/editSlider";
import { editRules } from "@/redux/slices/rules/RulesEditSlice";
import { useDispatch } from "react-redux";
import SuggestionStatusChip from "./SuggestionStatusChip";
import VoteIcon from "../../../public/vote.svg";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { keyframes } from "@mui/system";
import { CustomTooltip } from "../tooltip/TooltipIcon";

const fadeScaleIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const SuggestionsAndPollsCardView = (props: any) => {
  const { tabValue, data, setIsUpdated } = props;
  const router = useRouter();
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();

  const handleView = (id: any) => {
    if (tabValue === "suggestions") {
      router.push(`/suggestions-polls/view/${id}`);
    } else {
      router.push(`/suggestions-polls/polls/view/${id}`);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleEdit = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      if (tabValue === "suggestions") {
        const payload = {
          rulesAndAgreementsID: Number(isEditData),
          section: tabValue && tabValue,
        };
        dispatch(
          editRules({ url: "/GetRulesAndAgreementsByID", payload: payload })
        );
      } else {
        const payload = {
          mouAndPartnershipID: Number(isEditData),
          section: tabValue && tabValue,
        };
        dispatch(
          editRules({ url: "/GetRulesAndAgreementsByID", payload: payload })
        );
      }
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <EditSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={tabValue}
        />
      )}
      <Box
        border={"1px solid #008755"}
        p={2}
        height={tabValue === "suggestions" ? "332px" : "332px"}
        borderRadius={"8px"}
        bgcolor={"#FFFEFA"}
      >
        {data && data?.sportsList && data?.sportsList.length === 0 ? (
          <>&nbsp;</>
        ) : (
          <Box display={"flex"} alignItems={"center"}>
            {data && !_.isEmpty(data?.sportsList)
              ? data?.sportsList?.slice(0, 3).map((item: any) => (
                <Chip
                  key={item?.sportName}
                  label={item?.sportName}
                  icon={
                    <img
                      src={item?.sportProfile}
                      style={{
                        width: "20px",
                        height: "16px",
                        paddingTop: "4px",
                        objectFit: "cover",
                      }}
                      alt={item?.sportName}
                    />
                  }
                  sx={{
                    padding: "0px",
                    fontWeight: 500,
                    fontSize: "16px",
                    backgroundColor: "rgba(0, 135, 85, 0.03)",
                    color: "#008755",
                    lineHeight: "18px",
                    height: "24px",
                    ".MuiChip-label": {
                      padding: "8px",
                    },
                    border: "1px solid #008755",
                    mr: 1,
                  }}
                  className="dubai-med webkit-line-clamp webkit-1"
                />
              ))
              : null}
            {data?.sportsList?.length > 3 && (
              <CustomTooltip
                title={
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: 8,
                      boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                      padding: "8px 0",
                      maxHeight: data.sportsList.length > 8 ? "220px" : "auto",
                      overflowY:
                        data.sportsList.length > 8 ? "auto" : "visible",
                      width: "220px",
                    }}
                  >
                    {data.sportsList
                      .slice(3)
                      .map((item: any, index: number, arr: any[]) => (
                        <div
                          key={item?.sportName}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "background 0.2s ease-in-out",
                            borderBottom:
                              index !== arr.length - 1
                                ? "1px solid #eee"
                                : "none", // ← Separator line
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor = "#f7f7f7";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor = "transparent";
                          }}
                        >
                          <img
                            src={item?.sportProfile}
                            alt={item?.sportName}
                            style={{
                              width: "18px",
                              height: "18px",
                              objectFit: "cover",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#008755",
                              fontWeight: 500,
                            }}
                            className="dubai-med"
                          >
                            {item?.sportName}
                          </span>
                        </div>
                      ))}
                  </div>
                }
              >
                <Avatar
                  sx={{
                    bgcolor: "#e0f7ec",
                    color: "#008755",
                    fontSize: "0.875rem",
                    width: 30,
                    height: 25,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  +{data?.sportsList.length - 3}
                </Avatar>
              </CustomTooltip>
            )}
          </Box>
        )}
        <Box
          className="dubai-med webkit-line-clamp webkit-2"
          fontSize={"16px"}
          fontWeight={400}
          mt={2}
          height={"45px"}
        >
          {data && !isEmpty(data?.suggestion || data?.pollsQuestion) ? (
            data?.suggestion ? (
              <RenderHtmlContent content={data?.suggestion} />
            ) : (
              <RenderHtmlContent content={data?.pollsQuestion} />
            )
          ) : (
            <>&nbsp;</>
          )}
        </Box>
        <Box
          className="dubai-med"
          fontSize={"12px"}
          fontWeight={400}
          mt={2}
          color={"#58585B"}
        >
          Created by
        </Box>
        <Box mt={1} display="flex" alignItems="center">
          <Avatar
            src={data?.createdProfileimage || "/path-to-user-image.jpg"}
            sx={{
              width: 24,
              height: 24,
              bgcolor: "rgba(0, 135, 85, 1)",
              borderColor: "rgba(0, 135, 85, 1) !important",
            }}
          />
          <Box
            sx={{
              ml: 1,
              display: "flex",
              alignItems: "center",
              maxWidth: "200px", // Adjust width as needed
            }}
          >
            <Typography
              className="bukra"
              fontSize="10px"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {data?.createdFirstname || ""}
            </Typography>
            <Typography
              className="bukra"
              fontSize="12px"
              fontWeight={500}
              sx={{ color: "#58585B", ml: 0.5, flexShrink: 0 }}
            >
              ({data?.createdByModule})
            </Typography>
          </Box>
          <Typography
            className="bukra"
            fontSize="12px"
            fontWeight={600}
            sx={{ ml: "auto" }}
          >
            <span style={{ fontWeight: 500 }}>{data?.createdDate}</span>
          </Typography>
        </Box>

        <Grid
          item
          xs={12}
          borderTop={"1px solid #008755"}
          ml={1}
          mt={2}
          mb={2}
        />
        <Box mt={1} display={"flex"} alignItems={"center"}>
          <AvatarGroup>
            {data?.topCommentsList?.length > 0
              ? data.topCommentsList.map((comment: any, index: number) => (
                <Tooltip
                  key={index}
                  title={comment?.createdUserName || "User"}
                  arrow
                  placement="top"
                >
                  <Avatar
                    src={comment?.profileImage || "/path-to-user-image.jpg"}
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "rgba(0, 135, 85, 1)",
                      border: "2px solid rgba(0, 135, 85, 1)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                      animation: `${fadeScaleIn} 0.4s ease ${index * 100
                        }ms forwards`,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              ))
              : data?.topVotersList?.length > 0
                ? data.topVotersList.map((item: any, index: number) => (
                  <Tooltip
                    key={index}
                    title={`${item?.firstName || ""} ${item?.lastName || ""}`}
                    arrow
                    placement="top"
                  >
                    <Avatar
                      src={item?.profileImage || "/path-to-user-image.jpg"}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "rgba(0, 135, 85, 1)",
                        border: "2px solid rgba(0, 135, 85, 1)",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                        animation: `${fadeScaleIn} 0.4s ease ${index * 100
                          }ms forwards`,
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                ))
                : null}
          </AvatarGroup>
          <Typography
            sx={{
              fontFamily: "Dubai",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "rgba(88, 88, 91, 1)", // Tertiary gray
              marginLeft: "8px", // Adds spacing between avatars and text
            }}
          >
            +{data.totalVoteCount || "0"} Replayed
          </Typography>
          <Box
            sx={{
              ml: "auto",
            }}
          >
            {tabValue === "suggestions" ? null : (
              <SuggestionStatusChip status={data.userVoteType} />
            )}
          </Box>
        </Box>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12}>
            {checkAccess(USER_PERMISSION.SuggestionPollsView) && (
              <Button
                variant={"contained"}
                sx={{ width: "100%", height: "48px" }}
                className="text-capitalize dubai-med"
                startIcon={
                  tabValue === "suggestions" ? (
                    <RemoveRedEyeOutlinedIcon />
                  ) : data.userVoteType === "voted" ? (
                    <RemoveRedEyeOutlinedIcon />
                  ) : data.userVoteType === "Voted" ? (
                    <RemoveRedEyeOutlinedIcon />
                  ) : (
                    <VoteIcon />
                  )
                }
                onClick={() =>
                  handleView(
                    tabValue === "suggestions"
                      ? data && data?.suggestionsID
                      : data && data?.pollsID
                  )
                }
              >
                {tabValue === "suggestions"
                  ? "View"
                  : data.userVoteType === "Voted"
                    ? "View"
                    : "Vote"}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SuggestionsAndPollsCardView;
