import CustomButton from "@/components/buttons/CustomButton";
import Box from "@mui/material/Box";
import BackIcon from "../../../../../public/backIcon.svg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import ViewPolls from "@/components/suggestions-polls/view/ViewPolls";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { useMediaQuery } from "@mui/material";

const ViewMouPartnership: React.FC = () => {
  const router = useRouter();
  const { pollsID } = router.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight: any = () => {
    if (is4K) return "76.5vh";
    if (isFullHD) return "78.5vh";
    if (is3K) return "76.5vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "76.5vh";
    if (isLaptop) return "76.5vh";
    if (isTab) return "72.5vh";
    return "72.5vh";
  };
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Suggestions & Polls",
      route: `/suggestions-polls`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/suggestions-polls/polls/view/${pollsID}`,
      currentPage: true,
      disabled: false,
    },
  ];

  return (
    <>
      <Grid container p={1}>
        <Grid item xs={12} md={12}>
          <Box
            p={1.5}
            className="bg-white"
            borderRadius={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <BasicBreadcrumbs routes={breadcrumbRoutes} />
            <CustomButton
              sx={{
                borderRadius: "28px",
                backgroundColor: "rgba(0, 135, 85, 0.1)",
                px: 1.5,
                py: 0,
                fontSize: "18px",
                height: "30px",
              }}
              label="Back"
              variant="outlined"
              size="medium"
              ButtonIcon={BackIcon}
              iconPosition="start"
              onClick={() => {
                router.back();
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
            mt: 1,
            placeContent: "center",
          }}
          className="bg-white"
        >
          <ViewPolls />
        </Grid>
      </Grid>
    </>
  );
};

export default ViewMouPartnership;
