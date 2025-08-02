import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import BackIcon from "../../../public/backIcon.svg";
import { Box } from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import { useRouter } from "next/router";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

interface BreadcrumpWithBackProps {
  routes: BreadcrumbRoutes[];
}

const BreadcrumpWithBack: React.FC<BreadcrumpWithBackProps> = ({ routes }) => {
  const router = useRouter();
  return (
    <>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <BasicBreadcrumbs routes={routes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",
            fontWeight: 500,
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => router.back()}
        />
      </Box>
    </>
  );
};

export default BreadcrumpWithBack;
