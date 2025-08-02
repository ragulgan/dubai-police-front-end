"use client";
import {
  Box,
  Grid,
  Skeleton,
  useMediaQuery,
  Grow,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Alert,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Location from "../../../public/Location.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditIcon from "../../../public/EditSVG.svg";
import CalendarGrey from "../../../public/calendarResult.svg";
import { usePathname } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
import PaginationComponent from "../PaginationComponent";
import _ from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

interface CardViewProps {
  data: any;
  isEdit?: any;
  isLoading: boolean;
  label?: any;
  module?: string;
  setPage?: any;
  page?: any;
  setRowsPerPage?: any;
  rowsPerPage?: any;
  sportId?: any;
}

const CardListResults: React.FC<CardViewProps> = ({
  data,
  isLoading,
  module,
  isEdit,
  sportId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
}) => {
  const currentNav = usePathname();
  const currentPath = currentNav?.split("/")[1];
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport");
  const [filterData, setFilterData] = React.useState<any>([]);
  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  React.useEffect(() => {
    const startIndex = (page - 1) * rowsPerPage + 1;
    const endIndex = startIndex + rowsPerPage - 1;
    if (!_.isEmpty(data) && startIndex && endIndex) {
      setFilterData(data?.slice(startIndex - 1, endIndex));
    }
  }, [data, page, rowsPerPage]);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtmlTags(content);

    return (
      <div className="webkit-line-clamp webkit-1">{plainText && plainText}</div>
    );
  };

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (isFullHD) return currentNav === "/latest-results" ? "69vh" : "73vh";
    if (is3K) return currentNav === "/latest-results" ? "66vh" : "71vh";
    if (is2K) return currentNav === "/latest-results" ? "62vh" : "67vh";
    if (isLaptopL) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isLaptop) return currentNav === "/latest-results" ? "66vh" : "72vh";
    if (isTab) return currentNav === "/latest-results" ? "66vh" : "72vh";
    return "64vh";
  };
  return (
    <Box
      sx={{
        overflowY: "auto",
        height: getPageContentHeight(),
      }}
    >
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={index}>
              <Box
                height={"116px"}
                p={2}
                display={"flex"}
                alignItems={"center"}
                sx={{ border: "1px solid rgba(0, 135, 85, 0.3)" }}
                borderRadius={"10px"}
              >
                <Box width={"50%"}>
                  <Box display={"flex"}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton
                      variant="text"
                      width="80%"
                      sx={{ ml: 1, fontSize: "1rem" }}
                    />
                  </Box>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
                <Box
                  width={"25%"}
                  sx={{
                    placeItems: "center",
                    borderLeft: "1px solid rgba(0, 135, 85, 0.3)",
                    borderRight: "1px solid rgba(0, 135, 85, 0.3)",
                  }}
                >
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="text" width="60%" />
                </Box>
                <Box
                  width={"25%"}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  <Skeleton variant="rectangular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={32} height={32} />
                </Box>
              </Box>
            </Grid>
          ))
        ) : !_.isEmpty(filterData) ? (
          filterData?.map((results: any, index: any) => {
            return (
              <Grow
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                {...(true ? { timeout: 500 + index * 200 } : {})}
                key={index}
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={index}>
                  <Box
                    height={"116px"}
                    p={2}
                    display={"flex"}
                    alignItems={"center"}
                    sx={{
                      border: "1px solid rgba(0, 135, 85, 0.3)",
                      cursor: "pointer",
                    }}
                    borderRadius={"10px"}
                  >
                    <Box width={"25%"}>
                      <Box display={"flex"} alignItems={"center"}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#000000",
                            ml: 1,
                          }}
                          className="bukra-semi-bold text-capitalize webkit-line-clamp webkit-1"
                        >
                          {results?.eventName}
                        </Typography>
                      </Box>
                      <Box display={"flex"} alignItems={"center"} mt={1}>
                        <Location width={"20px"} height={"20px"} />
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                            ml: 0.5,
                          }}
                          className="dubai-regular text-capitalize webkit-line-clamp webkit-1"
                        >
                          {results?.eventLocation}
                        </Typography>
                      </Box>
                      <Box display={"flex"} alignItems={"center"} mt={1}>
                        <CalendarGrey width={"20px"} height={"20px"} />
                        <Typography
                          sx={{
                            fontSize: "16px",
                            lineHeight: "24px",
                            color: "#58585B",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "200px",
                            ml: 0.5,
                          }}
                          className="dubai-regular text-capitalize"
                        >
                          {results?.eventDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      width={"50%"}
                      sx={{
                        placeItems: "center",
                        borderLeft: "1px solid rgba(0, 135, 85, 0.3)",
                        borderRight: "1px solid rgba(0, 135, 85, 0.3)",
                        padding: "16px",
                      }}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={4}
                        width="100%"
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          flex={1}
                          gap={1}
                        >
                          {results?.selectWinner === results?.homeTeamName ? (
                            <Chip
                              label={"Winner"}
                              sx={{
                                padding: "0px",
                                backgroundColor: "#FFFAE8",
                                color: "#000000",
                                height: "20px",
                                border: "1px solid #FFAF2F",
                                borderRadius: "4px",
                                ".MuiChip-label": {
                                  fontWeight: 500,
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  textAlign: "left",
                                  paddingY: "7px",
                                  paddingX: "10px",
                                },
                              }}
                              className="dubai-med"
                            />
                          ) : null}
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#FFE5CC",
                                color: "#000000",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "16px",
                                  color: "#000000",
                                }}
                                className="dubai-bold"
                              >
                                {getInitials(results?.homeTeamName)}
                              </Typography>
                            </Avatar>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#000000",
                                textAlign: "left",
                                minWidth: "100px",
                              }}
                              className="dubai-bold text-capitalize webkit-line-clamp webkit-1"
                            >
                              {results && results?.homeTeamName}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "200px",
                            backgroundColor: "#F3F3F3",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "24px",
                              lineHeight: "24px",
                              color: "#000",
                              textAlign: "center",
                              width: "50px",
                            }}
                            className="dubai-bold"
                          >
                            V/S
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          flex={1}
                          gap={1}
                        >
                          {results?.selectWinner === results?.awayTeamName ? (
                            <Chip
                              label={"Winner"}
                              sx={{
                                padding: "0px",
                                backgroundColor: "#FFFAE8",
                                color: "#000000",
                                height: "20px",
                                border: "1px solid #FFAF2F",
                                borderRadius: "4px",
                                ".MuiChip-label": {
                                  fontWeight: 500,
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  textAlign: "left",
                                  paddingY: "7px",
                                  paddingX: "10px",
                                },
                              }}
                              className="dubai-med"
                            />
                          ) : null}
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                          >
                            <Typography
                              sx={{
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#000000",
                                textAlign: "right",
                              }}
                              className="dubai-bold text-capitalize webkit-line-clamp webkit-1"
                            >
                              {results && results?.awayTeamName}
                            </Typography>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#F3F3F3",
                                color: "#000000",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "16px",
                                  color: "#000000",
                                }}
                                className="dubai-bold"
                              >
                                {getInitials(results?.awayTeamName)}
                              </Typography>
                            </Avatar>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      width={"25%"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        padding: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: "56px",
                          padding: "7px 16px",
                          gap: "0px",
                          borderRadius: "6px",
                          opacity: 1,
                          backgroundColor: "#AEAECA1A",
                          display: "flex",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: "24px",
                            color: "#58585B",
                          }}
                          className="dubai-bold"
                        >
                          Comments:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: "1.2",
                            color: "#58585B",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-line",
                            padding: 0,
                            margin: 0,
                            display: "inline",
                          }}
                          className="dubai-regular webkit-line-clamp webkit-1"
                        >
                          <RenderEditorContentHtml content={results.comments} />
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        {(checkAccess(USER_PERMISSION.ResultView) &&
                          module !== "latest-result") ||
                        (checkAccess(USER_PERMISSION.LatestResultsView) &&
                          module === "latest-result") ? (
                          <Tooltip title="View">
                            <IconButton
                              sx={{
                                backgroundColor: "#008755",
                                color: "white",
                                borderRadius: 1,
                                "&:hover": {
                                  backgroundColor: "darkgreen",
                                },
                                width: "44px",
                                padding: "4px 8px",
                                minHeight: "32px",
                                height: "32px",
                              }}
                              onClick={() =>
                                router.push(
                                  currentPath === "latest-results"
                                    ? `/latest-results/view/${results.resultID}?sportId=${sportId}`
                                    : `/teams/${getCurrentSport}/results/view/${results.resultID}`
                                )
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        {(checkAccess(USER_PERMISSION.ResultEdit) &&
                          module !== "latest-result") ||
                        (checkAccess(USER_PERMISSION.LatestResultsEdit) &&
                          module === "latest-result") ? (
                          <Tooltip title="Edit">
                            <IconButton
                              sx={{
                                backgroundColor: "transparent",
                                color: "#008755",
                                border: "1px solid #008755",
                                borderRadius: 1,
                                "&:hover": {
                                  backgroundColor: "#fff",
                                },
                                width: "44px",
                                padding: "4px 8px",
                                minHeight: "32px",
                                height: "32px",
                              }}
                              className="dubai-med"
                            >
                              <EditIcon
                                width={"18px"}
                                height={"18px"}
                                onClick={() =>
                                  isEdit(results?.resultID, sportId)
                                }
                              />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grow>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Alert className="dubai-med" severity="info">
              No record(s) found
            </Alert>
          </Grid>
        )}
      </Grid>
      {data && data?.length > 0 ? (
        <PaginationComponent
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={(
            event: React.ChangeEvent<{ value: unknown }>
          ) => setRowsPerPage(event.target.value as number)}
          page={page}
          handleChangePage={(event: unknown, newPage: number) =>
            setPage(newPage)
          }
          startIndex={startIndex}
          endIndex={endIndex > data?.length ? data?.length : endIndex}
          totalItems={data?.length}
        />
      ) : null}
    </Box>
  );
};
export default CardListResults;
