"use client";
import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { isEmpty } from "lodash";
import StaticFoodImage from "../../../public/staticFoodImage.svg";
import { checkAccess } from "@/utils/acessscheck";

interface ProgramItemCardProps {
  programData: any;
  onViewClicked: any;
  onEditClicked: any;
  isLoading?: any;
}

const ProgramItemCard: React.FC<ProgramItemCardProps> = ({
  programData,
  onViewClicked,
  onEditClicked,
  isLoading,
}) => {
  const programsList = Array.isArray(programData)
    ? programData
    : programData?.data || [];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return "61vh";
    if (isFullHD) return "65vh";
    if (is3K) return "61vh";
    if (is2K) return "57vh";
    if (isLaptopL) return "61vh";
    if (isLaptop) return "61vh";
    if (isTab) return "61vh";
    return "57vh";
  };

  const RenderEditorContent = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return <div className="">{plainText && plainText}</div>;
  };

  return (
    <Box
      p={{ xs: 2 }}
      pt={0}
      sx={{
        overflowY: "scroll",
        height: getPageContentHeight(),
      }}
    >
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item key={index} sx={{ borderRadius: "8px" }}>
              <Box width={"412px"}>
                <Skeleton data-testid="program-skeleton" variant="rectangular" height={200} animation="wave" />
                <Box sx={{ pt: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            </Grid>
          ))
        ) : programsList.length ? (
          programsList.map((program: any, index: number) => (
            <Grid item key={index} sx={{ borderRadius: "8px" }}>
              <Box
                sx={{
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#008755",
                  paddingX: 1,
                  paddingTop: 1,
                  paddingBottom: 2,
                  borderRadius: 2,
                  width: "412px",
                  height:
                    checkAccess(1068) || checkAccess(1069) ? "412px" : "350px",
                }}
              >
                {isEmpty(program?.filePath) ? (
                  <Box p={0.5}>
                    <StaticFoodImage
                      style={{
                        width: "100%",
                        height: 190,
                        borderRadius: 8,
                      }}
                      className="static-image"
                    />
                  </Box>
                ) : (
                  <img
                    src={program?.filePath}
                    alt="Program Image"
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 8,
                      padding: "4px",
                    }}
                  />
                )}
                <Box>
                  <Typography
                    sx={{
                      paddingTop: 1,
                      fontSize: "16px",
                      lineHeight: "16px",
                      color: "#000000",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    className="bukra-semi-bold"
                  >
                    {program?.programName}
                  </Typography>
                  <Typography
                    className="dubai-regular webkit-line-clamp"
                    sx={{
                      paddingTop: 1,
                      fontSize: "14px",
                      lineHeight: "18px",
                      color: "#58585B",
                      height: "65px",
                    }}
                  >
                    <RenderEditorContent content={program?.objective} />
                  </Typography>
                  <Typography
                    className="dubai-regular"
                    sx={{
                      paddingTop: 1,
                      fontSize: "16px",
                      lineHeight: "16px",
                      color: "#58585B",
                    }}
                  >
                    {`Start Date: ${program?.startDate || "--"}  End Date: ${
                      program?.endDate || "--"
                    }`}
                  </Typography>
                </Box>
                {checkAccess(1068) || checkAccess(1069) ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 2,
                    }}
                  >
                    {checkAccess(1068) ? (
                      <CustomButton
                        sx={{
                          marginRight: 1,
                          fontSize: "16px",
                          height: "48px",
                        }}
                        fullWidth={true}
                        label="View"
                        variant="contained"
                        size="large"
                        iconPosition="start"
                        ButtonIcon={VisibilityIcon}
                        onClick={(e: any) => {
                          onViewClicked(program?.programID);
                        }}
                      />
                    ) : null}
                    {checkAccess(1069) ? (
                      <CustomButton
                        sx={{
                          marginLeft: 1,
                          fontSize: "16px",
                          height: "48px",
                        }}
                        fullWidth={true}
                        label="Edit"
                        variant="outlined"
                        size="large"
                        iconPosition="start"
                        ButtonIcon={EditIcon}
                        onClick={(e: any) => {
                          onEditClicked(program?.programID);
                        }}
                      />
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProgramItemCard;
