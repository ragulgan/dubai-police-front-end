import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Card, Grid, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

function Page() {
  const router = useRouter();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: true,
      disabled: false,
    },
  ];

  const tournaments = [
    {
      id: 1,
      title: "Summer Race",
      image: "Tournament1.svg",
      text: "Commander's Shield Races & \n Tournaments",
    },
    {
      id: 2,
      title: "Winter Tournament",
      image: "Tournament2.svg",
      text: "Academy Shield Races & \n Tournaments",
    },
    {
      id: 3,
      title: "Winter Tournament",
      image: "Tournament3.svg",
      text: `Hemaya shield Races & \n Tournaments`,
    },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "70vh";
    if (isFullHD) return "74vh";
    if (is3K) return "70vh";
    if (is2K) return "68vh";
    if (isLaptopL) return "73vh";
    if (isLaptop) return "73vh";
    if (isTab) return "73vh";
    return "68vh";
  };

  const handleCardSection = () => {
    router.push("/tournaments/commander");
  };

  return (
    <Box p={0.5}>
      <Box
        p={1.5}
        px={2}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container spacing={2} pt={1}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box
              sx={{
                borderRadius: "8px",
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px solid rgba(88, 88, 91, 0.2)"}
              >
                <Typography
                  className="table-list-header bukra"
                  p={2}
                  sx={{ borderRight: "1px solid #DEE2ED" }}
                >
                  Current Internal Races & Tournaments
                </Typography>
              </Box>
              <Grid
                container
                spacing={2}
                p={2}
                sx={{ height: getPageContentHeight(), overflowY: "scroll" }}
              >
                {tournaments.map((tournament) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3.5}
                    xl={3}
                    key={tournament.id}
                  >
                    <Card
                      sx={{
                        height: "487px",
                        width: "100%",
                        backgroundImage: `url(${tournament.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover .hover-title": {
                          opacity: 1,
                        },
                        border: "1px solid #008755",
                      }}
                      onClick={handleCardSection}
                    >
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          p: 2,
                          textAlign: "start",
                          height: "306px",
                          background:
                            "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
                          width: "100%",
                          alignContent: "end",
                          zIndex: 2,
                        }}
                        className="bukra tournament-card-title"
                      >
                        {tournament.text}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="hover-title bukra tournament-card-title"
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          opacity: 0,
                          transition: "opacity 0.3s ease-in-out",
                          position: "absolute",
                          cursor: "pointer",
                          height: "487px",
                          width: "100%",
                          alignContent: "center",
                        }}
                      >
                        View Tournament
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Page;
