import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";

interface CustomIconButtonProps {
  icon: React.ElementType; // The icon component
  isSelected: boolean; // Whether the icon is selected
  onClick: any; // Click handler function
  margin?: any;
  title?: string;
  sx?: SxProps<Theme>;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  icon: Icon,
  isSelected,
  onClick,
  margin,
  title,
  sx
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        disableRipple
        sx={{
          backgroundColor: isSelected ? "rgb(0 135 85)" : "white",
          color: isSelected ? "white" : "rgb(0 135 85)",
          border: isSelected ? "none" : "1px solid #008755",
          width: "44px",
          height: "44px",
          borderRadius: "4px",
          transition: "none",
          marginRight: margin ? 1 : margin === undefined ? 1 : 0,
          ...sx
        }}
      >
        <Icon width={24} height={24} fill="#fff" color={"#fff"} />
      </IconButton>
    </Tooltip>
  );
};
export default CustomIconButton;
