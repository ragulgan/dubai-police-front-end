"use client"
import { Accordion, AccordionSummary, Box, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
const RolesAndPermissionListSkeleton: React.FC = () => {
  return (
    <>
      <Box sx={{
        paddingX: 2,
        paddingY: 2,
      }}>
        <Box>
          {[...Array(7)].map((_, index) => (
            <Box key={index} sx={{ paddingBottom: "20px" }}>
              <Accordion
                sx={{
                  border: "1px solid #DEDEDE",
                  boxShadow: "none"
                }}
              >
                <AccordionSummary
                  expandIcon={<Skeleton variant="rectangular" width={32} height={32} />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2
                  }}
                >
                  <Skeleton variant="text" width="40%" height={30} />
                </AccordionSummary>
              </Accordion>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
};
export default RolesAndPermissionListSkeleton;