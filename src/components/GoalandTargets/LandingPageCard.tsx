import { Box, Button, Skeleton, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

type LandingPageCardProps = {
  titleLabel: string;
  contentText: string;
  loading: boolean;
  onViewClick: () => void;
  onEditClick: (e: any) => void;
};

const LandingPageCard: React.FC<LandingPageCardProps> = ({
  titleLabel,
  contentText,
  loading,
  onViewClick,
  onEditClick,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #008755",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={onViewClick}
    >
      <Box
        px={3}
        py={1.5}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          backgroundColor: "#008755",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Typography className="bukra tertiary-color">{titleLabel}</Typography>
        {checkAccess(USER_PERMISSION.GoalsTargetsEdit) && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditOutlinedIcon />}
            sx={{
              color: "white",
              borderColor: "white",
              height: "32px",
              width: "84px",
            }}
            className="text-capitalize dubai-regular season-edit-btn"
            onClick={onEditClick}
          >
            Edit
          </Button>
        )}
      </Box>
      <Box
        p={3}
        height={"162px"}
        className="dubai-regular goal-card-list"
        sx={{
          background: "linear-gradient(#EFFAF9, #FFFFFF)",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        {loading ? (
          <Box height={"162px"}>
            <Skeleton width={"100%"} />
            <Skeleton width={"75%"} />
            <Skeleton width={"25%"} />
          </Box>
        ) : (
          <>
            {" "}
            {contentText && contentText.length < 200
              ? contentText
              : `${contentText?.slice(0, 200)}...`}
          </>
        )}
      </Box>
    </Box>
  );
};

export default LandingPageCard;
