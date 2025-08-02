import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "../../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CardBg from "../../../public/CardBg.png"; // Adjust the path if necessary
import { getRoleColor, USER_PERMISSION } from "@/utils/constants";
import { isString, trim } from "lodash";
import StaffRoleChip from "./StaffRoleChip";
import { checkAccess } from "@/utils/acessscheck";

// Define the props interface
interface ProfileCardProps {
  profileImage?: string;
  rank?: string;
  name?: string;
  personalEmail?: string;
  roleValue: string;
  roleShortText: string;
  contractStart?: string;
  contractEnd?: string;
  onViewClick: () => void; // Callback for View button
  onEditClick: () => void; // Callback for Edit button
  label?: any;
  otherStaff?: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  rank,
  name,
  personalEmail,
  roleValue,
  roleShortText,
  contractStart,
  contractEnd,
  onViewClick,
  onEditClick,
  label,
  otherStaff,
}) => {
  const getColor = getRoleColor(roleValue);
  const isStringEmpty = (str: any) => isString(str) && trim(str).length === 0;

  return (
    <Card
      sx={{
        bgcolor: getColor.backgroundColor,
        maxHeight: 375,
        width: "259px",
        border: `1px solid ${getColor.borderColor}`,
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${CardBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          marginLeft: "-8px",
        }}
      >
        <Avatar
          alt="Profile Image"
          src={profileImage}
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto",
            borderRadius: "50%",
            marginTop: "15px",
          }}
        />
        <CardContent className="pb-2">
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "#000",
            }}
            className="bukra"
          >
            {!isStringEmpty(rank) ? rank : "-"}
          </Typography>
          <Tooltip title={name}>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
              className="bukra-semi-bold"
            >
              {!isStringEmpty(name) ? name : "-"}
            </Typography>
          </Tooltip>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px",
              color: "#58585B",
            }}
            className="dubai-regular"
          >
            {!isStringEmpty(personalEmail) ? personalEmail : "---"}
          </Typography>
          <Box display="flex" justifyContent="center" mt={1} mb={2}>
            <StaffRoleChip roleValue={roleValue || ""} roleShortText={roleShortText} otherStaff={otherStaff} />
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start !important"
            spacing={2}
            my={0}
            sx={{ flexWrap: "nowrap", marginY: "5px" }} // Prevents wrapping to the next line
          >
            <Box sx={{ width: "50%", flexShrink: 0 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#58585B",
                  whiteSpace: "nowrap",
                }}
                className="dubai-bold"
              >
                {label[0]}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#000",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className="bukra-semi-bold"
              >
                {contractStart}
              </Typography>
            </Box>
            <Box
              sx={{
                borderLeft: "1px solid #7A7A7A", // Customize color as needed
                height: "40px", // Adjust height as needed
                alignSelf: "center", // Aligns the line vertically in the center
                marginLeft: "5px !important",
              }}
            />
            <Box
              sx={{ width: "50%", flexShrink: 0, marginLeft: "5px !important" }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#58585B",
                  whiteSpace: "nowrap",
                }}
                className="dubai-bold"
              >
                {label[1]}
              </Typography>
              <Tooltip
                title={contractEnd}
                className="bukra"
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#000",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  className="bukra-semi-bold"
                >
                  {contractEnd}
                </Typography>
              </Tooltip>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            px={1}
          >
            {checkAccess(USER_PERMISSION.StaffView) && (
              <IconButton
                sx={{
                  backgroundColor: "#008755",
                  color: "white",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                  width: "50%",
                  padding: "4px 8px", // Adjust padding top/bottom and left/right
                  minHeight: "39px", // Reduce the height of the button
                }}
                onClick={onViewClick} // Use prop for click action
              >
                <VisibilityIcon />
                <Typography
                  sx={{
                    fontFamily: "29LT Bukra",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "24px",
                  }}
                  ml={1}
                  className="dubai-regular"
                >
                  View
                </Typography>
              </IconButton>
            )}
            {checkAccess(USER_PERMISSION.StaffEdit) && (
              <IconButton
                sx={{
                  backgroundColor: "transparent",
                  color: "#008755",
                  border: "1px solid #008755",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                  width: "50%",
                  padding: "4px 8px", // Adjust padding top/bottom and left/right
                  minHeight: "39px", // Reduce the height of the button
                }}
                className="dubai-regular"
                onClick={onEditClick} // Use prop for click action
              >
                <EditIcon width={"18px"} height={"18px"} />
                <Typography
                  sx={{
                    fontFamily: "29LT Bukra",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "24px",
                  }}
                  ml={1}
                  className="dubai-regular"
                >
                  Edit
                </Typography>
              </IconButton>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;
