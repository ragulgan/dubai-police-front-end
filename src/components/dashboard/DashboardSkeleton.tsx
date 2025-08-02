import { Box, Card, Grid, Skeleton, useMediaQuery } from "@mui/material";
import theme from "@/theme";

const DashboardSkeleton = () => {
  const is2K = useMediaQuery(theme.breakpoints.up("xl"));
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  return <>
    <Grid container spacing={2} px={2}>
      {Array(is2K ? 5 : 4)
        .fill(1)
        .map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
            key={index}
            className="bg-dashboard"
          >
            <Card
              key={index}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                boxShadow: "none",
                borderRadius: "8px",
              }}
            >
              <Skeleton variant="circular" width={93} height={93} />
              <Box pl={3} width={"156px"}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={"100%"}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "0.5rem" }}
                  width={"80%"}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "0.5rem" }}
                  width={"80%"}
                />
              </Box>
            </Card>
          </Grid>
        ))}
    </Grid>
    <Grid container spacing={2} p={2}>
      <Grid item xs={12} sm={6} className="bg-dashboard">
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.5rem" }}
            width={"30%"}
          />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"264px"}
            sx={{ mt: 1, borderRadius: '20px' }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} className="bg-dashboard">
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.5rem" }}
            width={"30%"}
          />
          <Box
            mt={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"spac-between"}
          >
            <Skeleton variant="circular" width={"273px"} height={"263px"} />
            <Skeleton
              variant="circular"
              width={"273px"}
              height={"263px"}
              sx={{ ml: 5 }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
    <Grid container spacing={2} px={2}>
      <Grid item xs={12} sm={6} className="bg-dashboard">
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.5rem" }}
            width={"30%"}
          />
          <Grid container spacing={2} mt={1}>
            {Array(4)
              .fill(1)
              .map((card, index) => (
                <Grid item xs={12} sm={6}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"125px"}
                    sx={{ borderRadius: '20px' }}
                  />
                </Grid>
              ))}
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} className="bg-dashboard">
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.5rem" }}
            width={"30%"}
          />
          <Grid container spacing={2} mt={1}>
            {Array(4)
              .fill(1)
              .map((card, index) => (
                <Grid item xs={12}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"53px"}
                    sx={{ borderRadius: '20px' }}
                  />
                </Grid>
              ))}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  </>
}

export default DashboardSkeleton;