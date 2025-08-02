"use client";
import React from "react";
import Button from "@mui/material/Button";
import { height, styled, SxProps, Theme, width } from "@mui/system";
import { Tooltip } from "@mui/material";

interface CustomButtonProps {
  label: string;
  variant: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  ButtonIcon: React.ElementType;
  iconPosition: "start" | "end" | "none";
  onClick?: any;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  fullWidth?: boolean;
  module?: any;
  tooltip?: any;
}

const StyledButton = styled(Button)(({ theme, variant }) => ({
  textTransform: "none",
  ...(variant === "outlined" && {
    borderWidth: 2,
  }),
}));

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  size,
  variant,
  fullWidth = false,
  ButtonIcon,
  iconPosition,
  onClick,
  sx,
  disabled,
  module,
  tooltip,
}) => {
  const getButtonIconSize = () => {
    if (size === "large") return 22;
    if (size === "medium") return 16;
    return 24;
  };

  return (
    <Tooltip title={tooltip}>
      <span>
      <StyledButton
        sx={{ ...sx }}
        fullWidth={fullWidth}
        variant={variant}
        className="dubai-regular"
        size={size}
        startIcon={
          iconPosition == "start" ? (
            <ButtonIcon
              style={{
                width: getButtonIconSize(),
                height: getButtonIconSize(),
              }}
            />
          ) : null
        }
        endIcon={
          iconPosition == "end" ? (
            <ButtonIcon
              style={{
                width:
                  label === "Create Nutrition Plan"
                    ? 18
                    : module === "news"
                    ? 20
                    : 13,
                height:
                  label === "Create Nutrition Plan"
                    ? 18
                    : module === "news"
                    ? 20
                    : 13,
              }}
            />
          ) : null
        }
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </StyledButton>
      </span>
    </Tooltip>
  );
};

export default CustomButton;
