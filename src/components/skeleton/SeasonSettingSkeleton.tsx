"use client"
import { Box, Grid, Paper, Skeleton, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";

type SeasonSettingSkeletonProps = {
  sx?: SxProps<Theme>;
}

const SeasonSettingSkeleton: React.FC<SeasonSettingSkeletonProps> = ({ sx }) => {
  return (
    <>
      <TableContainer component={Paper} sx={{ ...sx }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={10} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={200} height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={200} height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={200} height={30} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={200} height={30} />
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="row" gap={2}>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="row" gap={2}>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="row" gap={2}>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                    <Box>
                      <Skeleton variant="text" width={150} height={30} />
                      <Skeleton variant="rectangular" width={150} height={40} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
};

export default SeasonSettingSkeleton;