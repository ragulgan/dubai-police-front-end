"use client";
import { Button, Tooltip } from "@mui/material";
import React from "react";
import FilterListIcon from "../../../public/Icons/Filter.svg";

const ModuleFilterButton = (props: any) => {
  const { handleFilterClick, text } = props;
  return (
    <Tooltip title={text}>
      <Button
        variant="text"
        className="dubai-regular text-capitalize header-border-right"
        sx={{
          flexGrow: 0,
          width: "auto",
          minWidth: 0,
          borderRadius: "0",
          fontSize: "16px",
          fontWeight: 400,
          px: 2,
        }}
        color="secondary"
        endIcon={<FilterListIcon />}
        onClick={handleFilterClick}
      >
        Filters
      </Button>
    </Tooltip>
  );
};

export default ModuleFilterButton;
