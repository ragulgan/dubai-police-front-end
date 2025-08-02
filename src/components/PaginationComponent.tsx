import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination,
  PaginationItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EastIcon from "@mui/icons-material/East";

const PaginationComponent: React.FC<{
  rowsPerPage: number;
  handleChangeRowsPerPage?: any;
  page: number;
  handleChangePage?: any;
  startIndex: number;
  endIndex: number;
  totalItems: number; // Add total items for pagination
  isDisable?: boolean;
}> = ({
  rowsPerPage,
  page,
  handleChangePage,
  startIndex,
  endIndex,
  totalItems,
  handleChangeRowsPerPage,
  isDisable,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px="5px"
      py="8px"
    >
      {/* Items per page dropdown */}
      <Box display="flex" alignItems="center" marginLeft="10px">
        <Typography
          sx={{
            display: "inline",
            marginRight: "20px",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#58585B",
          }}
          className="dubai-med"
        >
          Items per page:
        </Typography>
        <Select
          disabled={totalItems < 5 || isDisable}
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          size="small"
          sx={{ width: "60px", maxHeight: "30px" }}
          IconComponent={() => (
            <ExpandMoreIcon style={{ marginLeft: "-15px" }} />
          )}
          renderValue={(selected) => (
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "24px",
                color: "#58585B",
              }}
              className="dubai-med"
            >
              {selected}
            </Typography>
          )}
        >
          {[5, 10, 15, 20].map((option) => (
            <MenuItem
              key={option}
              value={option}
              className="dubai-med"
              disabled={option > totalItems}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
        <Typography
          sx={{
            display: "inline",
            marginLeft: "8px",
            marginRight: "8px",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#58585B",
          }}
          className="dubai-med"
        >
          Total
        </Typography>
        <Box
          sx={{
            borderLeft: "2px solid #DEE2ED",
            height: "45px",
            alignSelf: "center",
            marginLeft: "2px",
            marginRight: "8px",
          }}
        />
        <Typography
          sx={{
            display: "inline",
            marginRight: "8px",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#58585B",
          }}
          className="dubai-med"
        >
          Showing {startIndex}-{endIndex} of {totalItems} total
        </Typography>
      </Box>
      {/* Pagination controls */}
      <Pagination
        count={totalPages}
        page={page === 0 ? 1 : page}
        onChange={(event, value) => handleChangePage(event, value)}
        variant="outlined"
        shape="rounded"
        disabled={isDisable}
        data-testid="pagination-button"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#008755",
                border: "1px solid #008755",
                color: "white",
              },
              "&:not(.Mui-selected)": {
                backgroundColor: "white",
                color: "#58585B",
              },
              border: "1px solid #58585B",
              width: "28px",
              height: "28px",
              fontSize: "14px",
              fontWeight: 400,
            }}
            className="dubai-med"
            components={{
              previous: () => <KeyboardBackspaceIcon sx={{ fontSize: 20 }} />,
              next: () => <EastIcon sx={{ fontSize: 20 }} />,
            }}
          />
        )}
      />
    </Box>
  );
};

export default PaginationComponent;
