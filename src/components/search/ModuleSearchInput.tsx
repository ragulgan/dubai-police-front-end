"use client";
import { InputBase, Paper } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const ModuleSearchInput = (props: any) => {
  const {
    searchText,
    setSearchText,
    placeholder,
    flexGrow,
    setPage,
    setRowsPerPage,
  } = props;
  return (
    <Paper
      className="dubai-med header-border-right"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        boxShadow: "none",
        flexGrow: 0.5,
        width: "auto",
        minWidth: 0,
        borderRadius: "0",
        px: 2,
        ...flexGrow,
      }}
    >
      <SearchIcon color="secondary" sx={{ width: "24px", height: "24px" }} />
      <InputBase
        className="dubai-regular"
        sx={{
          ml: 1,
          flex: 1,
          "& input::placeholder": {
            color: "#58585B",
            opacity: 1,
          },
        }}
        value={searchText}
        placeholder={placeholder}
        inputProps={{ "aria-label": placeholder }}
        data-testid="search-input"
        onChange={(event) => {
          setSearchText(event.target.value);
          if (setPage) setPage(1);
          if (setRowsPerPage) setRowsPerPage(10);
        }}
      />
    </Paper>
  );
};

export default ModuleSearchInput;
