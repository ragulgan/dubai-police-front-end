import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

interface ProgressBarProps {
  total: number;
  getTeamRequirementLists: any;
  data: any;
}

const ProgressBar: React.FC<ProgressBarProps> = (
  {
    total,
    getTeamRequirementLists,
    data
  }
) => {
  const validFilteredList = Array.isArray(data) ? data : [];

  const pendingData = validFilteredList?.filter((item: any) => item?.shipmentStatus === 0).length;
  const fulfilledData = validFilteredList?.filter((item: any) => item?.shipmentStatus === 1).length;
  const cancelledData = validFilteredList?.filter((item: any) => item?.shipmentStatus === 2).length;
  const pendingPercentage = (pendingData / total) * 100;
  const fulfilledPercentage = (fulfilledData / total) * 100;
  const cancelledPercentage = (cancelledData / total) * 100;

  return (
    <Box
      paddingTop={2}
      px={2}
    >
      <Box
        height={"81px"}
        border={"1px solid #58585B33"}
        borderRadius={"4px"}
        padding={"16px 20px 16px 20px"}
      >
        <Grid container spacing={3}>
          <Grid item xs={1}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {getTeamRequirementLists.loading ? (
                <Skeleton variant="text" width={20} height={30} />
              ) : (
                <Typography
                  className="dubai-med"
                  sx={{
                    color: "#000000",
                    fontWeight: "700",
                    fontSize: "24px",
                  }}
                >
                  {total}
                </Typography>)}

              {getTeamRequirementLists.loading ? (
                <Skeleton variant="text" width={40} height={30} />
              ) : (
                <Typography
                  className="dubai-med"
                  sx={{
                    color: "#000000",
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  Total
                </Typography>)}
            </Box>
          </Grid>
          <Grid item xs={7} mt={0.5} mr={6}>
            <Box
              position="relative"
              width="100%"
              height="40px"
              borderRadius={1}
              bgcolor="gray.200"
              overflow="hidden"
            >
              {getTeamRequirementLists.loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : (
                <>
                  <Tooltip title={`Fulfilled: ${fulfilledData}`} arrow>
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      height="100%"
                      bgcolor="primary.dark"
                      width={`${fulfilledPercentage}%`}
                    />
                  </Tooltip>
                  <Tooltip title={`Pending: ${pendingData}`} arrow>
                    <Box
                      position="absolute"
                      top={0}
                      left={`${fulfilledPercentage}%`}
                      height="100%"
                      bgcolor="orange"
                      width={`${pendingPercentage}%`}
                    />
                  </Tooltip>
                  <Tooltip title={`Cancelled: ${cancelledData}`} arrow>
                    <Box
                      position="absolute"
                      top={0}
                      left={`${fulfilledPercentage + pendingPercentage}%`}
                      height="100%"
                      bgcolor="red"
                      width={`${cancelledPercentage}%`}
                    />
                  </Tooltip>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={3} mt={1}>
            <Box display="flex" justifyContent="flex-end" mt={1} gap={2}>
              {getTeamRequirementLists.loading ? (
                <Box display="flex" alignItems="center" gap={2}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} key={index} display="flex" alignItems="center">
                      <Skeleton variant="circular" width={12} height={12} />
                      <Skeleton variant="text" width={50} height={20} sx={{ ml: 1 }} />
                    </Grid>
                  ))}
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center">
                    <Box
                      width={12}
                      height={12}
                      bgcolor="primary.dark"
                      borderRadius="50%"
                      mr={1}
                    />
                    <Typography variant="body2">Fulfilled</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      width={12}
                      height={12}
                      bgcolor="orange"
                      borderRadius="50%"
                      mr={1}
                    />
                    <Typography variant="body2">Pending</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box width={12} height={12} bgcolor="red" borderRadius="50%" mr={1} />
                    <Typography variant="body2">Cancelled</Typography>
                  </Box>
                </>)}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProgressBar;
