"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  CssBaseline,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import CustomCard from "@/components/CustomCard";
import { usePathname, useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  const currentNav = usePathname();
  const router = useRouter();
  const moduleList = [
    { name: "Overview", path: "/commander" },
    { name: "Season Planner", path: "/commander/seasons" },
    { name: "Activity Calendar", path: "/commander/activity-calendar" },
    { name: "Competitions", path: "/commander/competitions" },
    { name: "Teams/Departments", path: "/commander/departments" },
    {
      name: "Reports",
      subMenu: [
        {
          name: "Department Ranking",
          path: "/commander/reports/department-ranking",
        },
        { name: "Sector Ranking", path: "/commander/reports/sector-ranking" },
      ],
    },
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<string | null>(
    "Overview"
  );

  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    const isReportActive = moduleList
      .find((m) => m.name === "Reports")
      ?.subMenu?.some((sub) => currentNav === sub.path);
    if (isReportActive) setReportsOpen(true);
  }, [currentNav]);

  const handleListItemClick = (index: string, path?: string) => {
    setSelectedIndex(index);
    const isReportsSubmenu = moduleList
      .find((m) => m.name === "Reports")
      ?.subMenu?.some((sub) => sub.name === index);

    if (index !== "Reports" && !isReportsSubmenu) {
      setReportsOpen(false);
    }
    if (path) {
      router.push(`/tournaments/${path}`);
    }
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box>
      {" "}
      <CssBaseline />
      {currentNav && currentNav.includes("/view") ? (
        <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <Box>{children}</Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container p={1} pl={0}>
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            xl={1.5}
            sx={{ backgroundColor: "#fff", borderTopRightRadius: "5px" }}
          >
            <Box
              sx={{
                display: "grid",
                width: "100%",
                borderTopRightRadius: "5px",
              }}
            >
              <List
                sx={{
                  maxHeight: "100%", // Set maxHeight to control when scrolling should occur
                  maxWidth: "100%", // Set maxHeight to control when scrolling should occur
                  pt: 0,
                  borderTopRightRadius: "5px",
                }}
              >
                {moduleList.map((item, index) => {
                  const isSelected =
                    selectedIndex === item.name ||
                    item.subMenu?.some((s) => s.path === currentNav);
                  const isReports = item.name === "Reports";

                  return (
                    <React.Fragment key={item.name}>
                      {!isReports ? (
                        <ListItem
                          onClick={() =>
                            handleListItemClick(item.name, item.path)
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: "#008755",
                              color: "white",
                            },
                            backgroundColor: isSelected ? "#008755" : "inherit",
                            color: isSelected ? "#fff" : "inherit",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            cursor: "pointer",
                            borderTopRightRadius: index === 0 ? "5px" : "0",
                          }}
                        >
                          <ListItemText
                            className="dubai-med"
                            primary={item.name}
                          />
                        </ListItem>
                      ) : (
                        <>
                          <ListItem
                            onClick={() => setReportsOpen(!reportsOpen)}
                            sx={{
                              backgroundColor: reportsOpen
                                ? "#008755"
                                : "inherit",
                              color: reportsOpen ? "#fff" : "inherit",
                              "&:hover": {
                                backgroundColor: "#008755",
                                color: "#fff",
                              },
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              cursor: "pointer",
                            }}
                          >
                            <ListItemText
                              className="dubai-med"
                              primary={item.name}
                            />
                            <IconButton size="small" sx={{ color: "inherit" }}>
                              <ExpandMoreIcon
                                sx={{
                                  transform: reportsOpen
                                    ? "rotate(0deg)"
                                    : "rotate(270deg)",
                                  transition: "0.2s",
                                }}
                              />
                            </IconButton>
                          </ListItem>

                          <Collapse
                            in={reportsOpen}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ mt: "1px" }} />
                            <List component="div" disablePadding>
                              {item.subMenu?.map((subItem: any) => {
                                const isSubActive =
                                  currentNav.replace("/tournaments", "") ===
                                  subItem.path;
                                return (
                                  <ListItem
                                    key={subItem.name}
                                    onClick={() => {
                                      handleListItemClick(
                                        subItem.name,
                                        subItem.path
                                      );
                                    }}
                                    sx={{
                                      backgroundColor: isSubActive
                                        ? "#008755"
                                        : "#0087551A",
                                      color: isSubActive ? "#fff" : "#333",
                                      "&:hover": {
                                        backgroundColor: "#008755",
                                        color: "#fff",
                                        mt: "1px",
                                      },
                                      cursor: "pointer",
                                    }}
                                  >
                                    <ListItemText
                                      primary={subItem.name}
                                      className="dubai-med"
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Collapse>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} md={10} xl={10.5}>
            <Box
              sx={{ paddingLeft: "8px", paddingTop: isMobile ? "8px" : "0px" }}
            >
              {children}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SubMenuLayout;
