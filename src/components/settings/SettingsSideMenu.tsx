import { useState, useEffect } from "react";
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type SettingsMenuProps = {
  menuID: number;
  title: string;
  menuLink?: string;
  subMenu?: { title: string; menuLink: string }[];
};

type SettingsSideMenuProps = {
  activeMenuID: number;
};

const SettingsSideMenu = ({ activeMenuID }: SettingsSideMenuProps) => {
  const router = useRouter();
  const [adminOpen, setAdminOpen] = useState(false);

  const settingsMenuItems: SettingsMenuProps[] = [
    { menuID: 1, title: "User Management", menuLink: "/user-management" },
    { menuID: 2, title: "Roles & Permissions", menuLink: "/roles-and-permissions" },
    { menuID: 3, title: "Season Settings", menuLink: "/season-settings" },
    {
      menuID: 4,
      title: "Admin Settings",
      subMenu: [
        { title: "Staff Role", menuLink: "/admin-settings/staff-role" },
        { title: "Contract Type", menuLink: "/admin-settings/contract-type" },
        { title: "Source of Recruitment", menuLink: "/admin-settings/source-of-recruitment" },
        { title: "Sports Category", menuLink: "/admin-settings/sports-category" },
        { title: "Rewards Type", menuLink: "/admin-settings/rewards-type" },
        { title: "Facility Type", menuLink: "/admin-settings/facility-type" },
        { title: "Sports List", menuLink: "/admin-settings/sports-list" },
      ],
    },
  ];

  // Check if any submenu is active
  const isSubmenuActive = settingsMenuItems.some(
    (item) =>
      item.subMenu?.some((subItem) => subItem.menuLink === router.pathname)
  );

  useEffect(() => {
    if (isSubmenuActive) {
      setAdminOpen(true);
    }
  }, [isSubmenuActive]);

  return (
    <Box
      sx={{
        width: "205px",
        height: "85vh",
        position: "absolute",
        top: 73,
        left: 110,
        backgroundColor: "#FFFFFF",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {settingsMenuItems.map((item) => {
        const isActive = item.menuID === activeMenuID || (item.subMenu && isSubmenuActive);
        const isAdmin = item.title === "Admin Settings";

        return (
          <Box key={item.title}>
            {!isAdmin ? (
              <Typography
                variant="caption"
                className="dubai-regular"
                sx={{
                  color: isActive ? "#FFFFFF" : "#333333",
                  backgroundColor: isActive ? "#008755" : "#FFFFFF",
                  padding: 1,
                  cursor: "pointer",
                  fontSize: "16px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  maxHeight:'40px',
                  "&:hover": {
                    color: "#FFFFFF",
                    backgroundColor: "#008755",
                  },
                }}
                onClick={() => item.menuLink && router.push(item.menuLink)}
              >
                {item.title}
              </Typography>
            ) : (
              <>
                {/* Admin Settings Dropdown */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: adminOpen ? "#FFFFFF" : "#333333",
                    backgroundColor: adminOpen ? "#008755" : "#FFFFFF",
                    padding: 1,
                    cursor: "pointer",
                    maxHeight:'40px',
                    "&:hover": {
                      color: "#FFFFFF",
                      backgroundColor: "#008755",
                    },
                  }}
                  onClick={() => setAdminOpen(!adminOpen)}
                >
                  <Typography
                    variant="caption"
                    className="dubai-regular"
                    sx={{ fontSize: "16px" }}
                  >
                    {item.title}
                  </Typography>
                  <IconButton size="small" sx={{ color: "inherit" }}>
                    <ExpandMoreIcon sx={{ transform: adminOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </IconButton>
                </Box>

                {/* Admin Settings Submenu (Inline Dropdown) */}
                {adminOpen && (
                  <List sx={{ backgroundColor: "#fff",padding: 0, margin: 0 }}>
                    {item.subMenu?.map((subItem) => {
                      const isSubMenuActive = router.pathname === subItem.menuLink;

                      return (
                        <ListItem
                          key={subItem.title}
                          sx={{
                            cursor: "pointer",
                            color: isSubMenuActive ? "#FFFFFF" : "#333333",
                            backgroundColor: isSubMenuActive ? "#008755" : "#0087551A",
                            "&:hover": { color: "#FFFFFF", backgroundColor: "#008755" },
                            marginY: 0.2,
                            paddingY: "8px", // Reduce vertical padding
                            paddingX: "12px",
                            maxHeight:'40px', 
                          }}
                          onClick={() => router.push(subItem.menuLink)}
                        >
                          <Typography
                            variant="caption"
                            className="dubai-regular"
                            sx={{ fontSize: "16px" }}
                          >
                            {subItem.title}
                          </Typography>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default SettingsSideMenu;
