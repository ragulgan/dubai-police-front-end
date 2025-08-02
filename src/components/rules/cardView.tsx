import { useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarGrey from "../../../public/CalendarGrey.svg";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { useRouter } from "next/router";
import EditSlider from "./edit/editSlider";
import { editRules } from "@/redux/slices/rules/RulesEditSlice";
import { useDispatch } from "react-redux";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import SportChip from "../chips/SportChip";
import { CustomTooltip } from "../tooltip/TooltipIcon";

const CardView = (props: any) => {
  const { tabValue, data, setIsUpdated } = props;
  const router = useRouter();
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();

  const handleView = (id: any) => {
    if (tabValue === "rules") {
      router.push(`/rules/view/${id}`);
    } else {
      router.push(`/rules/mous/view/${id}`);
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
      if (tabValue === "rules") {
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
        height={tabValue === "rules" ? "332px" : "242px"}
        borderRadius={"8px"}
        bgcolor={"#FFFEFA"}
        sx={{ width: "412px" }}
      >
        {data && data?.sportsList && data?.sportsList.length === 0 ? (
          <>&nbsp;</>
        ) : (
          <>
            {tabValue === "rules" ? (
              <Box display={"flex"} alignItems={"center"}>
                {data && data.sportsList && data.sportsList.length > 0 ? (
                  data.sportsList
                    .slice(0, 2)
                    .map((item: any) => (
                      <SportChip
                        sportName={item?.sportName}
                        sportImageUrl={item?.sportProfile}
                      />
                    ))
                ) : (
                  <>&nbsp;</>
                )}
                {data?.sportsList?.length > 2 && (
                  <CustomTooltip
                    title={
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: 8,
                          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                          padding: "8px 0",
                          maxHeight:
                            data.sportsList.length > 8 ? "220px" : "auto",
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
            ) : null}
          </>
        )}
        <Box
          className="bukra-semi-bold webkit-line-clamp webkit-1 text-capitalize"
          fontSize={"16px"}
          fontWeight={600}
          mt={2}
        >
          {data && !isEmpty(data?.title) ? data?.title : <>&nbsp;</>}
        </Box>
        <Box
          className="dubai-regular webkit-line-clamp webkit-2"
          fontSize={"16px"}
          fontWeight={400}
          mt={2}
          height={"45px"}
        >
          {data && !isEmpty(data?.shortDescription || data?.intentOfMou) ? (
            data?.shortDescription ? (
              <RenderHtmlContent content={data?.shortDescription} />
            ) : (
              <RenderHtmlContent content={data?.intentOfMou} />
            )
          ) : (
            <>&nbsp;</>
          )}
        </Box>
        {tabValue === "rules" ? (
          <>
            <Box
              className="dubai-regular"
              fontSize={"12px"}
              fontWeight={400}
              mt={2}
              color={"#58585B"}
            >
              Created by
            </Box>
            <Box mt={1} display={"flex"} alignItems={"center"}>
              <Avatar
                src={"/path-to-user-image.jpg"}
                sx={{ width: "24px", height: "24px", bgcolor: "#58585B" }}
                className="dubai-med"
              />
              <Typography
                className="bukra-semi-bold"
                fontSize={"12px"}
                fontWeight={600}
                sx={{ ml: 1 }}
              >
                Dubai Police Team <span className="bukra">(Admin)</span>
              </Typography>
            </Box>
          </>
        ) : null}
        <Box mt={2} display={"flex"} alignItems={"center"}>
          <CalendarGrey />
          <Typography
            className="dubai-regular"
            fontSize={"16px"}
            color={"#58585B"}
            ml={1}
          >
            {tabValue === "rules"
              ? data?.createdBy
              : `${data?.fromDate} - ${data?.toDate}`}
          </Typography>
        </Box>
        <Grid container spacing={1} mt={0.5}>
          <Grid item xs={12} borderTop={"1px solid #008755"} ml={1} />
          <Grid item xs={6}>
            {(tabValue === "rules" &&
              checkAccess(USER_PERMISSION.RulesAgreementsView)) ||
            (tabValue !== "rules" &&
              checkAccess(USER_PERMISSION.MousPartnershipView)) ? (
              <Button
                variant={"contained"}
                sx={{ width: "100%", height: "48px" }}
                className="text-capitalize dubai-med"
                startIcon={<RemoveRedEyeOutlinedIcon />}
                onClick={() =>
                  handleView(
                    (data && data?.rulesAndAgreementsID) ||
                      (data && data?.mouAndPartnershipID)
                  )
                }
              >
                View
              </Button>
            ) : null}
          </Grid>
          <Grid item xs={6}>
            {(tabValue === "rules" &&
              checkAccess(USER_PERMISSION.RulesAgreementsEdit)) ||
            (tabValue !== "rules" &&
              checkAccess(USER_PERMISSION.MousPartnershipEdit)) ? (
              <Button
                variant={"outlined"}
                sx={{ width: "100%", height: "48px" }}
                className="text-capitalize dubai-med"
                startIcon={<EditOutlinedIcon />}
                onClick={() =>
                  handleEdit(
                    (data && data?.rulesAndAgreementsID) ||
                      (data && data?.mouAndPartnershipID)
                  )
                }
              >
                Edit
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CardView;
