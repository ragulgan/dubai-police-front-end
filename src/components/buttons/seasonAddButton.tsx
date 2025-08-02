import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";

interface CustomIconButtonProps {
  icon: React.ElementType; // The icon component
  onClick: any; // Click handler function
  title?: string;
  sx?: SxProps<Theme>;
}

const SeasonCustomIconButton: React.FC<CustomIconButtonProps> = ({
  icon: Icon,
  onClick,
  title,
  sx
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        disableRipple
        sx={{
          backgroundColor: "rgba(241, 244, 247, 1)",
          color: "rgba(0, 0, 0, 1)",
          border: "none",
          width: "56px",
          height: "56px",
          borderRadius: "8px",
          transition: "none",
          marginRight: 0,
          gap: "8px",
          ...sx
        }}
      >
        <Icon width={16} height={16} fill="#fff" color={"#fff"} />
      </IconButton>
    </Tooltip>
  );
};
export default SeasonCustomIconButton;
