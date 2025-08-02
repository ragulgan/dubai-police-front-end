import React from "react";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useRouter } from "next/router";

const CompititivenessTable = (props: any) => {
  const { data, module, cursor } = props;
  const router = useRouter();
  return (
    <Paper elevation={0} sx={{ boxShadow: "none" }}>
      <Table sx={{ borderCollapse: "collapse" }}>
        <TableBody>
          {data &&
            data.map((row: any, index: any) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                }}
              >
                <TableCell
                  sx={{
                    border: "none",
                    fontSize: 14,
                  }}
                >
                  <Typography className="dubai-regular">{row.label}</Typography>
                </TableCell>
                {module === "compititiveness" &&
                  <TableCell
                    align="left"
                    sx={{
                      border: "none",
                      fontSize: 14,
                    }}
                  >
                    <Typography className="dubai-regular" component="span" sx={{ color: "#888", mr: 1 }}>
                      {row.sportype}
                    </Typography>
                  </TableCell>}
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    fontSize: 14,
                  }}
                >
                  <Typography
                    className="dubai-regular"
                    component="span"
                    sx={{ color: "#888" }}
                  >
                    {row.points}
                  </Typography>
                </TableCell>
                {module === "participants" || module === "women_empower" || module === "physical_ready" || module === "assitance_motivation" ?
                  <TableCell
                    align="center"
                    sx={{
                      border: "none",
                      fontSize: 14,
                    }}
                  >
                    <Typography className="dubai-regular" component="span" sx={{ color: "#888" }}>
                      {row.percentage}
                    </Typography>
                  </TableCell> : null}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CompititivenessTable;
