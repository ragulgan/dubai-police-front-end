import { Avatar, Box, Chip, Tooltip, Typography } from "@mui/material";
import SportChip from "../chips/SportChip";
import CalendarGrey from "../../../public/CalendarGrey.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import CustomIconButton from "../buttons/CustomIconButton";
import { useEffect, useState } from "react";
import EditResearchFacilitiesSlider from "./edit/editResearchAndFacilitiesSlider";
import { useDispatch, useSelector } from "react-redux";
import { editResearchAndFacilities } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { useRouter } from "next/router";
import MoreChip from "../chips/MoreChip";
import ReusableDeleteDialog from "../Fields/ReusableDeleteDialog";
import {
  clearResearchDeleteState,
  deleteResearch,
} from "@/redux/slices/researchFacilities/researchDeleteSlice";
import { RootState } from "@/redux/store";
import { listResearch } from "@/redux/slices/researchFacilities/researchListSlice";
import TitleTypography from "../typography/TitleTypography";
import CardDescriptionTypography from "../typography/CardDescriptionTypography";
import { getCreatedByName } from "./utils";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { CustomTooltip } from "../tooltip/TooltipIcon";

type ResearchCardProps = {
  data: any;
  tabValue: any;
  setIsUpdated: any;
};

const ResearchCard: React.FC<ResearchCardProps> = ({
  data,
  tabValue,
  setIsUpdated,
}) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const [isEditData, setisEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const researchDelete = useSelector(
    (state: RootState) => state.deleteResearch
  );

  const handleEdit = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (tabValue === "research") {
        const payload = {
          researchID: Number(isEditData),
        };
        dispatch(
          editResearchAndFacilities({
            url: "/GetResearchByID",
            payload: payload,
          })
        );
      }
    }
  }, [isOpen]);

  const handleView = (id: any) => {
    // if (tabValue === "research") {
    router.push(`/researchAndFacilities/view/research/${id}`);
    // } else {
    //   router.push(`/researchAndFacilities/facilities/view/${id}`);
    // }
  };

  return (
    <>
      {isOpen && (
        <EditResearchFacilitiesSlider
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          isEditData={isEditData}
          setIsUpdated={setIsUpdated}
          module={tabValue}
        />
      )}
      <Box
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#008755",
          borderRadius: 1,
          padding: 3,
          backgroundColor: "#FFFEFA",
          height: "303px",
        }}
      >
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
                    maxHeight: data.sportsList.length > 8 ? "220px" : "auto",
                    overflowY: data.sportsList.length > 8 ? "auto" : "visible",
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
        <TitleTypography text={data?.researchTitle} />
        <CardDescriptionTypography text={data?.shortDescription} />
        <Typography
          sx={{
            marginTop: 2,
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "12px",
            color: "#58585B",
          }}
          className="dubai-med"
        >
          {"Created by"}
        </Typography>
        <Box mt={1} display={"flex"} alignItems={"center"}>
          <Avatar
            src={"/path-to-user-image.jpg"}
            sx={{ width: "24px", height: "24px", bgcolor: "#58585B" }}
            className="dubai-med"
          />
          <Typography
            className="bukra-semi-bold"
            fontSize={"10px"}
            lineHeight={"15px"}
            fontWeight={600}
            sx={{ ml: 1 }}
          >
            {getCreatedByName(data)}
          </Typography>
          <Typography
            className="dubai-regular"
            fontSize={"12px"}
            lineHeight={"18px"}
            fontWeight={400}
            sx={{ ml: 1 }}
          >
            {`(Admin)`}
          </Typography>
        </Box>
        <Box mt={2} display={"flex"} alignItems={"center"}>
          <CalendarGrey />
          <Typography
            className="dubai-regular"
            fontSize={"16px"}
            lineHeight={"16px"}
            color={"#58585B"}
            ml={1}
          >
            {data?.createdDate}
          </Typography>
        </Box>
        <Box borderTop={"1px solid #008755"} mt={2} />
        <Box
          sx={{
            padding: 0,
            paddingTop: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent:
              checkAccess(USER_PERMISSION.ResearchFacilitiesView) &&
              checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) &&
              checkAccess(USER_PERMISSION.ResearchFacilitiesDelete)
                ? "space-between"
                : "flex-start",
            gap:
              checkAccess(USER_PERMISSION.ResearchFacilitiesView) &&
              checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) &&
              checkAccess(USER_PERMISSION.ResearchFacilitiesDelete)
                ? 1
                : 2,
          }}
        >
          {checkAccess(USER_PERMISSION.ResearchFacilitiesView) ? (
            <CustomIconButton
              sx={{
                backgroundColor: "#008755",
                color: "#FFFFFF",
                width: "110px",
                height: "48px",
              }}
              icon={VisibilityIcon}
              onClick={() => handleView(data && data?.researchID)}
              isSelected={false}
              margin={false}
            />
          ) : null}
          {checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) ? (
            <CustomIconButton
              sx={{
                backgroundColor: "transparent",
                color: "#008755",
                width: "110px",
                height: "48px",
              }}
              icon={EditIcon}
              onClick={() =>
                handleEdit(
                  data && data?.researchID
                  //(data && data?.facilitiesID)
                )
              }
              isSelected={false}
              margin={false}
            />
          ) : null}
          {checkAccess(USER_PERMISSION.ResearchFacilitiesDelete) ? (
            <ReusableDeleteDialog
              css={true}
              title={`Research`}
              confirmationMessage="Are you sure, Do you want to delete?"
              successMessage="Research Deleted Successfully"
              name={`${data?.researchTitle}`}
              width="18px"
              height="18px"
              icon={<DeleteIcon />}
              revertMessage={`Once the Research is deleted, you cannot not revert.`}
              deleteAction={(payload: any) =>
                dispatch(
                  deleteResearch({
                    url: "/DeleteResearchByID",
                    payload,
                  })
                )
              }
              fetchAfterDelete={() => {
                const researchListPayload = {
                  searchText: "",
                  filteredBy: "",
                  paginationIndex: 0,
                  paginationCount: 0,
                };
                dispatch(
                  listResearch({
                    url: "/GetResearchList",
                    payload: researchListPayload,
                  })
                );
              }}
              deleteResponse={researchDelete}
              clearDeleteState={() => dispatch(clearResearchDeleteState())}
              payload={{
                researchID: data && data?.researchID,
              }}
              module="research"
            />
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default ResearchCard;
